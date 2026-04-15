import z from "zod"

export const productSchema = z.object({
    productId: z.number().int(),
    sku: z.string().min(3),
    barcode: z.string().optional().nullable(),
    nom: z.string().min(1),
    description: z.string().min(1),
    quantiteActuelle: z.number().int().nonnegative(),
    seuilCritique: z.number().int().default(5),
    prixAchat: z.number().positive(),
    prixVente: z.number().positive(),
    categorieId: z.number().int(),
})

export const patchProductSchema = z.object({
    productId: z.coerce.number().int(),
    quantiteActuelle: z.number().int().nonnegative().optional(),
    prixAchat: z.number().positive().optional(),
    prixVente: z.number().positive().optional(),
    description: z.string().min(1).optional(),
    seuilCritique: z.number().int().optional(),
})

export const productFindSchema = z.object({
    categorieId: z.number().int(),
})

export const deleteProductSchema = z.object({
    productId: z.number().int(),
})

export const addMovementSchema = z.object({
    produitId: z.number().int(),
    typeMouvement: z.enum(['ENTREE', 'SORTIE']),
    quantiteChangee: z.number().int().positive(),
    raison: z.string().min(1),
})