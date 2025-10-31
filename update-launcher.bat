@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO
echo ========================================
echo.

:: Chiedi la nuova versione
set /p newver="Inserisci la nuova versione (es. 1.0.1): "

:: Aggiorna version.txt
echo !newver! > version.txt
echo Versione aggiornata in version.txt: !newver!
echo.

:: Aggiungi tutti i file modificati al commit
git add .

:: Commit automatico
git commit -m "Aggiornamento automatico versione !newver!"

:: Push su GitHub
git push origin main

echo.
echo ✅ Aggiornamento caricato su GitHub!
echo Tutti gli utenti riceveranno la nuova versione quando apriranno il launcher.
echo.
pause
