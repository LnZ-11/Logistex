"use client"

import { useState, useMemo } from 'react';
import { useFetchMovements, triggerMovementUpdate, triggerProductUpdate } from '@/app/hooks/global/useInventory';

export default function MovementsPage() {
  const { movements, isLoading } = useFetchMovements();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'ENTREE': return 'badge-success text-success-content shadow-sm shadow-success/50';
      case 'SORTIE': return 'badge-warning text-warning-content shadow-sm shadow-warning/50';
      case 'AJUSTEMENT': return 'badge-info text-info-content shadow-sm shadow-info/50';
      default: return 'badge-ghost';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'ENTREE': return 'Entrée (Réappro)';
      case 'SORTIE': return 'Sortie (Vente)';
      case 'AJUSTEMENT': return 'Ajustement';
      default: return type;
    }
  }

  // Filter movements by reference, client name (in raison), date, or product name/SKU
  const filteredMovements = useMemo(() => {
    if (!movements || !searchQuery.trim()) return movements;
    const q = searchQuery.trim().toLowerCase();
    return movements.filter((m: any) => {
      if (m.reference && m.reference.toLowerCase().includes(q)) return true;
      if (m.raison && m.raison.toLowerCase().includes(q)) return true;
      if (m.dateMouvement && new Date(m.dateMouvement).toLocaleString().toLowerCase().includes(q)) return true;
      if (m.items && m.items.some((it: any) =>
        (it.produit?.nom && it.produit.nom.toLowerCase().includes(q)) ||
        (it.produit?.sku && it.produit.sku.toLowerCase().includes(q))
      )) return true;
      return false;
    });
  }, [movements, searchQuery]);

  const handleCancelClick = async (m: any) => {
    const itemCount = m.items?.length || 0;
    const label = itemCount > 1 
      ? `cette vente de ${itemCount} articles` 
      : `cette sortie de ${m.items?.[0]?.quantiteChangee || '?'}x ${m.items?.[0]?.produit?.nom || 'produit'}`;

    if (!confirm(`Voulez-vous vraiment annuler ${label} ? Attention, cela va restaurer le stock.`)) {
      return;
    }

    setCancellingId(m.id);
    try {
      const res = await fetch(`/api/movements/${m.id}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur inconnue');
      }
      triggerMovementUpdate();
      triggerProductUpdate();
    } catch (e: any) {
      alert(`Erreur d'annulation: ${e.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
          Mouvements de Stock
        </h1>
        <div className="relative w-full sm:max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </span>
          <input
            type="text"
            className="input input-bordered w-full pl-10 pr-10 bg-base-200"
            placeholder="Rechercher par #vente, client, date, produit…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-base-content"
              onClick={() => setSearchQuery('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="bg-base-200 rounded-xl shadow-lg border border-base-300 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="table table-zebra table-sm sm:table-md w-full">
              <thead>
                <tr className="bg-base-300">
                  <th># Vente</th>
                  <th>Date et Heure</th>
                  <th>Produit (SKU)</th>
                  <th className="text-right">Quantité Modifiée</th>
                  <th>Type de Mouvement</th>
                  <th>Raison / Détails</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements?.map((m: any) => {
                  const isAnnule = m.raison && m.raison.includes('[ANNULÉ]');
                  const canCancel = m.typeMouvement === 'SORTIE' && !isAnnule;
                  
                  return (
                    <tr key={m.id} className={`transition-colors hover:bg-base-100 ${isAnnule ? 'opacity-60' : ''}`}>
                      <td className="font-mono font-bold text-primary">
                        {m.reference || '-'}
                      </td>
                      <td className="text-sm opacity-80 whitespace-nowrap">
                        {new Date(m.dateMouvement).toLocaleString()}
                      </td>
                      <td>
                        {m.items && m.items.length > 1 ? (
                          <div className={`space-y-1 ${isAnnule ? 'line-through opacity-70' : ''}`}>
                            <div className="font-bold border-b border-base-300 pb-1 mb-1 text-xs uppercase tracking-wider">{m.items.length} Articles</div>
                            {m.items.map((it: any) => (
                              <div key={it.id} className="text-sm">
                                • {it.produit?.nom} <span className="opacity-50 text-xs font-mono">({it.produit?.sku})</span>
                              </div>
                            ))}
                          </div>
                        ) : m.items && m.items.length === 1 ? (
                          <>
                            <div className={`font-bold ${isAnnule ? 'line-through opacity-70' : ''}`}>{m.items[0].produit?.nom}</div>
                            <div className="text-xs opacity-50 font-mono">{m.items[0].produit?.sku}</div>
                          </>
                        ) : (
                          <div className="opacity-50 italic">Aucun produit</div>
                        )}
                      </td>
                      <td className={`font-mono font-bold text-lg text-right ${m.typeMouvement === 'SORTIE' ? 'text-warning' : m.typeMouvement === 'ENTREE' ? 'text-success' : 'text-info'} ${isAnnule ? 'line-through opacity-50' : ''}`}>
                        {m.items && m.items.length > 1 ? (
                          <div className="text-sm space-y-1 mt-6">
                            {m.items.map((it: any) => (
                              <div key={it.id}>
                                {m.typeMouvement === 'SORTIE' ? '-' : '+'}{it.quantiteChangee}
                              </div>
                            ))}
                          </div>
                        ) : m.items && m.items.length === 1 ? (
                          <>{m.typeMouvement === 'SORTIE' ? '-' : '+'}{m.items[0].quantiteChangee}</>
                        ) : '-'}
                      </td>
                      <td>
                        <div className={`badge font-bold py-3 ${getBadgeClass(m.typeMouvement)} ${isAnnule ? 'opacity-50' : ''}`}>
                          {getTypeLabel(m.typeMouvement)}
                        </div>
                      </td>
                      <td className={`italic ${isAnnule ? 'text-error font-semibold' : 'opacity-80'}`}>
                        {m.raison || '-'}
                      </td>
                      <td className="text-right">
                        {canCancel && (
                          <button 
                            className="btn btn-xs btn-error btn-outline"
                            onClick={() => handleCancelClick(m)}
                            disabled={cancellingId === m.id}
                          >
                            {cancellingId === m.id ? <span className="loading loading-spinner loading-xs"></span> : 'Annuler'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {!filteredMovements?.length && (
                  <tr><td colSpan={7} className="text-center py-12 opacity-50 italic">
                    {searchQuery ? `Aucun résultat pour « ${searchQuery} ».` : "Aucun mouvement enregistré dans l'historique."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
