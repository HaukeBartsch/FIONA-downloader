const { contextBridge, ipcRenderer } = require('electron')
//import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // we can also expose variables, not just functions
})

/*function processFilename(filename) {
   console.log("do something with a filename" + filename);
}*/

/*ipcRenderer.on('create-table-row', function(event, data) {
    console.log("received table row " + data);
    if (typeof data["pathname"] != "undefined") {
        
    }
});*/
contextBridge.exposeInMainWorld('electron', {
    receivedDrop: (fileName) => {
        // do something in the main function
        //ipcMain.invoke('receivedDrop', filename);
        // call function in main.js?
        ipcRenderer.invoke("read-file-list", fileName);

        // notify the render about something
        //ipcRenderer.send('receivedDrop', fileName)
    },
    receivedTableRow: (callback) => {
        ipcRenderer.on('create-table-row', callback)
    },
    updateSummary: (callback) => {
        ipcRenderer.on('update-summary', callback);
    },
    updateTableRow: (callback) => {
        ipcRenderer.on('update-table-row', callback)
    },
    setStorageLocation: (callback) => {
        // we only want to update a user interface element with the name
        ipcRenderer.on("update-storage-location", callback);
    },
    sendMessage: (callback) => {
        ipcRenderer.on("message", callback)
    },
    setDownloadLocation: (location) => { // 
        // we want to open a dialog to set a new download location
        ipcRenderer.invoke("set-download-location", location);
    },
    startDownload: () => {
        ipcRenderer.invoke("start-download");
    },
    getDownloadProgress: (callback) => {
        ipcRenderer.on('download-progress', callback)
    },
    getTotalDownloadProgress: (callback) => {
        ipcRenderer.on('total-download-progress', callback) // total-download-progress
    },
    getDownloadComplete: (callback) => {
        ipcRenderer.on('download-complete', callback)
    }, // checksum-message
    getChecksumMessage: (callback) => {
        ipcRenderer.on('checksum-message', callback)
    },
    getDownloadError: (callback) => {
        ipcRenderer.on('download-error', callback)
    },
    getDownloadExistsAtDestination: (callback) => {
        ipcRenderer.on('download-exists-at-destination', callback)
    },
    setBootstrapTheme: (callback) => {
        ipcRenderer.on('set-bootstrap-theme', callback);
    }/*,
    getLoginCredentials: (username, password) => {
        ipcRenderer.on('form-submission', username, password)
    }*/
})