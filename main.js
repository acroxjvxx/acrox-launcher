const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper'); // <-- modulo corretto installato in dependencies

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('login.html');

  // Aprire link esterni nel browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Controllo aggiornamenti
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
          message: `È disponibile una nuova versione (${remoteVersion}). Vuoi aggiornare ora?`
        });

        if (choice === 0) downloadUpdate(remoteVersion);
      }
    });
  }).on('error', (err) => console.error('Errore controllo aggiornamento:', err));
}

// Scarica aggiornamento con barra di progresso
function downloadUpdate(remoteVersion) {
  const zipUrl = 'https://github.com/acroxjvxx/acrox-launcher/archive/refs/heads/main.zip';
  const tempPath = path.join(app.getPath('temp'), 'update.zip');
  const file = fs.createWriteStream(tempPath);

  let receivedBytes = 0;
  let totalBytes = 0;

  mainWindow.loadURL('data:text/html,<h1 style="font-family:sans-serif;text-align:center;">Scaricamento aggiornamento... 0%</h1>');

  https.get(zipUrl, (res) => {
    totalBytes = parseInt(res.headers['content-length'], 10);

    res.on('data', chunk => {
      receivedBytes += chunk.length;
      let percent = Math.floor((receivedBytes / totalBytes) * 100);
      mainWindow.loadURL(`data:text/html,<h1 style="font-family:sans-serif;text-align:center;">Scaricamento aggiornamento... ${percent}%</h1>`);
    });

    res.pipe(file);

    file.on('finish', () => {
      file.close();

      // Estrae il ZIP e sovrascrive i file locali
      fs.createReadStream(tempPath)
        .pipe(unzipper.Extract({ path: __dirname }))
        .on('close', () => {
          fs.writeFileSync(path.join(__dirname, 'version.txt'), remoteVersion);
          dialog.showMessageBoxSync({
            type: 'info',
            title: 'Aggiornamento completato',
            message: 'Aggiornamento completato! Riavvia il launcher per applicarlo.'
          });
        });
    });
  }).on('error', (err) => {
    console.error('Errore download aggiornamento:', err);
    dialog.showErrorBox('Errore', 'Non è stato possibile scaricare l\'aggiornamento.');
  });
}

app.whenReady().then(() => {
  createWindow();
  checkForUpdates();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
