"use client"

import { useState, useMemo, useRef, useEffect } from 'react';
import { useFetchCategories, useFetchProducts, triggerProductUpdate, triggerMovementUpdate } from '@/app/hooks/global/useInventory';
import { useProductSearch } from '@/app/hooks/global/useProductSearch';
import ProductSearchBar from '@/app/components/ProductSearchBar';

export default function SalesPage() {
  const { categories } = useFetchCategories();
  const { products } = useFetchProducts();
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const { searchQuery, setSearchQuery, searchResults } = useProductSearch();

  // --- Persistent cart (localStorage) ---
  const [cart, setCart] = useState<{ product: any, quantity: number }[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('sales_cart') || '[]'); } catch { return []; }
  });
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>(() => {
    if (typeof window === 'undefined') return 'PERCENT';
    return (localStorage.getItem('sales_discountType') as 'PERCENT' | 'FIXED') || 'PERCENT';
  });
  const [discountValue, setDiscountValue] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('sales_discountValue') || '0');
  });
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('sales_customerName') || '';
  });

  // Sync cart state to localStorage
  useEffect(() => { localStorage.setItem('sales_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('sales_discountType', discountType); }, [discountType]);
  useEffect(() => { localStorage.setItem('sales_discountValue', String(discountValue)); }, [discountValue]);
  useEffect(() => { localStorage.setItem('sales_customerName', customerName); }, [customerName]);

  const clearCart = () => {
    setCart([]);
    setDiscountValue(0);
    setDiscountType('PERCENT');
    setCustomerName('');
  };
  // ---------------------------------------

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const checkoutModalRef = useRef<HTMLDialogElement>(null);

  // Derive breadcrumb
  const breadcrumb = useMemo(() => {
    if (!categories) return [];
    let path = [];
    let currentId = currentCategoryId;
    while (currentId !== null) {
      const cat = categories.find((c: any) => c.id === currentId);
      if (cat) {
        path.unshift(cat);
        currentId = cat.parentId;
      } else {
        break;
      }
    }
    return path;
  }, [categories, currentCategoryId]);

  // Derive current items to show
  const childCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter((c: any) => c.parentId === currentCategoryId);
  }, [categories, currentCategoryId]);

  const currentProducts = useMemo(() => {
    if (!products || currentCategoryId === null) return [];
    return products.filter((p: any) => p.categorieId === currentCategoryId);
  }, [products, currentCategoryId]);

  // Cart operations
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantiteActuelle) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      if (product.quantiteActuelle <= 0) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQ = item.quantity + delta;
          if (newQ <= 0) return item;
          if (newQ > item.product.quantiteActuelle) return item;
          return { ...item, quantity: newQ };
        }
        return item;
      });
    });
  };

  // Cart calculations with discount
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.prixVente * item.quantity), 0);
  
  const discountAmount = discountType === 'PERCENT' 
    ? cartSubtotal * (discountValue / 100) 
    : discountValue;
    
  // Ensure we don't discount more than the subtotal
  const actualDiscount = Math.min(discountAmount, cartSubtotal);
  const cartTotal = cartSubtotal - actualDiscount;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      let raison = 'Vente TPV';
      if (customerName.trim()) {
        raison += ` - Client: ${customerName.trim()}`;
      }
      if (actualDiscount > 0) {
        raison += ` (Remise: ${discountType === 'PERCENT' ? `${discountValue}%` : `${discountValue} DA`} = -${actualDiscount.toFixed(2)} DA)`;
      }

      const payload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        raison
      };

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Checkout failed');

      clearCart();
      triggerProductUpdate();
      triggerMovementUpdate();
      checkoutModalRef.current?.close();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la validation de la vente');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]" data-theme="dark">
      {/* Left Column (70%) - Navigation & Products */}
      <div className="flex-1 flex flex-col bg-base-200 rounded-xl shadow-lg p-6 overflow-hidden">
        {/* Search bar */}
        <ProductSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="mb-4"
        />

        {/* Breadcrumb top bar — hidden during search */}
        {!searchQuery && <div className="flex items-center gap-2 mb-6 bg-base-300 p-4 rounded-lg">
          <button 
            className="btn btn-sm btn-ghost gap-2"
            onClick={() => setCurrentCategoryId(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            Home
          </button>
          
          {breadcrumb.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-2 flex-wrap">
              <span className="text-base-content/50">/</span>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setCurrentCategoryId(cat.id)}
              >
                {cat.nom}
              </button>
            </div>
          ))}
        </div>}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Search results view */}
          {searchQuery ? (
            searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <p className="text-lg">Aucun résultat pour &laquo;{searchQuery}&raquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
                {searchResults.map((prod: any) => (
                  <button
                    key={`search-${prod.id}`}
                    onClick={() => addToCart(prod)}
                    disabled={prod.quantiteActuelle <= 0}
                    className={`card bg-base-100 border transition-all cursor-pointer shadow-md h-40 flex flex-col justify-between p-4 ${prod.quantiteActuelle <= 0 ? 'opacity-50 cursor-not-allowed border-error' : 'hover:border-success hover:shadow-success/20 border-base-300 hover:-translate-y-1'}`}
                  >
                    <div className="flex justify-between items-start w-full gap-2">
                      <div className="font-semibold text-left line-clamp-2">{prod.nom}</div>
                      <div className={`badge badge-sm whitespace-nowrap ${prod.quantiteActuelle <= prod.seuilCritique ? 'badge-warning' : 'badge-ghost'} ${prod.quantiteActuelle <= 0 ? 'badge-error' : ''}`}>
                        {prod.quantiteActuelle} stock
                      </div>
                    </div>
                    <div className="text-xs opacity-50 line-clamp-2">{prod.description}</div>
                    <div className="w-full text-right mt-2 flex justify-between items-end">
                      <div className="text-xs opacity-50">{prod.sku}</div>
                      <div className="text-xl font-bold text-success">{prod.prixVente.toFixed(2)} DA</div>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <>
          {(!childCategories.length && !currentProducts.length) && (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              <p className="text-lg">Aucun article ici.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
            {/* Child Categories */}
            {childCategories.map((cat: any) => (
              <button 
                key={`cat-${cat.id}`}
                onClick={() => setCurrentCategoryId(cat.id)}
                className="card bg-primary text-primary-content hover:scale-[1.03] transition-transform cursor-pointer shadow-xl h-40 flex flex-col items-center justify-center p-4 border border-primary-focus group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 group-hover:-translate-y-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>
                <div className="font-bold text-center leading-tight">{cat.nom}</div>
              </button>
            ))}

            {/* Products */}
            {currentProducts.map((prod: any) => (
              <button
                key={`prod-${prod.id}`}
                onClick={() => addToCart(prod)}
                disabled={prod.quantiteActuelle <= 0}
                className={`card bg-base-100 border transition-all cursor-pointer shadow-md h-40 flex flex-col justify-between p-4 ${prod.quantiteActuelle <= 0 ? 'opacity-50 cursor-not-allowed border-error' : 'hover:border-success hover:shadow-success/20 border-base-300 hover:-translate-y-1'}`}
              >
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="font-semibold text-left line-clamp-2">{prod.nom}</div>
                  <div className={`badge badge-sm whitespace-nowrap ${prod.quantiteActuelle <= prod.seuilCritique ? 'badge-warning' : 'badge-ghost'} ${prod.quantiteActuelle <= 0 ? 'badge-error' : ''}`}>
                    {prod.quantiteActuelle} stock
                  </div>
                </div>
                <div className="text-xs opacity-50 line-clamp-2">{prod.description}</div>
                <div className="w-full text-right mt-2 flex justify-between items-end">
                   <div className="text-xs opacity-50">{prod.sku}</div>
                   <div className="text-xl font-bold text-success">{prod.prixVente.toFixed(2)} DA</div>
                </div>
              </button>
            ))}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Right Column (30%) - Shopping Cart */}
      <div className="w-full lg:w-96 flex flex-col bg-base-200 rounded-xl shadow-lg border border-base-300 flex-shrink-0 relative">
        <div className="p-4 bg-base-300 rounded-t-xl border-b border-base-100 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
            Panier
          </h2>
          <div className="flex items-center gap-2">
            <div className="badge badge-primary badge-lg font-bold">{cart.length}</div>
            {cart.length > 0 && (
              <button
                className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/10"
                title="Vider le panier"
                onClick={() => {
                  if (confirm('Vider tout le panier ?')) clearCart();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-100/30">
          {cart.length === 0 ? (
            <div className="text-center text-base-content/50 mt-10">
              Le panier est vide. Sélectionnez des articles pour commencer.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex flex-col bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm relative pr-10 hover:border-primary/50 transition-colors">
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error absolute top-2 right-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
                <div className="font-semibold line-clamp-1 pr-6" title={item.product.nom}>{item.product.nom}</div>
                <div className="text-xs opacity-50 mb-2">{item.product.prixVente.toFixed(2)} DA / unité</div>
                <div className="flex justify-between items-end mt-1">
                  <div className="flex items-center gap-1 bg-base-200 rounded-md p-1 border border-base-300">
                    <button 
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="btn btn-xs btn-ghost btn-square hover:bg-base-300"
                      disabled={item.quantity <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                    </button>
                    <span className="w-8 text-center font-mono font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="btn btn-xs btn-ghost btn-square hover:bg-base-300"
                      disabled={item.quantity >= item.product.quantiteActuelle}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    </button>
                  </div>
                  <div className="font-bold text-success text-right whitespace-nowrap">
                    {(item.product.prixVente * item.quantity).toFixed(2)} DA
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Customer Info Section */}
        {cart.length > 0 && (
          <div className="p-4 bg-base-100/50 border-t border-base-300">
             <label className="text-sm font-semibold opacity-70 mb-2 block">Informations Client</label>
             <input 
               required
               type="text" 
               placeholder="Nom du client" 
               className="input input-sm input-bordered w-full"
               value={customerName}
               onChange={e => setCustomerName(e.target.value)}
             />
          </div>
        )}

        {/* Global Discount Section */}
        {cart.length > 0 && (
          <div className="p-4 bg-base-100/50 border-t border-base-300 rounded-b-xl mb-40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold opacity-70">Sous-total</span>
              <span className="font-mono">{cartSubtotal.toFixed(2)} DA</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold opacity-70">Appliquer une remise</label>
              <div className="join w-full flex">
                <select 
                  className="select select-sm select-bordered join-item font-bold"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'PERCENT' | 'FIXED')}
                >
                  <option value="PERCENT">%</option>
                  <option value="FIXED">DA</option>
                </select>
                <input 
                  type="number" 
                  className="input input-sm input-bordered join-item w-full"
                  min="0"
                  max={discountType === 'PERCENT' ? 100 : cartSubtotal}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </div>
              {actualDiscount > 0 && (
                <div className="text-right text-success text-sm font-bold mt-1">
                  - {actualDiscount.toFixed(2)} DA appliqués
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-base-300 rounded-b-xl border-t border-base-100 absolute bottom-0 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-lg opacity-80 mb-1">Total à payer</span>
            <div className="text-right">
              {actualDiscount > 0 && (
                <div className="text-sm line-through opacity-50">{cartSubtotal.toFixed(2)} DA</div>
              )}
              <div className="text-3xl font-bold text-success">{cartTotal.toFixed(2)} <span className="text-xl">DA</span></div>
            </div>
          </div>
          <button 
            className="btn btn-success btn-lg w-full text-white shadow-lg shadow-success/20 font-bold"
            disabled={cart.length === 0 || customerName.trim() === ''}
            onClick={() => checkoutModalRef.current?.showModal()}
          >
            Finaliser la Vente
          </button>
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      <dialog ref={checkoutModalRef} className="modal">
        <div className="modal-box bg-base-200 border border-base-300">
          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-success"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
             Confirmer la Vente
          </h3>
          <p className="py-2 opacity-80">Êtes-vous sûr de vouloir finaliser cette vente ({cart.length} articles) ?</p>
          
          <div className="bg-base-300 p-6 rounded-lg my-4 shadow-inner border border-base-100">
            {customerName.trim() && (
              <div className="flex justify-between text-lg opacity-70 mb-2">
                <span>Client:</span>
                <span className="font-bold">{customerName.trim()}</span>
              </div>
            )}
            {actualDiscount > 0 && (
              <div className="flex justify-between text-lg opacity-70 mb-2">
                <span>Sous-total:</span>
                <span>{cartSubtotal.toFixed(2)} DA</span>
              </div>
            )}
            {actualDiscount > 0 && (
              <div className="flex justify-between text-lg text-success mb-3 border-b border-base-100 pb-3">
                <span className="font-bold">Remise ({discountType === 'PERCENT' ? `${discountValue}%` : `${discountValue} DA`}):</span>
                <span>-{actualDiscount.toFixed(2)} DA</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-3xl pt-2">
              <span>Total:</span>
              <span className="text-success">{cartTotal.toFixed(2)} DA</span>
            </div>
          </div>
          
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2" disabled={isCheckingOut}>Annuler</button>
            </form>
            <button 
              className="btn btn-success text-white px-8" 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Confirmer l\'encaissement'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
