@echo off
echo ========================================
echo    ACROX LAUNCHER - AGGIORNAMENTO
echo ========================================
echo.

:: Aggiorna la copia locale dal remoto
echo Controllo aggiornamenti da GitHub...
git pull origin main --rebase

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Si sono verificati conflitti durante il pull.
    echo Risolvi i conflitti manualmente prima di continuare.
    pause
    exit /b
)

:: Controlla se ci sono modifiche da commitare
git status --porcelain > temp_status.txt
set /p changes=<temp_status.txt
del temp_status.txt

if "%changes%"=="" (
    echo Nessuna modifica da caricare su GitHub.
) else (
    :: Commit e push automatico
    git add .
    git commit -m "Aggiornamento automatico"
    git push origin main
    echo.
    echo ✅ Aggiornamento caricato su GitHub!
    echo Gli utenti riceveranno la nuova versione.
)

echo.
pause
