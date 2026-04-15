'use client'
import { z } from 'zod';
import { productSchema, addMovementSchema } from '@/app/schema';
import useAddProduct from '@/app/hooks/global/useAddProduct';
import useDeleteProduct from '@/app/hooks/global/useDeleteProduct';
import useAddMovement from '@/app/hooks/global/useAddMovement';

type ProductInput = z.input<typeof productSchema>;
type MovementInput = z.input<typeof addMovementSchema>;

export function useInventoryActions() {
  const { addProduct, isPending: isAdding } = useAddProduct();
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { addMovement, isPending: isMoving } = useAddMovement();

  const handleCreateProduct = async (data: ProductInput, onSuccess: () => void) => {
    const payload = { ...data, barcode: data.barcode === '' ? null : data.barcode };
    await addProduct(payload);
    onSuccess();
  };

  const handleDeleteProduct = async (productId: number, onSuccess: () => void) => {
    await deleteProduct({ productId });
    onSuccess();
  };

  const handleCreateMovement = async (data: MovementInput, onSuccess: () => void) => {
    await addMovement(data);
    onSuccess();
  };

  return {
    isAdding, isDeleting, isMoving,
    handleCreateProduct, handleDeleteProduct, handleCreateMovement
  };
}
