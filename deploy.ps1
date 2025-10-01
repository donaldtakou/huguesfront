# Script de déploiement FastDeal Frontend pour Windows PowerShell
# À exécuter depuis le dossier frontend: .\deploy.ps1

Write-Host "🚀 FastDeal Frontend - Déploiement automatique" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend" -ForegroundColor Red
    Write-Host "💡 Solution: cd frontend puis .\deploy.ps1" -ForegroundColor Yellow
    exit 1
}

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Téléchargez-le depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Vérifier si npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Installer les dépendances
Write-Host "📦 Installation/Mise à jour des dépendances..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Build de production
Write-Host "🔨 Création du build de production..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    Write-Host "💡 Vérifiez les erreurs TypeScript ci-dessus" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Build créé avec succès" -ForegroundColor Green
Write-Host ""

# Vérifier si Vercel CLI est installé
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI détecté" -ForegroundColor Green
} catch {
    Write-Host "🔧 Installation de Vercel CLI..." -ForegroundColor Blue
    npm install -g vercel
}

# Déploiement sur Vercel
Write-Host "🌐 Déploiement sur Vercel..." -ForegroundColor Blue
Write-Host "📝 Note: Lors du premier déploiement, vous devrez :" -ForegroundColor Yellow
Write-Host "   1. Vous connecter à Vercel (compte GitHub/GitLab/Email)" -ForegroundColor Yellow
Write-Host "   2. Choisir les paramètres par défaut" -ForegroundColor Yellow
Write-Host "   3. Confirmer le déploiement" -ForegroundColor Yellow
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Déploiement réussi!" -ForegroundColor Green
    Write-Host "📱 Votre site est maintenant accessible via l'URL affichée ci-dessus" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Blue
    Write-Host "   1. Testez le site sur différents appareils" -ForegroundColor White
    Write-Host "   2. Partagez le lien avec vos testeurs" -ForegroundColor White
    Write-Host "   3. Configurez un domaine personnalisé (optionnel)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Liens utiles:" -ForegroundColor Blue
    Write-Host "   - Dashboard Vercel: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   - Analytics: https://vercel.com/analytics" -ForegroundColor White
    Write-Host "   - Domaines: https://vercel.com/domains" -ForegroundColor White
} else {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host "💡 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "   1. Vérifiez votre connexion internet" -ForegroundColor White
    Write-Host "   2. Réessayez: vercel --prod" -ForegroundColor White
    Write-Host "   3. Consultez: https://vercel.com/docs" -ForegroundColor White
}