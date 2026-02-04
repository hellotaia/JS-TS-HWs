const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        title: 'Cosmic Adventure',
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#0a0a1a',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load the index.html file
    mainWindow.loadFile('index.html');

    // Remove menu bar
    mainWindow.setMenuBarVisibility(false);

    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
}

// Create window when app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
