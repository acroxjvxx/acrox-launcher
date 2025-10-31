const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('login.html');

  // Aprire link esterni nel browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

// Controlla se ci sono aggiornamenti
function checkForUpdates() {
  const localVersionPath = path.join(__dirname, 'version.txt');
  const remoteVersionUrl = 'https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/version.txt';

  https.get(remoteVersionUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const remoteVersion = data.trim();
      const localVersion = fs.existsSync(localVersionPath)
        ? fs.readFileSync(localVersionPath, 'utf8').trim()
        : '0.0.0';

      if (remoteVersion !== localVersion) {
        const choice = dialog.showMessageBoxSync({
          type: 'info',
          buttons: ['Aggiorna ora', 'Annulla'],
          title: 'Aggiornamento disponibile',
          message: `È disponibile una nuova versione (${remoteVersion}).
