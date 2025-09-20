import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem } from '../types';
import { inventoryItems } from '../data/seed';

interface InventoryStore {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  getItem: (slug: string) => InventoryItem | undefined;
  getCategories: () => string[];
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: inventoryItems,
      
      addItem: (item) => {
        set({ items: [...get().items, item] });
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
      
      getItem: (slug) => {
        return get().items.find(item => item.slug === slug);
      },
      
      getCategories: () => {
        const categories = get().items.map(item => item.category);
        return [...new Set(categories)].sort();
      }
    }),
    {
      name: 'party-rentals-inventory'
    }
  )
);