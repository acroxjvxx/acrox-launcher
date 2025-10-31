const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");

function updateFileFromGitHub(filename) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/acroxjvxx/acrox-launcher/main/${filename}?t=${Date.now()}`;
    const localPath = path.join(__dirname, filename);

    console.log(`🔄 Controllo aggiornamento per ${filename}...`);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`❌ Errore HTTP ${res.statusCode}`));
        return;
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let isNew = false;
        if (fs.existsSync(localPath)) {
          const oldData = fs.readFileSync(localPath, "utf-8");
          if (oldData !== data) {
            isNew = true;
            fs.writeFileSync(localPath, data, "utf-8");
          }
        } else {
          fs.writeFileSync(localPath, data, "utf-8");
          isNew = true;
        }

        if (isNew) {
          console.log(`✅ Aggiornato: ${filename}`);
        } else {
          console.log(`🟡 Nessuna modifica per: ${filename}`);
        }

        resolve();
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function updateFiles() {
  const files = ["index.html"]; // Aggiungi altri file se vuoi aggiornare più risorse
  for (const f of files) {
    try {
      await updateFileFromGitHub(f);
    } catch (err) {
      console.error(`⚠️ Errore aggiornando ${f}:`, err.message);
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
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(async () => {
  console.log("🚀 Avvio launcher...");
  await updateFiles();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
