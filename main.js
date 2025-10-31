const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const fileUrl = 'https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/index.html';
const localFile = path.join(__dirname, 'index.html');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(`Errore HTTP ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data, 'utf8');
        resolve();
      });
    }).on('error', reject);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  try {
    console.log('Aggiornamento index.html da GitHub...');
    await downloadFile(fileUrl, localFile);
    console.log('File aggiornato!');
  } catch (err) {
    console.warn('Errore durante l\'aggiornamento:', err);
    dialog.showErrorBox('Errore aggiornamento', 'Non è stato possibile aggiornare index.html\n' + err);
  }

  console.log('Carico file da:', localFile);
  win.loadFile(localFile);

  // forza reload senza cache
  win.webContents.once('did-finish-load', () => {
    win.webContents.reloadIgnoringCache();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
