@echo off
title TerraShield
echo.
echo  ==========================================
echo   TERRASHIELD v1.0.0
echo   Iniciando servidor Flask...
echo  ==========================================
echo.

:: Verificar que Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python no encontrado.
    echo  Instale Python desde https://www.python.org
    pause
    exit
)

:: Verificar que Flask está instalado
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo  Instalando Flask...
    pip install flask
)

:: Verificar openpyxl (exportación Excel)
python -c "import openpyxl" >nul 2>&1
if errorlevel 1 (
    echo  Instalando openpyxl...
    pip install openpyxl
)

:: Verificar reportlab (exportación PDF)
python -c "import reportlab" >nul 2>&1
if errorlevel 1 (
    echo  Instalando reportlab...
    pip install reportlab
)

:: Iniciar servidor Flask (bloquea aquí hasta que el usuario cierre la ventana)
echo  Servidor corriendo en http://localhost:8000
echo  Cierre esta ventana para detener la aplicacion.
echo.
python iniciar.py
python servidor.py
