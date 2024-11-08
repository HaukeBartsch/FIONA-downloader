import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron/main';
import { dialog } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import https from 'node:https'
//const { download } = require('electron-dl')
import { download } from 'electron-dl';

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Store from 'electron-store';

const store = new Store();

var current_data = []; // keep a record on the server for what we forward to the viewer
var current_download_location = "";
var credentials = {username: "", password: ""};

var command_line_args =  process.argv;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 960,
    height: 420,
    icon: "/images/logo/ios/iTunesArtwork",
    webPreferences: {
      //nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  win.loadFile('index.html')
  nativeTheme.themeSource = 'system';
  
  win.webContents.on('did-finish-load', function() {
    if (nativeTheme.shouldUseDarkColors) {
      console.log("Dark Theme Chosen by User");
      win.webContents.send('set-bootstrap-theme', 'dark');
    } else {
      console.log("Light Theme Chosen by User");
      win.webContents.send('set-bootstrap-theme', 'light');
    }
    win.webContents.send("update-storage-location", current_download_location);


    // TODO: does not contain command line arguments when started with
    // npm start -- a_file_name
    console.log("got a command line argument here as: " + JSON.stringify(command_line_args))

    // Ask user to load a .fiona file.
    // TODO: Only do this if the user did not start by double-clicking on a 
    // .fiona file, use that instead.
    dialog.showOpenDialog(win, { 
      properties: ['openFile', 'multiSelections'], 
      filters: [ { name: 'FIONA download files', extensions: ['.fiona'] }] }).then((fileNames) => {
        if(fileNames === undefined){
          console.log("No file selected");
          return;
        }
        // do a read-file-list now
        for (var i = 0; i < fileNames.filePaths.length; i++) {
          // read in that .fiona
          readDotFiona(win, fileNames.filePaths[i])
        }        
      });    
      
    })
    
    nativeTheme.on("updated", () => {
      console.log("Theme update event");
      
      if (nativeTheme.shouldUseDarkColors) {
        console.log("Dark Theme Chosen by User");
        win.webContents.send('set-bootstrap-theme', 'dark');
        //document.documentElement.setAttribute('data-bs-theme','dark')
      } else {
        console.log("Light Theme Chosen by User");
        win.webContents.send('set-bootstrap-theme', 'light');
        //document.documentElement.setAttribute('data-bs-theme','light')
      }
    });
    
    win.webContents.openDevTools();
  }
  
  var illegalRe = /[\/\?<>\\:\*\|":]/g;
  var controlRe = /[\x00-\x1f\x80-\x9f]/g;
  var reservedRe = /^\.+$/;
  var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  
  function sanitize(input, replacement) {
    var sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement);
    return sanitized.slice(0, 255);
  }
  
  // read a .fiona file exported from Exports
  function readDotFiona(win, fn) {
    win.setRepresentedFilename(fn);
    win.setDocumentEdited(true);
    const fileContent = fs.readFileSync(fn, { encoding: 'utf-8' });
    var lines = fileContent.split("\n");
    for (var i = 0; i < lines.length; i++) {
      var trimmed = lines[i].trim();
      if (trimmed[0] == "#")
        continue;
      if (trimmed.length == 0)
        continue;
      var pieces = trimmed.split(",")
      // accept this as a filename and send to render to be put into table
      var status = "";
      var p = path.join(current_download_location, pieces[0]);
      if (fs.existsSync(p)) {
        status = "downloaded";
      }
      var dat = { id: current_data.length, pathname: pieces[0], MD5SUM: pieces[1], status: status };
      current_data[current_data.length] = dat;
      win.webContents.send('create-table-row', dat);
    }
  }
  
  /*  // handle arguments in process.argv  process.argv.slice(2)
  */
  
  app.whenReady().then(() => {
    current_download_location = store.get('current_download_location');

    if (typeof current_download_location == "undefined") { // undefined if not exist in store
      current_download_location = app.getPath("downloads"); // some default directory
    }
    
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('read-file-list', (event, filename) => {
      var fn = path.join(__dirname, sanitize(filename));
      if (!fs.existsSync(fn)) {
        console.log('file could not be found');
        return;
      }
      console.log("handling read-file-list" + fn);
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      
      readDotFiona(win, fn)
      /*win.setRepresentedFilename(fn);
      win.setDocumentEdited(true);
      const fileContent = fs.readFileSync(fn, { encoding: 'utf-8' });
      var lines = fileContent.split("\n");
      for (var i = 0; i < lines.length; i++) {
      var trimmed = lines[i].trim();
      if (trimmed[0] == "#")
      continue;
      if (trimmed.length == 0)
      continue;
      var pieces = trimmed.split(",")
      // accept this as a filename and send to render to be put into table
      var status = "";
      var p = path.join(current_download_location, pieces[0]);
      if (fs.existsSync(p)) {
      status = "downloaded";
      }
      var dat = { id: current_data.length, pathname: pieces[0], MD5SUM: pieces[1], status: status };
      current_data[current_data.length] = dat;
      win.webContents.send('create-table-row', dat);
      }*/
    })
    ipcMain.handle('set-download-location', async (event, operation) => {
      const properties = operation === 'export' ? ['openDirectory', 'createDirectory'] : ['openDirectory'];
      const result = await dialog.showOpenDialog({
        properties: properties,
        defaultPath: current_download_location
      });
      if (result.canceled) {
        return null;
      } else {
        current_download_location = result.filePaths[0];
        // store that location
        store.set('current_download_location', current_download_location);

        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.webContents.send("update-storage-location", current_download_location);
        // TODO: update all the status fields again (files might exist already at these locations)
        for (var i = 0; i < current_data.length; i++) {
          // ask for an update on the status for this item
          var status = "";
          var p = path.join(current_download_location, current_data[i].pathname);
          if (fs.existsSync(p)) {
            status = "downloaded";
          }
          var dat = { id: current_data[i].id, pathname: current_data[i].pathname, MD5SUM: current_data[i].MD5SUM, status: status };
          win.webContents.send('update-table-row', dat);
        }
        return result.filePaths[0];
      }
    });
    ipcMain.handle('start-download', async function(event) {
      // do we have a directory to store data in?
      // do we have files to download?
      console.log("get going now");
      // update the interface if things change (send updates as progress, in preparation etc etc.)
      // ask for username and password
      
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      //const win = BrowserWindow.fromWebContents(webContents)
      
      // all files that have not been downloaded yet is in current_data
      //if (current_download_location == "") {
      //  current_download_location = app.getPath("userData"); // some default directory
      //}
      
      // how much data do we need to download?
      var totalNumFiles = 0;
      for (var i = 0; i < current_data.length; i++) {
        var p = path.join(current_download_location, current_data[i].pathname);
        if (fs.existsSync(p)) {
          continue; // skip this entry
        }
        totalNumFiles++;
      }
      var accumulatedSize = 0; // when we are finished add
      for (var i = 0; i < current_data.length; i++) {
        const win = BrowserWindow.fromWebContents(webContents);
        var url = "http://localhost:3000/index.php?filename=" + current_data[i].pathname;
        // check if that file already exists in the current_download_location
        var p = path.join(current_download_location, current_data[i].pathname);
        if (fs.existsSync(p)) {
          // create a fake progress
          var item = { id: current_data[i].id, fileSize: 0 };
          fs.stat(p, (err, fileStats) => {
            item.fileSize = fileStats.size;
            win.webContents.send("download-exists-at-destination", item)  
          });
          continue; // skip this entry
        }
        // what is the total size to download?
        
        await download(win /*BrowserWindow.getFocusedWindow()*/, url, {
          filename: current_data[i].pathname,
          directory: current_download_location,
          onProgress: (progress) => {
            console.log("got a single file progress: " + JSON.stringify(progress));
            win.webContents.send("download-progress", { progress: progress, id: current_data[i].id });
          },
          onTotalProgress: (progress) => {
            // download across all files
            console.log("got a total progress, TODO" + JSON.stringify(progress));
            // sum of current size and accumulatedSize from before
            var s = (i * (1/totalNumFiles)) + ((1/totalNumFiles)*(progress.transferredBytes/ progress.totalBytes));
            var progress = { percent: s };
            win.webContents.send('total-download-progress', { progress: progress })
          },
          onCompleted: (item) => {
            accumulatedSize += item.fileSize;
            console.log("onComplete for " + JSON.stringify(item));
            item.id = current_data[i].id;
            win.webContents.send("download-complete", item)
          },
          onCancel: (item) => {
            // download failed
            console.log("Canceled download for item: " + JSON.stringify(item));
          }
        }).catch((error) => {
          //console.log("got an error downloading: " + error); // mark the status for this file with error message
          var item = { id: current_data[i].id, message: error };
          win.webContents.send("download-error", item)
        })
      }
      // all downloads finished
      shell.openPath(current_download_location)
    });
    
    createWindow()
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    
    app.on('login', async (event, webContents, request, authInfo, callback) => {
      event.preventDefault();
      // only if we don't have something in credentials yet, try to get them
      createAuthPrompt().then(creds => {
        credentials.username = creds.username;
        credentials.password = creds.password;
        //console.log(credentials.username + " " + credentials.password);
        callback(credentials.username, credentials.password);
      },
      reason => {
        console.log("failed in createAuthPrompt" + reason);
        callback("","");
      });
    });
  })
  
  function createAuthPrompt() {
    
    const authPromptWin = new BrowserWindow({
      show: false,
      modal: true,
      parent: BrowserWindow.getFocusedWindow(),
      width: 350,
      height: 280,
      title: "FIONA credentials",
      webPreferences: {
        //nodeIntegration: true,
        preload: path.join(__dirname, 'auth-form-preload.js')
      }
    });
    authPromptWin.setMenu(null);
    
    authPromptWin.on('ready-to-show', function() {
      authPromptWin.show();
      
      if (nativeTheme.shouldUseDarkColors) {
        authPromptWin.webContents.send('set-bootstrap-theme', 'dark');
      } else {
        console.log("Light Theme Chosen by User");
        authPromptWin.webContents.send('set-bootstrap-theme', 'light');
      }
      
    });
    
    authPromptWin.loadFile("auth-form.html"); // load your html f
    
    return new Promise((resolve, reject) => {
      // only do a single form-submission here
      ipcMain.handleOnce("form-submission", (event, username, password) => {
        if (!authPromptWin.isDestroyed())
          authPromptWin.close();
        const credentials = {
          username,
          password
        };
        resolve(credentials);
      });
    });
  }
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  