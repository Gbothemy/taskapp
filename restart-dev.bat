@echo off
echo Restarting development environment...
echo.

echo Step 1: Stopping any running processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing build cache...
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Step 3: Starting development server...
echo.
echo ========================================
echo   TaskApp Development Server
echo ========================================
echo.
echo The app will open at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start