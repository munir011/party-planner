import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => 
          i.itemId === item.itemId && 
          i.startDate === item.startDate && 
          i.endDate === item.endDate
        );
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.id === existingItem.id 
                ? { ...i, qty: i.qty + item.qty }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      updateItem: (id, updates) => {
        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        });
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const days = Math.max(1, Math.ceil(
            (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)
          ));
          return total + (item.unitPrice * item.qty * days);
        }, 0);
      }
    }),
    {
      name: 'party-rentals-cart'
    }
  )
);