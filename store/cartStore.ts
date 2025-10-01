import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product._id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product._id,
                product,
                quantity,
                addedAt: new Date()
              }
            ]
          });
        }
      },

      removeItem: (productId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== productId)
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
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (open: boolean) => {
        set({ isOpen: open });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);