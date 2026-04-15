"use client"

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { productSchema } from "../schema";
import { z } from "zod";
import useFetchCategories from "../hooks/useFetchCategories";
import useAddProduct from "../hooks/useAddProduct";

export default function Form(){
    
    type FormValues = z.infer<typeof productSchema>
    const {data, error, isLoading} = useFetchCategories()
    const addProduct = useAddProduct()    
    const { register, handleSubmit, formState: { isSubmitting} } = useForm<FormValues>({
        defaultValues: {
            sku: '',
            nom: '',
            description: '',
            quantiteActuelle: 0,
            seuilCritique: 0,
            prixAchat: 0,
            prixVente: 0,
            categorieId: 0,
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data:any) => {
            addProduct(data)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) { console.log(error); return <div>Error: {error.message}</div>}
    if (data) return(
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <label htmlFor="">sku</label>
            <input type="text" {...register('sku')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">nom</label>
            <input type="text" {...register('nom')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">description</label>
            <input type="text" {...register('description')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">quantiteActuelle</label>
            <input type="number" {...register('quantiteActuelle')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">seuilCritique</label>
            <input type="number" {...register('seuilCritique')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">prixAchat</label>
            <input type="number" {...register('prixAchat')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">prixVente</label>
            <input type="number" {...register('prixVente')} placeholder="" className="border border-gray-300 rounded p-2"/>
            <label htmlFor="">categorieId</label>
            <select  {...register('categorieId')} className="border border-gray-300 rounded p-2">
                {data.map((category: any) => (
                    <option key={category.id} value={category.id} className="p-2 text-black">
                        {category.nom}
                    </option>
                ))}
            </select>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">{isSubmitting ? <span className="animate-spin">En cours...</span>: 'Ajouter'}</button>
        </form>
    )
}