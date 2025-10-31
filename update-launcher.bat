@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO AUTOMATICO
echo ========================================
echo.

:: Legge la versione corrente da version.txt
set "versionFile=version.txt"
set "version=0.0.0"

if exist %versionFile% (
    set /p version=<%versionFile%
)

:: Incrementa automaticamente la versione (ultimo numero)
for /f "tokens=1-3 delims=." %%a in ("%version%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)

:: Incrementa il patch
set /a patch+=1
set "newVersion=!major!.!minor!.!patch!"

:: Aggiorna version.txt con la nuova versione
echo !newVersion!> %versionFile%
echo Versione aggiornata: !version! -> !newVersion!
echo.

:: Aggiunge tutti i file modificati
git add .

:: Commit automatico
git commit -m "Aggiornamento automatico versione !newVersion!"

:: Push su GitHub
git push origin main

echo.
echo ✅ Aggiornamento caricato su GitHub!
echo Tutti gli utenti riceveranno la nuova versione al prossimo avvio del launcher.
echo.
pause
