import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

// route.ts
const productSchema = z.object({
    sku: z.string().min(3),
    barcode: z.string().optional().nullable().transform(val => val === "" ? null : val),
    nom: z.string().min(1),
    description: z.string().min(1),
    // Utilise z.coerce
    quantiteActuelle: z.coerce.number().int().nonnegative(),
    seuilCritique: z.coerce.number().int().default(5),
    prixAchat: z.coerce.number().positive(),
    prixVente: z.coerce.number().positive(),
    categorieId: z.coerce.number().int(),
});
const updateProductSchema = z.object({
    productId: z.coerce.number().int().positive(),
    barcode: z.string().optional().nullable().transform(val => val === "" ? null : val),
    description: z.string().min(1),
    quantiteActuelle: z.coerce.number().int().nonnegative().optional(),
    prixAchat: z.coerce.number().nonnegative().optional(),
    prixVente: z.coerce.number().nonnegative().optional(),
}).partial();
const deleteProductSchema = z.object({
    productId: z.coerce.number().int().positive(),
})

// Schéma de validation des query params du GET
const productFindSchema = z.object({
    categorieId: z.coerce.number().int().positive(),
}).partial(); // categorieId est optionnel → si absent, on retourne tous les produits

export async function GET(request: Request) {
    try {
        // Lecture des query params depuis l'URL (fonctionne côté serveur)
        const { searchParams } = new URL(request.url);
        const rawParams = Object.fromEntries(searchParams.entries());
        // Validation Zod des paramètres reçus
        const validatedParams = productFindSchema.parse(rawParams);
        const products = await prisma.product.findMany({
            where: { ...(validatedParams.categorieId !== undefined && { categorieId: validatedParams.categorieId, }), },
            include: { categorie: { select: { nom: true } }, }, // On récupère le nom de la catégorie pour l'UI
            orderBy: { nom: "asc" },
        });
        console.log("produits charge");
        return NextResponse.json(products);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation avec Zod
        const validatedData = productSchema.parse(body);

        const newProduct = await prisma.product.create({
            data: validatedData,
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues }, { status: 400 });
        }
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: "Ce SKU existe déjà en stock." },
                    { status: 409 } // 409 = Conflict
                );
            }
        }
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        if (!body.productId) {
            console.log("ID manquant")
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }
        console.log("ID OK")
        if (!deleteProductSchema.safeParse(body).success) {
            console.log("le schema n'est pas respecter")
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }
        const validatedData = deleteProductSchema.parse(body);
        console.log("schema OK")

        console.log("tout est OK, place a prisma")
        console.log(validatedData.productId)
        const updatedProduct = await prisma.product.delete({
            where: { id: validatedData.productId },
        });
        console.log("delete OK")
        return NextResponse.json(updatedProduct);
    }
    catch {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        console.log("PATCH en cours")
        const body = await request.json();
        if (!body.productId) {
            console.log("ID manquant")
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }
        console.log("ID OK")
        if (!updateProductSchema.safeParse(body).success) {
            console.log("le schema n'est pas respecter")
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }
        const validatedData = updateProductSchema.parse(body);
        console.log("schema OK")
        const updatedData: any = {};
        if (validatedData.quantiteActuelle !== 0 && validatedData.quantiteActuelle !== null && validatedData.quantiteActuelle !== undefined) {
            updatedData.quantiteActuelle = validatedData.quantiteActuelle;
        }
        if (validatedData.prixAchat !== 0 && validatedData.prixAchat !== null && validatedData.prixAchat !== undefined) {
            updatedData.prixAchat = validatedData.prixAchat;
        }
        if (validatedData.prixVente !== 0 && validatedData.prixVente !== null && validatedData.prixVente !== undefined) {
            updatedData.prixVente = validatedData.prixVente;
        }
        if (validatedData.description !== "" && validatedData.description !== null && validatedData.description !== undefined) {
            updatedData.description = validatedData.description;
        }
        if (validatedData.barcode !== undefined) {
            updatedData.barcode = validatedData.barcode;
        }

        if (Object.keys(updatedData).length === 0) {
            console.log("Rien à modifier")
            return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });
        }
        console.log("tout est OK, place a prisma")
        console.log(validatedData.productId)
        const updatedProduct = await prisma.product.update({
            where: { id: validatedData.productId },
            data: updatedData,
        });
        console.log("update OK")
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}