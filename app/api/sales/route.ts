import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { StockType } from "@/app/generated/prisma";

const saleItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1),
  raison: z.string().optional().default("Vente TPV"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = saleSchema.parse(body);
    console.log("schema valide")
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify products and compute details
      const movementItems = [];
      for (const item of validatedData.items) {
        console.log("item valider")
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.quantiteActuelle < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.nom}. Required: ${item.quantity}, Available: ${product.quantiteActuelle}`);
        }

        movementItems.push({
          produitId: item.productId,
          quantiteChangee: item.quantity
        });
      }

      // 2. Create a single grouped movement
      let movement = await tx.stockMovement.create({
        data: {
          typeMouvement: StockType.SORTIE,
          raison: validatedData.raison,
          items: {
            create: movementItems
          }
        },
        include: {
          items: true
        }
      });
      console.log("movement creer")
      // 3. Update it with a reference based on ID
      movement = await tx.stockMovement.update({
        where: { id: movement.id },
        data: {
          reference: `V-${movement.id.toString().padStart(4, '0')}`
        },
        include: {
          items: true
        }
      });
      console.log("movement update")
      // 4. Update stock
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantiteActuelle: { decrement: item.quantity }
          }
        });
      }

      return [movement];
    });

    return NextResponse.json({ success: true, count: result.length, movements: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed to process sale";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
