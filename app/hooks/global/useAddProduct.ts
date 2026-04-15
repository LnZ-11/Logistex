'use client'

import { productSchema } from "@/app/schema";
import { z } from "zod";
import { useState } from "react";
import { triggerProductUpdate } from "@/app/hooks/global/useInventory";

type FormValues = z.input<typeof productSchema>;

export default function useAddProduct() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addProduct = async (data: FormValues) => {
        setIsPending(true);
        setError(null);
        try {
            const parsedData = productSchema.parse(data);
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to create product');
            }
            triggerProductUpdate();
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error occurred');
            }
            throw err;
        } finally {
            setIsPending(false);
        }
    };
    return { addProduct, isPending, error };
}