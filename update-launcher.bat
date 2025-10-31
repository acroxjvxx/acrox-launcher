@echo off
echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO LOCALE
echo ========================================
echo.

:: Incremento patch della versione
setlocal enabledelayedexpansion
set versionFile=version.txt
set version=0.0.0
if exist %versionFile% (
    set /p version=<%versionFile%
)
for /f "tokens=1-3 delims=." %%a in ("%version%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)
set /a patch+=1
set "newVersion=!major!.!minor!.!patch!"
echo !newVersion!> %versionFile%
echo Versione aggiornata a !newVersion!
echo.

:: Aggiorna i file HTML e version.txt
git add *.html
git add version.txt

:: Commit
git commit -m "Aggiornamento automatico versione !newVersion!"

:: PRIMA integra eventuali modifiche remote
git pull --rebase origin main

:: Poi push
git push origin main

echo.
echo ✅ Aggiornamento caricato su GitHub!
echo Ora gli utenti riceveranno la nuova versione al prossimo avvio del launcher.
echo.
pause
