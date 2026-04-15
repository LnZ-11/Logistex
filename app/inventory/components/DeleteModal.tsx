import React, { useRef, useEffect } from 'react';
import { useInventoryStore } from '../hooks/useInventoryStore';
import { useInventoryActions } from '../hooks/useInventoryActions';

export default function DeleteModal() {
    const modalRef = useRef<HTMLDialogElement>(null);
    const selectedProduct = useInventoryStore((state) => state.selectedProduct);
    const isOpen = useInventoryStore((state) => state.modals.delete);
    const closeDelete = useInventoryStore((state) => state.closeDelete);
    
    const { handleDeleteProduct, isDeleting } = useInventoryActions();

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    const onDelete = async () => {
        if (!selectedProduct) return;
        await handleDeleteProduct(selectedProduct.id, closeDelete);
    };

    if (!selectedProduct) return null;

    return(
        <dialog ref={modalRef} className="modal" onClose={closeDelete}>
            <div className="modal-box bg-base-200 border border-error/20">
                <h3 className="font-bold text-lg text-error mb-2">Supprimer le produit</h3>
                <p>Êtes-vous sûr de vouloir supprimer <strong>{selectedProduct.nom}</strong> ? Cette action est irréversible.</p>
                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={closeDelete}>Annuler</button>
                    <button className="btn btn-error" onClick={onDelete} disabled={isDeleting}>
                        {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : "Confirmer la suppression"}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop"><button>close</button></form>
        </dialog>
    )
}