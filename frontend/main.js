const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let flaskProcess;
let reactProcess;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load the React app
    win.loadURL('http://localhost:3000');

    // Open the DevTools (optional)
    // win.webContents.openDevTools();

    // Start the Flask server
    flaskProcess = spawn('python', ['../backend/run.py'], {
        stdio: 'inherit',
        shell: true,
        windowsHide: true
    });

    // Handle Flask server errors
    flaskProcess.on('error', (error) => {
        console.error(`Error starting Flask server: ${error}`);
    });

    // Handle Flask server exit
    flaskProcess.on('exit', (code, signal) => {
        console.log(`Flask server exited with code ${code} and signal ${signal}`);
    });

    win.on('closed', () => {
        console.log('Electron window closed');
        // Terminate the Flask server process when the Electron window is closed
        if (flaskProcess && !flaskProcess.killed) {
            flaskProcess.kill('SIGINT');
        }
        // Terminate the React development server process
        if (reactProcess && !reactProcess.killed) {
            reactProcess.kill('SIGINT');
        }
        app.quit();
    });
}

app.whenReady().then(() => {
    // Start the React development server
    reactProcess = spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: true,
        windowsHide: true
    });

    // Handle React server errors
    reactProcess.on('error', (error) => {
        console.error(`Error starting React server: ${error}`);
    });

    // Handle React server exit
    reactProcess.on('exit', (code, signal) => {
        console.log(`React server exited with code ${code} and signal ${signal}`);
    });

    createWindow();
});

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