//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

document.getElementById('body').addEventListener("dragover", (event) => {
    event.preventDefault()
})
document.getElementById('body').addEventListener("drop", (event) => {
    event.preventDefault()
    window.electron.receivedDrop(event.dataTransfer.files[0].name)
    //read-file-list
})

var ok_icon = `<svg width="20px" height="20px" viewBox="0 0 48 48" version="1" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48">
    <circle fill="#4CAF50" cx="24" cy="24" r="21"/>
    <polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"/>
</svg>`;

//document.getElementById('submit-login-form').addEventListener("click", function(event) {
//    console.log("Submit button was clicked!!!");
//})

const table = document.getElementById('downloads')
window.electron.receivedTableRow((event, value) => {
    //const oldValue = Number(counter.innerText)
    //const newValue = oldValue + value
    //counter.innerText = newValue
    var node = document.createElement('tr');
    node.id = "item-" + value.id;
    var rowStatus = "download-failed";
    var icon = "";
    if (value.status == "downloaded") {
        rowStatus = "download-success";
        icon = ok_icon;
    }
    node.innerHTML = "<td class='table-id'>" + icon + "</td><td class='table-name'>" + value.pathname.slice(0,65) + "</td><td class='table-md5sum'>" + value.MD5SUM.slice(0,6) + "...</td><td class='status'><span class='" + rowStatus + "'>" + value.status + "</span></td>";
    table.appendChild(node);
})

window.electron.updateTableRow((event, value) => {
    // find the id in the table and update all values
    var row_id = "item-" + value.id;
    var tr = document.querySelector('#' + row_id);
    var rowStatus = "";
    var icon = "";
    if (value.status == "downloaded") {
        rowStatus = "download-success";
        icon = ok_icon;
    }
    // does this replace all values in the row?
    tr.innerHTML = "<td class='table-id'>" + icon + "</td><td class='table-name'>" + value.pathname.slice(0,65) + "</td><td class='table-md5sum'>" + value.MD5SUM.slice(0,6) + "...</td><td class='status'><span class='" + rowStatus + "'>" + value.status + "</span></td>";
})


window.electron.getDownloadProgress((event, value) => {
    // go to that row and update the status
    // find the correct row based on value.id
    //console.log("got some progress for the download " + value.progress.percent);
    var tr = document.getElementById("item-" + value.id);
    var n = document.createTextNode(Math.round(100*value.progress.percent) + "%");
    tr.cells[3].innerHTML = '';
    tr.cells[3].appendChild(n);
    var a = document.createElement("div");
})

window.electron.getDownloadError((event, msg) => {
    // mark this line as erroneous download
    var tr = document.getElementById("item-" + msg.id);
    var n = document.createElement("span");
    n.setAttribute("title", msg.message);
    n.classList.add("download-failed");
    n.appendChild(document.createTextNode("failed"));
    tr.cells[3].innerHTML = '';
    tr.cells[3].appendChild(n);
})

window.electron.getTotalDownloadProgress((event, value) => {
    const progressBar = document.querySelector("progress-bar");
    progressBar.setAttribute("aria-valuenow", Math.round(100*value.progress.percent));
})

window.electron.setStorageLocation((event, location) => {
    console.log("got a setStorageLocation call with " + location);
    var n = document.createTextNode(location);
    document.querySelector("span.storage-location").innerHTML = '';
    document.querySelector("span.storage-location").appendChild(n);
})

window.electron.setBootstrapTheme((event, value) => {
    // set-bootstrap-theme
    document.documentElement.setAttribute('data-bs-theme',value);
})

function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

window.electron.getDownloadComplete((event, item) => {
    var tr = document.getElementById("item-" + item.id);
    var s = "unknown";
    if (typeof item.fileSize != "undefined")
        s = item.fileSize;
    var n = document.createElement("span");
    n.classList.add("download-success");
    n.appendChild(document.createTextNode(humanFileSize(s)));
    tr.cells[3].innerHTML = '';
    tr.cells[3].appendChild(n);
    var icon = ok_icon;
    tr.cells[0].innerHTML = icon;
    //console.log("download is complete");
})

window.electron.getDownloadExistsAtDestination((event, item) => {
    var tr = document.getElementById("item-" + item.id);
    var s = "unknown";
    if (typeof item.fileSize != "undefined")
        s = item.fileSize;
    var n = document.createElement("span");
    n.classList.add("download-success");
    n.appendChild(document.createTextNode(humanFileSize(s)));
    tr.cells[3].innerHTML = '';
    tr.cells[3].appendChild(n);
})

//const set_directory_button = document.getElementById('set-download-location');
//set_directory_button.addEventListener("click", function(event) {
//    window.electron.setDownloadLocation();
//})
const set_directory_a = document.getElementById('download-to-text-button');
set_directory_a.addEventListener("click", function(event) {
    window.electron.setDownloadLocation();
})

const start_download_button = document.getElementById('start-download');
start_download_button.addEventListener("click", function(event) {
    window.electron.startDownload();
})


const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
}

func()

// define the progress bar's functionality
class ProgressBar extends HTMLElement {
	#label;
	#progress;
	
	constructor(){
		super();
		
		this.#label = this.querySelector(".label");
		this.#progress = this.querySelector(".progress");
	}// constructor
	
	attributeChangedCallback(attribute, previous, current){
		switch(attribute){
			case "aria-valuenow": {
				if(current >= 0 && current <= 100){
					// update the meter using this stroke dashes
					this.#progress.setAttribute("stroke-dashoffset", 100 - current);
					// update the label
					this.#label.innerText = current;	
				}
				break;
			}
		}
	}// atributeChangedCallback
	static get observedAttributes(){
		return [ "aria-valuenow" ];
	}
}// ProgressBar

// add it to the custom element registry
window.customElements.define("progress-bar", ProgressBar);

// demonstrate its functionality
