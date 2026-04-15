import { useState } from "react";
import { z } from "zod";
import { addMovementSchema } from "../../schema";
import { triggerProductUpdate, triggerMovementUpdate } from "@/app/hooks/global/useInventory";

type AddMovementInput = z.infer<typeof addMovementSchema>;

export default function useAddMovement() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addMovement = async (data: AddMovementInput) => {
        setIsPending(true);
        setError(null);
        try {
            const parsedData = addMovementSchema.parse(data);
            const response = await fetch('/api/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedData),
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to create movement');
            }
            triggerProductUpdate();
            triggerMovementUpdate();
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
    return { addMovement, isPending, error };
}
