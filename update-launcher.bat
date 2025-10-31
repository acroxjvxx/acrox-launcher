@echo off
echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO LOCALE
echo ========================================
echo.

:: Mostra tutti i file modificati
git status

:: Aggiunge tutte le modifiche tranne i file ignorati
git add -A

:: Commit automatico
git commit -m "Aggiornamento automatico locale"

:: Pull remoto prima di push per evitare conflitti
git pull origin main --rebase

:: Push su GitHub
git push origin main

echo.
echo ✅ Aggiornamento caricato su GitHub!
echo Ora il launcher si aggiornera' al prossimo avvio.
pause
