import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ADMIN_PASSWORD = 'chrollolucifer';
const ADMIN_SESSION_KEY = 'fastdeal_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);
      if (session) {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        // Vérifier si la session n'a pas expiré ET si elle contient les bonnes informations
        if (sessionData.expires > now && 
            sessionData.authenticated === true && 
            sessionData.timestamp && 
            sessionData.passwordHash) {
          console.log('Session valide trouvée, authentification automatique');
          setIsAuthenticated(true);
        } else {
          // Session invalide ou expirée, la nettoyer
          console.log('Session expirée ou invalide, nettoyage');
          localStorage.removeItem(ADMIN_SESSION_KEY);
          setIsAuthenticated(false);
        }
      } else {
        // Pas de session
        console.log('Aucune session trouvée');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const login = (password: string): boolean => {
    console.log('Tentative de connexion avec mot de passe:', password);
    
    if (password === ADMIN_PASSWORD) {
      // Créer un hash simple du mot de passe pour validation
      const passwordHash = btoa(password + '_authenticated_' + Date.now());
      
      const sessionData = {
        authenticated: true,
        expires: Date.now() + SESSION_DURATION,
        timestamp: Date.now(),
        passwordHash: passwordHash
      };
      
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
      
      console.log('Connexion réussie, mise à jour de l\'état...');
      
      // Forcer le re-render en mettant à jour plusieurs états
      setIsAuthenticated(true);
      setForceRender(prev => prev + 1);
      
      // Utiliser setTimeout pour s'assurer que l'état est mis à jour
      setTimeout(() => {
        setIsAuthenticated(true);
        console.log('État forcé à true via setTimeout');
      }, 100);
      
      toast.success('Connexion admin réussie !');
      return true;
    } else {
      console.log('Mot de passe incorrect');
      toast.error('Mot de passe incorrect !');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    toast.success('Déconnexion réussie');
  };

  const extendSession = () => {
    if (isAuthenticated) {
      const sessionData = {
        authenticated: true,
        expires: Date.now() + SESSION_DURATION,
        timestamp: Date.now()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession
  };
};