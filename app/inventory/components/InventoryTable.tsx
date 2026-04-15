import { Product } from '../hooks/useInventoryStore';
import ProductRow from './ProductRow';
import InventoryTableHeader from './InventoryTableHeader';

type InventoryTableProps = {
  displayedProducts: Product[];
  isLoadingProducts: boolean;
  searchQuery: string;
};

export default function InventoryTable({
  displayedProducts,
  isLoadingProducts,
  searchQuery,
}: InventoryTableProps) {
  if (isLoadingProducts) {
    return (
      <div className="bg-base-200 rounded-xl shadow-lg border border-base-300 flex justify-center p-12">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-xl shadow-lg border border-base-300 overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra table-sm sm:table-md w-full">
          <InventoryTableHeader />
          <tbody>
            {displayedProducts?.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
              />
            ))}
            {!displayedProducts?.length && (
              <tr><td colSpan={6} className="text-center py-10 opacity-50">
                {searchQuery ? `Aucun résultat pour « ${searchQuery} »` : 'Aucun produit en stock'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

