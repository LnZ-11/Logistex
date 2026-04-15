"use client"

import { useFetchProducts, useFetchMovements } from '@/app/hooks/global/useInventory';
import Link from 'next/link';

export default function DashboardPage() {
  const { products, isLoading: isLoadingProducts } = useFetchProducts();
  const { movements, isLoading: isLoadingMovements } = useFetchMovements();

  // Calculations
  const totalProducts = products?.length || 0;
  
  const stockValue = products?.reduce((sum: number, p: any) => {
    return sum + (p.quantiteActuelle * p.prixAchat);
  }, 0) || 0;

  const realizedProfit = movements?.reduce((sum: number, m: any) => {
    // On ne compte que les sorties (ventes) non annulées
    const isAnnule = m.raison && m.raison.includes('[ANNULÉ]');
    
    if (m.typeMouvement === 'SORTIE' && !isAnnule) {
      const movementProfit = m.items?.reduce((itemSum: number, it: any) => {
        const prod = products?.find((p: any) => p.id === it.produitId);
        if (prod) {
          return itemSum + (it.quantiteChangee * (prod.prixVente - prod.prixAchat));
        }
        return itemSum;
      }, 0) || 0;
      return sum + movementProfit;
    }
    return sum;
  }, 0) || 0;

  const lowStockProducts = products?.filter((p: any) => p.quantiteActuelle <= p.seuilCritique) || [];
  const totalLowStock = lowStockProducts.length;

  const isLoading = isLoadingProducts || isLoadingMovements;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold">Tableau de Bord</h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="stats shadow bg-base-200 w-full overflow-hidden flex flex-col lg:flex-row">
            <div className="stat place-items-center lg:place-items-start border-b lg:border-b-0 lg:border-r border-base-300">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="stat-title">Produits Totaux</div>
              <div className="stat-value text-primary">{totalProducts}</div>
              <div className="stat-desc">Articles en base de données</div>
            </div>
            
            <div className="stat place-items-center lg:place-items-start border-b lg:border-b-0 lg:border-r border-base-300">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <div className="stat-title">Valeur du Stock (Achat)</div>
              <div className="stat-value text-secondary">{stockValue.toFixed(2)} DA</div>
              <div className="stat-desc">Capital immobilisé total</div>
            </div>

            <div className="stat place-items-center lg:place-items-start border-b lg:border-b-0 lg:border-r border-base-300">
              <div className="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
              </div>
              <div className="stat-title border-b border-accent/20 pb-1">Bénéfices Réalisés</div>
              <div className="stat-value text-accent">{realizedProfit.toFixed(2)} DA</div>
              <div className="stat-desc font-medium text-accent/80">Basé sur l'historique</div>
            </div>
            
            <div className="stat place-items-center lg:place-items-start">
              <div className="stat-figure text-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div className="stat-title">Alertes Stock Bas</div>
              <div className="stat-value text-error">{totalLowStock}</div>
              <div className="stat-desc">Articles &le; seuil critique</div>
            </div>
          </div>

          {/* Low Stock Alerts Table */}
          {lowStockProducts.length > 0 && (
            <div className="card bg-base-200 shadow mt-8">
              <div className="card-body p-0 sm:p-6">
                <h2 className="card-title text-error flex items-center gap-2 p-6 sm:p-0 pb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Produits nécessitant un réapprovisionnement ({totalLowStock})
                </h2>
                <div className="overflow-x-auto mt-4">
                  <table className="table table-zebra table-sm md:table-md w-full">
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Nom du produit</th>
                        <th>Quantité Actuelle</th>
                        <th>Seuil Critique</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((p: any) => (
                        <tr key={p.id}>
                          <td className="font-mono text-sm opacity-80">{p.sku}</td>
                          <td className="font-bold">{p.nom}</td>
                          <td>
                            <div className="badge badge-error font-bold shadow-sm shadow-error/20">
                              {p.quantiteActuelle}
                            </div>
                          </td>
                          <td className="opacity-70">{p.seuilCritique}</td>
                          <td>
                            <Link href="/inventory" className="btn btn-xs md:btn-sm btn-ghost hover:btn-primary">
                              Gérer le stock
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
