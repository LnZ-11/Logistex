"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { patchProductSchema } from "../schema";
import { z } from "zod";
import useFetchProducts from "../hooks/useFetchProducts";
import useUpdateProduct from "../hooks/useUpdateProduct";

export default function PatchForm(){
    type FormValues = z.infer<typeof patchProductSchema>
    const {data, error, isLoading} = useFetchProducts()   
    const updateProduct = useUpdateProduct()
    const { register, handleSubmit, formState: { isSubmitting} } = useForm<FormValues>({
        defaultValues: {
            quantiteActuelle: undefined,
            prixAchat: undefined,
            prixVente: undefined,
            productId: undefined,
        },
    });
    
    const onSubmit: SubmitHandler<FormValues> = async (data:any) => {
            delete data.categorieId
            updateProduct(data)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) { console.log(error); return <div>Error: {error.message}</div>}
    if (data) return(
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <label htmlFor="">quantiteActuelle</label>
            <input type="number" {...register('quantiteActuelle')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">prixAchat</label>
            <input type="number" {...register('prixAchat')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">prixVente</label>
            <input type="number" {...register('prixVente')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">productId</label>
            <select  {...register('productId')} className="border border-gray-300 rounded p-2">
                {data.map((product: any) => (
                    <option key={product.id} value={product.id} className="p-2 text-black">
                        {product.nom}
                    </option>
                ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">{isSubmitting ? <span className="animate-spin">En cours...</span>: 'Update'}</button>
        </form>
    )
}