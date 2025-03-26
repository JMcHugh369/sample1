const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendData: (data) => ipcRenderer.send('send-data', data),
  receiveData: (callback) => {
    ipcRenderer.removeAllListeners('receive-data'); // Prevent duplicate listeners
    ipcRenderer.on('receive-data', (event, data) => callback(data));
  },
});
