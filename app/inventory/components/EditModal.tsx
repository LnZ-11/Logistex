import React, { useRef, useEffect } from 'react';
import EditProductForm from './EditProductForm';
import useUpdateProduct from '@/app/hooks/global/useUpdateProduct';
import { useInventoryStore } from '../hooks/useInventoryStore';
import z from 'zod';
import { patchProductSchema } from '@/app/schema';

type productType = z.infer<typeof patchProductSchema>;

export default function EditModal() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const selectedProduct = useInventoryStore((state) => state.selectedProduct);
  const isOpen = useInventoryStore((state) => state.modals.edit);
  const closeEdit = useInventoryStore((state) => state.closeEdit);
  
  const { updateProduct, isPending } = useUpdateProduct();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const onSubmit = async (data: productType) => {
    await updateProduct(data);
    closeEdit();
  };

  if (!selectedProduct) return null;

  return (
    <dialog ref={modalRef} className="modal" onClose={closeEdit}>
      <div className="modal-box bg-base-200">
        <h3 className="font-bold text-lg mb-4"> 
          Modifier : <span className="text-primary">{selectedProduct.nom}</span>
        </h3>
        <EditProductForm 
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </div>
      <form method="dialog" className="modal-backdrop"><button>close</button></form>
    </dialog>
  );
}