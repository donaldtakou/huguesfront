#!/bin/bash

# Script de déploiement rapide FastDeal Frontend
# À exécuter depuis le dossier frontend

echo "🚀 FastDeal Frontend - Déploiement automatique"
echo "================================================="

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend"
    echo "💡 Solution: cd frontend && ./deploy.sh"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Vérifications initiales terminées"
echo ""

# Installer les dépendances
echo "📦 Installation/Mise à jour des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"
echo ""

# Build de production
echo "🔨 Création du build de production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    echo "💡 Vérifiez les erreurs TypeScript ci-dessus"
    exit 1
fi

echo "✅ Build créé avec succès"
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "🔧 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Déploiement sur Vercel
echo "🌐 Déploiement sur Vercel..."
echo "📝 Note: Lors du premier déploiement, vous devrez :"
echo "   1. Vous connecter à Vercel (compte GitHub/GitLab/Email)"
echo "   2. Choisir les paramètres par défaut"
echo "   3. Confirmer le déploiement"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Déploiement réussi!"
    echo "📱 Votre site est maintenant accessible via l'URL affichée ci-dessus"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "   1. Testez le site sur différents appareils"
    echo "   2. Partagez le lien avec vos testeurs"
    echo "   3. Configurez un domaine personnalisé (optionnel)"
    echo ""
    echo "🔗 Liens utiles:"
    echo "   - Dashboard Vercel: https://vercel.com/dashboard"
    echo "   - Analytics: https://vercel.com/analytics"
    echo "   - Domaines: https://vercel.com/domains"
else
    echo "❌ Erreur lors du déploiement"
    echo "💡 Solutions possibles:"
    echo "   1. Vérifiez votre connexion internet"
    echo "   2. Réessayez: vercel --prod"
    echo "   3. Consultez: https://vercel.com/docs"
fi