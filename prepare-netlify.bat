@echo off
echo 🚀 Preparation du deploiement Netlify...

REM Creer le dossier dist s'il n'existe pas
if not exist "dist" mkdir dist

REM Copier les fichiers de build
echo 📦 Copie des fichiers de build...
xcopy ".next\*" "dist\" /E /H /Y

REM Creer un fichier _redirects pour Netlify SPA
echo /* /index.html 200 > dist\_redirects

REM Creer un fichier netlify.toml
echo [build] > dist\netlify.toml
echo   publish = "." >> dist\netlify.toml
echo [build.environment] >> dist\netlify.toml
echo   NODE_VERSION = "18" >> dist\netlify.toml

echo ✅ Preparation terminee!
echo 📁 Dossier 'dist' pret pour Netlify Drop
echo 🌐 Allez sur: https://app.netlify.com/drop
echo 📤 Glissez-deposez le dossier 'dist' sur Netlify
pause