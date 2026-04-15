import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addMovementSchema } from '@/app/schema';
import { useInventoryStore } from '../hooks/useInventoryStore';

type MovementData = z.input<typeof addMovementSchema>;

type QuickMovementFormProps = {
  onSubmit: (data: MovementData) => void;
  isPending: boolean;
};

export default function QuickMovementForm({ onSubmit, isPending }: QuickMovementFormProps) {
  const movementType = useInventoryStore((state) => state.movementType);
  const selectedProduct = useInventoryStore((state) => state.selectedProduct);
  const closeMovement = useInventoryStore((state) => state.closeMovement);

  const maxQuantity = movementType === 'SORTIE' ? selectedProduct?.quantiteActuelle : undefined;

  const { register, handleSubmit } = useForm<MovementData>({
    resolver: zodResolver(addMovementSchema),
    defaultValues: { quantiteChangee: 1, raison: 'Action rapide' }
  });

  if (!movementType) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Quantité à {movementType === 'ENTREE' ? 'ajouter' : 'retirer'}</span>
        </label>
        <input 
          type="number" 
          min="1" 
          max={maxQuantity}
          className="input input-bordered input-lg text-xl text-center" 
          {...register('quantiteChangee', { valueAsNumber: true })}
        />
      </div>
      
      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={closeMovement}>Annuler</button>
        <button type="submit" className={`btn ${movementType === 'ENTREE' ? 'btn-info' : 'btn-warning'} text-white`} disabled={isPending}>
          {isPending ? 'En cours...' : `Valider ${movementType}`}
        </button>
      </div>
    </form>
  );
}

