import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productSchema } from '@/app/schema';
import FormFieldsGeneral from './FormFieldsGeneral';
import FormFieldsInventory from './FormFieldsInventory';
import { useFetchCategories } from '@/app/hooks/global/useInventory';
import { useInventoryStore } from '../hooks/useInventoryStore';

type ProductFormData = z.input<typeof productSchema>;

type AddProductFormProps = {
  onSubmit: (data: ProductFormData) => void;
  isPending: boolean;
};

export default function AddProductForm({ onSubmit, isPending }: AddProductFormProps) {
  const { categories } = useFetchCategories();
  const closeAdd = useInventoryStore((state) => state.closeAdd);

  const { register, handleSubmit } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldsGeneral register={register} categories={categories || []} />
        <FormFieldsInventory register={register} />
      </div>
      <div className="modal-action border-t border-base-300 pt-4">
        <button type="button" className="btn btn-ghost" onClick={closeAdd}>Annuler</button>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'Insertion...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

