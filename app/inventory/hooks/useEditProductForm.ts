import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo, useEffect } from 'react';
import { patchProductSchema } from '@/app/schema';
import { useInventoryStore } from './useInventoryStore';

export type FormInput = z.input<typeof patchProductSchema>;
export type FormOutput = z.output<typeof patchProductSchema>;

export function useEditProductForm(): UseFormReturn<FormInput, any, FormOutput> {
  const selectedProduct = useInventoryStore((state) => state.selectedProduct);

  const defaultValues = useMemo(() => ({
    productId: selectedProduct?.id ?? 0,
    description: selectedProduct?.description || selectedProduct?.nom || '',
    prixAchat: selectedProduct?.prixAchat ?? 0,
    prixVente: selectedProduct?.prixVente ?? 0,
    quantiteActuelle: selectedProduct?.quantiteActuelle ?? 0,
    seuilCritique: selectedProduct?.seuilCritique ?? 0,
  }), [selectedProduct]);

  const form = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(patchProductSchema),
    defaultValues
  });

  const { reset } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return form;
}
