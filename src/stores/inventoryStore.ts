import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem } from '../types';
import { inventoryItems } from '../data/seed';

interface InventoryStore {
  items: InventoryItem[];
  categories: string[];
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  getItem: (slug: string) => InventoryItem | undefined;
  updateCategories: () => void;
}

const generateCategories = (items: InventoryItem[]): string[] => {
  const categories = items.map(item => item.category);
  return [...new Set(categories)].sort();
};

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: inventoryItems,
      categories: generateCategories(inventoryItems),
      
      addItem: (item) => {
        const newItems = [...get().items, item];
        set({ 
          items: newItems,
          categories: generateCategories(newItems)
        });
      },
      
      updateItem: (id, updates) => {
        const newItems = get().items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        set({
          items: newItems,
          categories: generateCategories(newItems)
        });
      },
      
      removeItem: (id) => {
        const newItems = get().items.filter(item => item.id !== id);
        set({ 
          items: newItems,
          categories: generateCategories(newItems)
        });
      },
      
      getItem: (slug) => {
        return get().items.find(item => item.slug === slug);
      },
      
      updateCategories: () => {
        const newCategories = generateCategories(get().items);
        set({ categories: newCategories });
      }
    }),
    {
      name: 'party-rentals-inventory'
    }
  )
);