const { app, BrowserWindow, shell, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let mainWindow;

// Link base per scaricare i file direttamente da GitHub raw
const REPO_RAW = 'https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/';
const LOCAL_VERSION_FILE = path.join(__dirname, 'version.txt');

// Controlla aggiornamenti all’avvio
async function checkForUpdate() {
    try {
        const res = await axios.get(REPO_RAW + 'version.txt');
        const remoteVersion = res.data.trim();

        let localVersion = '0.0.0';
        if (fs.existsSync(LOCAL_VERSION_FILE)) {
            localVersion = fs.readFileSync(LOCAL_VERSION_FILE, 'utf8').trim();
        }

        if (remoteVersion !== localVersion) {
            const choice = dialog.showMessageBoxSync(mainWindow, {
                type: 'info',
                buttons: ['Aggiorna', 'Ignora'],
                defaultId: 0,
                cancelId: 1,
                title: 'Aggiornamento disponibile',
                message: `Nuova versione disponibile: ${remoteVersion}\nVersione attuale: ${localVersion}`
            });

            if (choice === 0) {
                await updateFiles();
                fs.writeFileSync(LOCAL_VERSION_FILE, remoteVersion);
                dialog.showMessageBoxSync(mainWindow, {
                    type: 'info',
                    buttons: ['OK'],
                    title: 'Aggiornamento completato',
                    message: 'Il launcher è stato aggiornato con successo!'
                });
            }
        }
    } catch (err) {
        console.error('Errore durante il controllo aggiornamenti:', err);
    }
}

// Scarica i file aggiornati e mostra mini caricamento
async function updateFiles() {
    const filesToUpdate = [
        'index.html',
        'login.html',
        // aggiungi altri file che vuoi aggiornare
    ];

    for (const file of filesToUpdate) {
        try {
            const res = await axios.get(REPO_RAW + file, { responseType: 'arraybuffer' });
            const localPath = path.join(__dirname, file);
            fs.writeFileSync(localPath, res.data);
            console.log(`Aggiornato: ${file}`);
        } catch (err) {
            console.error(`Errore aggiornando ${file}:`, err);
        }
    }
}

// Crea la finestra principale
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile('login.html');

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.once('ready-to-show', () => {
        checkForUpdate();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
