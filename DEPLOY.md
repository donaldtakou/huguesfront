# Guide de Déploiement FastDeal Frontend

## 🚀 Options de Déploiement Rapide

### Option 1: Vercel (Recommandé - Gratuit)

1. **Installation de Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déploiement depuis le dossier frontend**
   ```bash
   cd frontend
   vercel
   ```
   
3. **Suivre les instructions**
   - Connecter votre compte GitHub/GitLab
   - Choisir les paramètres par défaut
   - Le lien sera généré automatiquement

### Option 2: Netlify (Gratuit)

1. **Installation de Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build et déploiement**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=.next
   ```

### Option 3: Railway (Gratuit avec quota)

1. **Connexion à Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Déploiement**
   ```bash
   cd frontend
   railway link
   railway up
   ```

## 🔧 Configuration pour le Déploiement

### Variables d'environnement de production

Créer un fichier `.env.production` dans le dossier frontend :

```env
# API Backend (remplacer par votre URL de production)
NEXT_PUBLIC_API_URL=https://votre-backend.herokuapp.com/api

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=https://votre-app.vercel.app

# Configuration de test
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# URLs sociales (optionnel)
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/fastdeal
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/fastdeal
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/fastdeal

# Configuration des paiements de test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
```

### Script de déploiement automatique

```bash
#!/bin/bash
echo "🚀 Déploiement FastDeal Frontend..."

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécuter depuis le dossier frontend"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de production
echo "🔨 Build de production..."
npm run build

# Déployer sur Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé!"
echo "🔗 Votre lien de test sera affiché ci-dessus"
```

## 📱 Test du Site Mobile

### URL de test rapide avec Ngrok (local)

Si vous voulez tester localement avant le déploiement :

1. **Installer ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Lancer le frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Exposer via ngrok (dans un autre terminal)**
   ```bash
   ngrok http 3000
   ```

4. **Utiliser l'URL HTTPS générée pour tester sur mobile**

## 🔗 Liens de Test Recommandés

### Déploiement Vercel (Plus simple)

```bash
# Dans le dossier frontend
cd frontend
npm install
npm run build
npx vercel --prod
```

**Avantages Vercel:**
- Déploiement en 2 minutes
- HTTPS automatique
- Domaine gratuit `.vercel.app`
- Intégration Git automatique
- Rollback facile

### Déploiement Netlify (Alternative)

```bash
# Dans le dossier frontend
cd frontend
npm install
npm run build
npx netlify-cli deploy --prod --dir=.next
```

## 📋 Checklist avant Déploiement

- [ ] Vérifier que tous les composants sont responsive
- [ ] Tester la navigation mobile
- [ ] Vérifier les formulaires sur mobile
- [ ] Tester le panier et la recherche
- [ ] Valider l'affichage des images
- [ ] Tester les liens et boutons
- [ ] Vérifier les performances (GTmetrix, PageSpeed)

## 🐛 Problèmes Courants

### Erreur de build
```bash
# Nettoyer le cache
rm -rf .next
npm run build
```

### Problème d'environnement
```bash
# Vérifier les variables d'environnement
cat .env.local
cat .env.production
```

### Erreur de déploiement Vercel
```bash
# Réessayer avec verbose
vercel --debug
```

## 📧 Partage du Lien de Test

Une fois déployé, vous obtiendrez une URL du type :
- **Vercel**: `https://fastdeal-frontend.vercel.app`
- **Netlify**: `https://amazing-app-123456.netlify.app`
- **Railway**: `https://fastdeal.up.railway.app`

### Instructions pour les testeurs

Créer un message type :
```
🔗 Lien de test FastDeal Frontend: [URL]

📱 À tester:
- Navigation sur mobile/tablette/desktop
- Recherche de produits
- Ajout au panier
- Formulaires de contact
- Responsive design
- Performance de chargement

⚠️ Note: Backend en mode démo, pas de vrais paiements.
Merci pour vos retours! 🙏
```

---

**Temps estimé de déploiement**: 5-10 minutes
**Coût**: Gratuit (avec quotas)
**Domaine**: Inclus (.vercel.app ou .netlify.app)