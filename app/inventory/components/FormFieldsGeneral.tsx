import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type Category = { id: number; nom: string };

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  categories: Category[];
};

export default function FormFieldsGeneral<T extends FieldValues>({ register, categories }: Props<T>) {
  return (
    <>
      <div className="form-control">
        <label className="label"><span className="label-text">Nom du Produit</span></label>
        <input type="text" className="input input-bordered" {...register('nom' as Path<T>)} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">SKU</span></label>
        <input type="text" className="input input-bordered font-mono" {...register('sku' as Path<T>)} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Barcode (optional)</span></label>
        <input type="text" className="input input-bordered font-mono" {...register('barcode' as Path<T>)} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Catégorie</span></label>
        <select className="select select-bordered" {...register('categorieId' as Path<T>, { valueAsNumber: true })} defaultValue="">
          <option value="" disabled>Sélectionnez une catégorie</option>
          {categories?.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>
      <div className="form-control md:col-span-2">
        <label className="label"><span className="label-text">Description</span></label>
        <textarea className="textarea textarea-bordered h-20" {...register('description' as Path<T>)}></textarea>
      </div>
    </>
  );
}
