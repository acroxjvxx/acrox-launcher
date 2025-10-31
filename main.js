const { app, BrowserWindow, dialog } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Funzione per aggiornare il launcher
function updateLauncher() {
  exec('update-launcher.bat', (error, stdout, stderr) => {
    if (error) {
      dialog.showErrorBox('Errore aggiornamento', error.message);
      return;
    }

    // Mostra messaggio di conferma aggiornamento
    dialog.showMessageBox({
      type: 'info',
      title: 'Aggiornamento completato',
      message: 'Il launcher è stato aggiornato con successo!',
    });

    console.log(stdout);
  });
}

app.on('ready', createWindow);

// Optional: aggiungi un menu o pulsante nel renderer per richiamare updateLauncher()
app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Esporta la funzione se vuoi richiamarla dal renderer
module.exports = { updateLauncher };
