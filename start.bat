@echo off
echo.
echo ========================================
echo   DSC-SA Community Hub
echo   Starting All Services
echo ========================================
echo.

echo Starting Backend Server on port 5000...
cd /d "C:\DSC-SA site\backend"
start "Backend Server" cmd /k "node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak

echo Starting Frontend Server on port 3000...
cd /d "C:\DSC-SA site\frontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo Admin:     http://localhost:5000/admin.html
echo.
pause
