const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
  let isDev;
  try {
    isDev = await import('electron-is-dev').then(module => module.default);
  } catch (error) {
    console.error('Error importing electron-is-dev:', error);
    isDev = false; // Default to false if import fails
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Set to false for security
      contextIsolation: true, // Enable context isolation
      enableRemoteModule: false, // Disable remote module
      preload: path.join(__dirname, 'renderer.js'), // Add preload script
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

  // Add Content Security Policy
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000;";
      document.getElementsByTagName('head')[0].appendChild(meta);
    `);
  });
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