"use client"
import { useFetchProducts } from '@/app/hooks/global/useInventory';

export default function Dashboard() {
  const { products, isLoading, error } = useFetchProducts();

  if (isLoading) return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner text-primary"></span></div>;
  if (error) return <div className="alert alert-error">Error loading dashboard stats</div>;

  const totalProducts = products?.length || 0;
  
  const stockValue = products?.reduce((total: number, product: any) => {
    return total + (product.quantiteActuelle * product.prixAchat);
  }, 0) || 0;

  const lowStockProducts = products?.filter((p: any) => p.quantiteActuelle <= p.seuilCritique) || [];
  const lowStockCount = lowStockProducts.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>
      
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">{totalProducts}</div>
          <div className="stat-desc">In stock catalog</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div className="stat-title">Stock Value</div>
          <div className="stat-value text-secondary">{stockValue.toLocaleString()} DA</div>
          <div className="stat-desc">Total purchase value</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title">Low Stock Alerts</div>
          <div className="stat-value text-error">{lowStockCount}</div>
          <div className="stat-desc">Products critically low</div>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="card bg-base-200 shadow-xl overflow-x-auto mt-8">
           <div className="card-body">
             <h2 className="card-title text-error mb-4">Critical Stock Items</h2>
             <table className="table table-zebra w-full">
               <thead>
                 <tr>
                   <th>SKU</th>
                   <th>Product</th>
                   <th>Current Qty</th>
                   <th>Critical Threshold</th>
                 </tr>
               </thead>
               <tbody>
                 {lowStockProducts.map((p: any) => (
                   <tr key={p.id}>
                     <td>{p.sku}</td>
                     <td>{p.nom}</td>
                     <td><span className="badge badge-error">{p.quantiteActuelle}</span></td>
                     <td>{p.seuilCritique}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
}
