import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

    const movement = await prisma.stockMovement.findUnique({ 
      where: { id },
      include: { items: true }
    });

    if (!movement) {
      return NextResponse.json({ error: 'Mouvement introuvable' }, { status: 404 });
    }

    if (movement.typeMouvement !== 'SORTIE') {
      return NextResponse.json({ error: 'Seules les sorties (ventes) peuvent être annulées' }, { status: 400 });
    }

    if (movement.raison && movement.raison.includes('[ANNULÉ]')) {
      return NextResponse.json({ error: 'Ce mouvement a déjà été annulé' }, { status: 400 });
    }

    const updatedRaison = movement.raison ? `${movement.raison} [ANNULÉ]` : 'Vente TPV [ANNULÉ]';

    // Transaction pour garantir l'intégrité
    await prisma.$transaction(async (tx) => {
      // 1. Marquer le mouvement original comme annulé
      await tx.stockMovement.update({
        where: { id },
        data: { raison: updatedRaison }
      });
      
      // 2. Créer un mouvement compensatoire
      await tx.stockMovement.create({
        data: {
          typeMouvement: 'ENTREE',
          reference: movement.reference,
          raison: `Annulation de la vente #${id}`,
          items: {
            create: movement.items.map(item => ({
              produitId: item.produitId,
              quantiteChangee: item.quantiteChangee
            }))
          }
        }
      });

      // 3. Remettre en stock la quantité pour chaque article
      for (const item of movement.items) {
        await tx.product.update({
          where: { id: item.produitId },
          data: {
            quantiteActuelle: { increment: item.quantiteChangee }
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/movements/[id]/cancel Error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'annulation' }, { status: 500 });
  }
}
