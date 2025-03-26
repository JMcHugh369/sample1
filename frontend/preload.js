const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// ✅ Exposing API to renderer process
contextBridge.exposeInMainWorld('api', {
  sendData: (data) => ipcRenderer.send('send-data', data),
  receiveData: (callback) => {
    ipcRenderer.removeAllListeners('receive-data'); // Avoid multiple event listeners
    ipcRenderer.on('receive-data', (_, data) => callback(data));
  }
});
