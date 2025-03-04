const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
  const isDev = await import('electron-is-dev').then(module => module.default);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000/login' // Change this to load the login page directly
      : `file://${path.join(__dirname, '../public/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});