const { app, BrowserWindow } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('disable-web-security');

async function createWindow() {
  let isDev;
  try {
    isDev = await import('electron-is-dev').then(module => module.default);
  } catch (error) {
    console.error('Error importing electron-is-dev:', error);
    isDev = false; // Default to false if import fails
  }

  // Disable Electron security warnings in development
  if (isDev) {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration for security
      contextIsolation: true, // Enable context isolation
      enableRemoteModule: false, // Disable remote module
      preload: path.join(__dirname, 'renderer.js'), // Add preload script
      webSecurity: false, // Disable web security (disables CSP)
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000/' // Change this to load the login page directly
      : `file://${path.join(__dirname, '../frontend/public/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  // Add Content Security Policy
  win.webContents.on('did-finish-load', () => {
    // Comment out or remove this block to disable CSP
    /*
    win.webContents.executeJavaScript(`
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:5001; img-src 'self' data:;";
      document.getElementsByTagName('head')[0].appendChild(meta);
    `);
    */
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

console.log('Rendering Nav');
console.log('Rendering Welcome');