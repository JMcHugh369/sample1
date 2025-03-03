const { app, BrowserWindow } = require('electron');
const path = require('path');
const waitOn = require('wait-on');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // Load the React app
}

app.whenReady().then(() => {
  const opts = {
    resources: ['http://localhost:3000'],
    delay: 1000, // initial delay in ms, before checking for the resource
    interval: 100, // poll interval in ms, to check for the resource
    timeout: 60000, // timeout in ms, to stop waiting for the resource
    window: 1000 // stabilization time in ms, to wait after the resource is found
  };

  waitOn(opts, (err) => {
    if (err) {
      console.error('Error waiting for React server:', err);
      app.quit();
      return;
    }
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});