import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
};

export default function FormFieldsInventory<T extends FieldValues>({ register }: Props<T>) {
  return (
    <>
      <div className="form-control">
        <label className="label"><span className="label-text">Stock Initial</span></label>
        <input type="number" min="0" className="input input-bordered" {...register('quantiteActuelle' as Path<T>, { valueAsNumber: true })} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Seuil d'Alerte</span></label>
        <input type="number" min="0" className="input input-bordered" {...register('seuilCritique' as Path<T>, { valueAsNumber: true })} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Prix d'Achat (DA)</span></label>
        <input type="number" min="0" step="0.01" className="input input-bordered" {...register('prixAchat' as Path<T>, { valueAsNumber: true })} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Prix de Vente (DA)</span></label>
        <input type="number" min="0" step="0.01" className="input input-bordered" {...register('prixVente' as Path<T>, { valueAsNumber: true })} />
      </div>
    </>
  );
}
