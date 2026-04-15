import { useInventoryStore, Product } from '../hooks/useInventoryStore';

type ProductRowProps = {
  product: Product;
};

export default function ProductRow({ product }: ProductRowProps) {
  const openMovement = useInventoryStore((state) => state.openMovement);
  const openEdit = useInventoryStore((state) => state.openEdit);
  const openDelete = useInventoryStore((state) => state.openDelete);

  return (
    <tr>
      <td className="font-mono text-sm opacity-70">{product.sku}</td>
      <td>
        <div className="font-bold">{product.nom}</div>
        <div className="badge badge-sm badge-ghost mt-1 text-xs opacity-70 border-base-300">
          {product.categorie?.nom}
        </div>
      </td>
      <td>
        <div className={`badge font-bold gap-1 ${product.quantiteActuelle <= product.seuilCritique ? 'badge-error' : 'badge-success text-white'}`}>
          {product.quantiteActuelle}
        </div>
      </td>
      <td>
        <div className="text-sm">
          <span className="opacity-60">{product.prixAchat.toFixed(2)} DA</span> / 
          <span className="font-bold text-success ml-1">{product.prixVente.toFixed(2)} DA</span>
        </div>
      </td>
      <td className="text-right space-x-2">
        <button 
           className="btn btn-xs btn-outline btn-warning" 
           title="Réapprovisionnement"
           onClick={() => openMovement(product, 'ENTREE')}
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
           Restock
        </button>
      </td>
      <td className="text-right space-x-1">
        <button className="btn btn-xs btn-ghost" onClick={() => openEdit(product)}>Edit</button>
        <button className="btn btn-xs btn-error btn-outline" onClick={() => openDelete(product)}>Del</button>
      </td>
    </tr>
  );
}

