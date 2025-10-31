@echo off
echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO LOCALE
echo ========================================
echo.

:: Spostati nella cartella del progetto
cd /d "%~dp0"

:: Salva eventuali modifiche locali
git add -A
git commit -m "Salvataggio modifiche locali" 2>nul

:: Aggiorna dal repository principale
git pull origin main

echo.
echo ✅ Aggiornamento completato!
pause
