import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { StockType } from "@/app/generated/prisma";

const movementSchema = z.object({
  produitId: z.coerce.number().int().positive(),
  typeMouvement: z.nativeEnum(StockType),
  quantiteChangee: z.coerce.number().int().positive(),
  raison: z.string().optional(),
});

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        items: {
          include: {
            produit: { select: { nom: true, sku: true } }
          }
        }
      },
      orderBy: { dateMouvement: 'desc' },
      take: 100 // Limit to recent 100
    });
    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = movementSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // Create movement
      const movement = await tx.stockMovement.create({
        data: {
          typeMouvement: validatedData.typeMouvement,
          raison: validatedData.raison,
          items: {
            create: [
              {
                produitId: validatedData.produitId,
                quantiteChangee: validatedData.quantiteChangee,
              }
            ]
          }
        },
        include: { items: true }
      });

      // Update product quantity
      const modifier = validatedData.typeMouvement === StockType.ENTREE ? validatedData.quantiteChangee :
                       validatedData.typeMouvement === StockType.SORTIE ? -validatedData.quantiteChangee :
                       validatedData.typeMouvement === StockType.AJUSTEMENT ? validatedData.quantiteChangee : 0;

      await tx.product.update({
        where: { id: validatedData.produitId },
        data: {
          quantiteActuelle: { increment: modifier }
        }
      });

      return movement;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create movement" }, { status: 500 });
  }
}
