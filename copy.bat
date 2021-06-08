mkdir ./build/src 
(robocopy ./src/shared ./build/src/shared /s) ^& (robocopy ./electron ./build/electron /s) ^& IF %ERRORLEVEL% LEQ 1 exit 0