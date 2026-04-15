import React, { useRef, useEffect } from 'react';
import QuickMovementForm from './QuickMovementForm';
import { useInventoryActions } from '../hooks/useInventoryActions';
import { useInventoryStore } from '../hooks/useInventoryStore';

export default function QuickMovementModal() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const selectedProduct = useInventoryStore((state) => state.selectedProduct);
  const movementType = useInventoryStore((state) => state.movementType);
  const isOpen = useInventoryStore((state) => state.modals.movement);
  const closeMovement = useInventoryStore((state) => state.closeMovement);
  
  const { handleCreateMovement, isMoving } = useInventoryActions();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const onSubmit = (data: any) => {
    if (!selectedProduct || !movementType) return;
    handleCreateMovement({
      ...data,
      produitId: selectedProduct.id,
      typeMouvement: movementType,
      raison: data.raison || (movementType === 'ENTREE' ? 'Réapprovisionnement rapide' : 'Vente rapide')
    }, closeMovement);
  };

  if (!movementType || !selectedProduct) return null;

  return (
    <dialog ref={modalRef} className="modal" onClose={closeMovement}>
      <div className="modal-box bg-base-200">
        <h3 className={`font-bold text-lg mb-4 flex gap-2 items-center ${movementType === 'ENTREE' ? 'text-info' : 'text-warning'}`}>
           {movementType === 'ENTREE' ? 'Entrée de stock (Réappro)' : 'Sortie de stock (Vente)'}
        </h3>
        <p className="opacity-80 mb-4">
          Produit: <strong className="text-base-content">{selectedProduct.nom}</strong> 
          (Stock actuel: {selectedProduct.quantiteActuelle})
        </p>
        
        <QuickMovementForm 
          onSubmit={onSubmit}
          isPending={isMoving}
        />
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  );
}

