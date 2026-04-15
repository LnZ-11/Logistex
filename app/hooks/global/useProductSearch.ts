import { useState, useMemo } from 'react';
import { useFetchProducts } from '@/app/hooks/global/useInventory';

export function useProductSearch() {
  const { products } = useFetchProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!products || !searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p: any) =>
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.nom && p.nom.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.toLowerCase().includes(q)) ||
      (p.categorie && p.categorie.nom.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return { searchQuery, setSearchQuery, searchResults, products };
}
