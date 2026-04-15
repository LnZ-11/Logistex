import React, { useRef, useEffect } from 'react';
import AddProductForm from './AddProductForm';
import { useInventoryActions } from '../hooks/useInventoryActions';
import { useInventoryStore } from '../hooks/useInventoryStore';

export default function AddModal() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const isOpen = useInventoryStore((state) => state.modals.add);
  const closeAdd = useInventoryStore((state) => state.closeAdd);
  
  const { handleCreateProduct, isAdding } = useInventoryActions();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return(
    <dialog ref={modalRef} className="modal" onClose={closeAdd}>
      <div className="modal-box w-11/12 max-w-2xl bg-base-200">
        <h3 className="font-bold text-xl mb-4 border-b border-base-300 pb-2">Ajouter un produit</h3>
        <AddProductForm 
          onSubmit={(data) => handleCreateProduct(data, closeAdd)}
          isPending={isAdding}
        />
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  )
}

