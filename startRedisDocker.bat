@echo off

echo Starting Redis Stack...
docker start redis-stack

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

pause