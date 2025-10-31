const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const localPath = path.join(app.getPath('userData'), 'index.html');
const remoteUrl = 'https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/index.html';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(`Errore ${res.statusCode} nel download`);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data, 'utf8');
        resolve('File aggiornato correttamente');
      });
    }).on('error', reject);
  });
}

async function ensureLatestFile() {
  try {
    console.log('Aggiornamento index.html da GitHub...');
    await downloadFile(remoteUrl, localPath);
    console.log('Aggiornamento completato!');
  } catch (err) {
    console.warn('Impossibile aggiornare da GitHub, uso versione locale:', err);
    if (!fs.existsSync(localPath)) {
      // Prima installazione → copia index.html di backup
      fs.copyFileSync(path.join(__dirname, 'index.html'), localPath);
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(localPath);
}

app.whenReady().then(async () => {
  await ensureLatestFile();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
