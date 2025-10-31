const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

function updateFileFromGitHub(filename) {
    return new Promise((resolve, reject) => {
        const url = `https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/${filename}`;
        const localPath = path.join(__dirname, filename);

        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Errore aggiornamento ${filename}: ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                fs.writeFileSync(localPath, data, 'utf-8');
                resolve(`${filename} aggiornato correttamente!`);
            });
        }).on('error', err => reject(err));
    });
}

async function updateFiles() {
    const filesToUpdate = ['index.html']; // aggiungi altri file qui se vuoi
    for (const file of filesToUpdate) {
        try {
            const message = await updateFileFromGitHub(file);
            console.log(message);
        } catch (err) {
            console.error(err.message);
        }
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(async () => {
    await updateFiles(); // aggiorna i file da GitHub
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
