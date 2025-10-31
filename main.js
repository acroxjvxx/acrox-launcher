const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const https = require('https');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    // Controlla aggiornamenti all'avvio
    checkUpdate();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Funzione per controllare aggiornamenti
function checkUpdate() {
    let localVersion = fs.readFileSync(path.join(__dirname, 'version.txt'), 'utf-8').trim();

    https.get('https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/version.txt', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            let remoteVersion = data.trim();
            if (remoteVersion !== localVersion) {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Aggiornamento disponibile',
                    message: `Nuova versione disponibile: ${remoteVersion}\nVuoi aggiornare ora?`,
                    buttons: ['Aggiorna', 'Annulla']
                }).then(result => {
                    if (result.response === 0) { // Se clicca Aggiorna
                        const batPath = path.join(__dirname, 'update-launcher.bat');
                        exec(`"${batPath}"`, (error, stdout, stderr) => {
                            if (error) console.error(error);
                        });
                    }
                });
            }
        });
    }).on('error', (err) => {
        console.error('Errore controllo aggiornamento:', err);
    });
}
