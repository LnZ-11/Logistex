"use client"

import { useFetchProducts } from '@/app/hooks/global/useInventory';
import { useProductSearch } from '@/app/hooks/global/useProductSearch';
import { useInventoryStore } from './hooks/useInventoryStore';
import InventoryHeader from './components/InventoryHeader';
import InventoryTable from './components/InventoryTable';
import AddModal from './components/AddModal';
import EditModal from './components/EditModal';
import DeleteModal from './components/DeleteModal';
import QuickMovementModal from './components/QuickMovementModal';

export default function InventoryPage() {
  const { products, isLoading: isLoadingProducts } = useFetchProducts();
  const { searchQuery, setSearchQuery, searchResults } = useProductSearch();
  const openAdd = useInventoryStore((state) => state.openAdd);

  const displayedProducts = searchQuery.trim() ? searchResults : products;

  return (
    <div className="space-y-6">
      <InventoryHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleOpenAdd={openAdd} 
      />

      <InventoryTable 
        displayedProducts={displayedProducts} 
        isLoadingProducts={isLoadingProducts} 
        searchQuery={searchQuery}
      />

      {/* Modals are independent with Zustand */}
      <AddModal />
      <EditModal />
      <DeleteModal />
      <QuickMovementModal />
    </div>
  );
}

