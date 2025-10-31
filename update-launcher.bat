@echo off
echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO
echo ========================================
echo.

:: commit e push automatico su GitHub
git add .
git commit -m "Aggiornamento automatico"
git push origin main

echo.
echo ✅ Aggiornamento caricato su GitHub!
echo Gli utenti riceveranno la nuova versione.
echo.
pause
