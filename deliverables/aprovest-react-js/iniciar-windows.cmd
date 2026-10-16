@echo off
rem ============================================================
rem  AproVest - Inicializador universal para Windows
rem  Funciona no Prompt de Comando (cmd) sem alterar politicas
rem  de execucao do PowerShell.
rem ============================================================

cd /d "%~dp0"

echo.
echo === AproVest - verificacao do ambiente ===
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado.
    echo Instale a versao 20 ou superior em https://nodejs.org
    echo e execute este arquivo novamente.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -v') do set NODE_MAJOR=%%v
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 20 (
    echo [ERRO] Node.js versao 20 ou superior e necessaria.
    node -v
    echo Atualize em https://nodejs.org
    pause
    exit /b 1
)

echo Node.js encontrado:
node -v
echo.

if not exist node_modules (
    echo Instalando dependencias pela primeira vez...
    echo Isso pode levar alguns minutos.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERRO] A instalacao falhou.
        echo Tente: npm cache clean --force
        echo e execute este arquivo novamente.
        pause
        exit /b 1
    )
)

echo.
echo === Iniciando o site ===
echo Quando aparecer "Local:", abra o endereco no navegador.
echo Para encerrar, pressione Ctrl+C.
echo.

call npm run dev
pause
