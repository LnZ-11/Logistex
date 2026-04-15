import ProductSearchBar from '@/app/components/ProductSearchBar';

type InventoryHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleOpenAdd: () => void;
};

export default function InventoryHeader({ searchQuery, setSearchQuery, handleOpenAdd }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold shrink-0">Gestion Stock</h1>
      <ProductSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher par SKU, nom ou description…"
        className="w-full sm:max-w-sm"
      />
      <button className="btn btn-primary shrink-0" onClick={handleOpenAdd}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Nouveau Produit
      </button>
    </div>
  );
}
