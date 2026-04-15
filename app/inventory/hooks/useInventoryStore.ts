import { create } from 'zustand';
import { z } from 'zod';
import { productSchema } from '@/app/schema';

export type Product = z.infer<typeof productSchema> & {
  id: number;
  categorie?: { id: number; nom: string; };
};

type InventoryState = {
  selectedProduct: Product | null;
  movementType: 'ENTREE' | 'SORTIE' | null;
  modals: {
    add: boolean;
    edit: boolean;
    delete: boolean;
    movement: boolean;
  };
};

type InventoryActions = {
  setSelectedProduct: (product: Product | null) => void;
  setMovementType: (type: 'ENTREE' | 'SORTIE' | null) => void;
  openAdd: () => void;
  closeAdd: () => void;
  openEdit: (product: Product) => void;
  closeEdit: () => void;
  openDelete: (product: Product) => void;
  closeDelete: () => void;
  openMovement: (product: Product, type: 'ENTREE' | 'SORTIE') => void;
  closeMovement: () => void;
};

export const useInventoryStore = create<InventoryState & InventoryActions>((set) => ({
  selectedProduct: null,
  movementType: null,
  modals: {
    add: false,
    edit: false,
    delete: false,
    movement: false,
  },
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setMovementType: (type) => set({ movementType: type }),
  openAdd: () => set((state) => ({ modals: { ...state.modals, add: true } })),
  closeAdd: () => set((state) => ({ modals: { ...state.modals, add: false } })),
  openEdit: (product) => set((state) => ({ 
    selectedProduct: product, 
    modals: { ...state.modals, edit: true } 
  })),
  closeEdit: () => set((state) => ({ 
    selectedProduct: null, 
    modals: { ...state.modals, edit: false } 
  })),
  openDelete: (product) => set((state) => ({ 
    selectedProduct: product, 
    modals: { ...state.modals, delete: true } 
  })),
  closeDelete: () => set((state) => ({ 
    selectedProduct: null, 
    modals: { ...state.modals, delete: false } 
  })),
  openMovement: (product, type) => set((state) => ({ 
    selectedProduct: product, 
    movementType: type,
    modals: { ...state.modals, movement: true } 
  })),
  closeMovement: () => set((state) => ({ 
    selectedProduct: null, 
    movementType: null,
    modals: { ...state.modals, movement: false } 
  })),
}));
