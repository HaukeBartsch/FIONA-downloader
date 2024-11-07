const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
  gotCredentials: (username, password) => {
    ipcRenderer.invoke('form-submission', username, password)
  },
  setBootstrapTheme: (callback) => {
    ipcRenderer.on('set-bootstrap-theme', callback);
  }
})