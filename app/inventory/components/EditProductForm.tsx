import { SubmitHandler } from 'react-hook-form';
import { useInventoryStore } from '../hooks/useInventoryStore';
import { useEditProductForm, FormOutput } from '../hooks/useEditProductForm';

type EditProductFormProps = {
  onSubmit: SubmitHandler<FormOutput>;
  isPending: boolean;
};

export default function EditProductForm({ onSubmit, isPending }: EditProductFormProps) {
  const closeEdit = useInventoryStore((state) => state.closeEdit);
  const { register, handleSubmit, formState: { errors } } = useEditProductForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label"><span className="label-text">Description</span></label>
        <textarea 
          className={`textarea textarea-bordered h-20 ${errors.description ? 'border-error' : ''}`} 
          {...register("description")} 
        />
        {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
      </div>

      <input type="hidden" {...register("productId", { valueAsNumber: true })} />

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label"><span className="label-text">Prix d'Achat (DA)</span></label>
          <input type="number" step="10" className="input input-bordered" {...register("prixAchat", { valueAsNumber: true })} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Prix de Vente (DA)</span></label>
          <input type="number" step="10" className="input input-bordered" {...register("prixVente", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={closeEdit}>Annuler</button>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Mise à jour..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}


