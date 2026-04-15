import { deleteProductSchema } from "@/app/schema";
import { z } from "zod";
import { useState } from "react";
import { triggerProductUpdate } from "@/app/hooks/global/useInventory";

type DeleteInput = z.infer<typeof deleteProductSchema>;

export default function useDeleteProduct() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProduct = async (data: DeleteInput) => {
        setIsPending(true);
        setError(null);
        try {
            const parsedData = deleteProductSchema.parse(data);
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to delete product');
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
    return { deleteProduct, isPending, error };
}