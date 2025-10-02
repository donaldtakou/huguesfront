import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
  expiresAt?: Date;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastActivity: Date | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearExpiredItems: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  updateActivity: () => void;
  setOrderCompleted: () => void;
}

// Configuration
const CART_EXPIRY_HOURS = 24; // Articles expirent après 24h
const INACTIVITY_HOURS = 4; // Panier se vide après 4h d'inactivité

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastActivity: null,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product._id);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + CART_EXPIRY_HOURS * 60 * 60 * 1000);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product._id
                ? { 
                    ...item, 
                    quantity: item.quantity + quantity,
                    expiresAt // Mettre à jour l'expiration
                  }
                : item
            ),
            lastActivity: now
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id,
                product,
                quantity,
                addedAt: now,
                expiresAt
              }
            ],
            lastActivity: now
          });
        }

        // Nettoyer les articles expirés
        get().clearExpiredItems();
      },

      removeItem: (productId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
          lastActivity: new Date()
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
          lastActivity: new Date()
        }));
      },

      clearCart: () => {
        set({ 
          items: [],
          lastActivity: new Date()
        });
      },

      clearExpiredItems: () => {
        const now = new Date();
        const { items, lastActivity } = get();
        
        let shouldUpdate = false;
        
        // Supprimer les articles expirés
        const validItems = items.filter(item => {
          if (item.expiresAt && now > item.expiresAt) {
            shouldUpdate = true;
            return false;
          }
          return true;
        });

        // Vider le panier si inactif depuis trop longtemps
        if (lastActivity) {
          const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
          if (hoursSinceActivity > INACTIVITY_HOURS && validItems.length > 0) {
            set({ 
              items: [],
              lastActivity: now
            });
            return;
          }
        }

        // Mettre à jour seulement si nécessaire
        if (shouldUpdate) {
          set({ items: validItems });
        }
      },

      getTotalItems: () => {
        get().clearExpiredItems(); // Nettoyer avant de compter
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        get().clearExpiredItems(); // Nettoyer avant de calculer
        return get().items.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
      },

      getItemQuantity: (productId: string) => {
        get().clearExpiredItems(); // Nettoyer avant de vérifier
        const item = get().items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },

      toggleCart: () => {
        get().updateActivity();
        set(state => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (open: boolean) => {
        get().updateActivity();
        set({ isOpen: open });
      },

      updateActivity: () => {
        set({ lastActivity: new Date() });
      },

      setOrderCompleted: () => {
        // Vider le panier après une commande réussie
        set({ 
          items: [],
          isOpen: false,
          lastActivity: new Date()
        });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        lastActivity: state.lastActivity
      }),
      onRehydrateStorage: () => (state) => {
        // Nettoyer les articles expirés au chargement
        if (state) {
          state.clearExpiredItems();
        }
      }
    }
  )
);

// Auto-nettoyage périodique
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useCartStore.getState();
    store.clearExpiredItems();
  }, 5 * 60 * 1000); // Vérifier toutes les 5 minutes
}