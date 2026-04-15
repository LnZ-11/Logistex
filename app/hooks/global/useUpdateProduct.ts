import { patchProductSchema } from "@/app/schema";
import { z } from "zod";
import { useState } from "react";
import { triggerProductUpdate } from "@/app/hooks/global/useInventory";

type FormValues = z.input<typeof patchProductSchema>;

export default function useUpdateProduct() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    console.log("hook initialised")

    const updateProduct = async (data: FormValues) => {
        console.log("updateProduct running...");
        try {
            setIsPending(true);
            setError(null);
            const parsedData = patchProductSchema.parse(data);
            const response = await fetch('/api/products', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to update product');
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
    return { updateProduct, isPending, error };
}