// prisma/seed.ts
import prisma from '../lib/prisma';

async function main() {
    console.log('Début du remplissage de la base de données...');

    // --- 1. NETTOYAGE ---
    // On supprime dans l'ordre inverse des relations pour éviter les erreurs de clés étrangères
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log("Nettoyage effectué avec succès !")

    // catgorie accessoires
    const catAccessoires = await prisma.category.create({
        data: { nom: 'Accessoires', description: 'Accessoires' },
    });
    // sous categories accessoires
    const catSouris = await prisma.category.create({
        data: { nom: 'Souris', description: 'Souris', parentId: catAccessoires.id },
    })
    const catClavier = await prisma.category.create({
        data: { nom: 'Clavier', description: 'Clavier', parentId: catAccessoires.id },
    })
    const catAudio = await prisma.category.create({
        data: { nom: 'Audio', description: 'Audio', parentId: catAccessoires.id },
    })
    const catFlashDisk = await prisma.category.create({
        data: { nom: 'Flash Disk', description: 'Flash Disk', parentId: catAccessoires.id },
    })
    const catRack = await prisma.category.create({
        data: { nom: 'Rack', description: 'Rack', parentId: catAccessoires.id },
    })
    const catCable = await prisma.category.create({
        data: { nom: 'Cable', description: 'Cable', parentId: catAccessoires.id },
    })
    const catDivers = await prisma.category.create({
        data: { nom: 'Divers', description: 'Divers', parentId: catAccessoires.id },
    })

    // categorie encre et toner
    const catEncreEtTonner = await prisma.category.create({
        data: { nom: 'Encre et Toner', description: 'Encre et toner' },
    });

    // categorie Imprimantes
    const catImprimantes = await prisma.category.create({
        data: { nom: 'Imprimantes', description: 'imprimantes' },
    });
    // sous categorie Impreimante
    const catImprimantesLaser = await prisma.category.create({
        data: { nom: 'Imprimantes Laser', description: 'imprimantes laser', parentId: catImprimantes.id },
    })
    const catImprimantesEncre = await prisma.category.create({
        data: { nom: 'Imprimantes Encre', description: 'imprimantes encre', parentId: catImprimantes.id },
    })

    // categorie Services
    const catServices = await prisma.category.create({
        data: { nom: 'Services', description: 'Main d\'œuvre et maintenance' },
    });

    // categorie Ordinateurs
    const catOrdi = await prisma.category.create({
        data: { nom: 'Ordinateurs', description: 'PC complets et portables' },
    });
    // sous categorie de Ordinateurs
    const catLaptop = await prisma.category.create({
        data: { nom: 'Laptops', parentId: catOrdi.id },
    });

    const catBureau = await prisma.category.create({
        data: { nom: 'Bureaux', parentId: catOrdi.id },
    });

    const catOrdiBureau = await prisma.category.create({
        data: { nom: 'Ordinateurs de Bureau', description: 'Ordinateurs de bureau', parentId: catOrdi.id },
    });
    // sous categorie de Ordi de bureau
    const catUnite = await prisma.category.create({
        data: { nom: 'Unite centrales', parentId: catOrdiBureau.id }
    })
    const catEcran = await prisma.category.create({
        data: { nom: 'Ecran', parentId: catOrdiBureau.id }
    })

    // categorie pieces ordinateur -----
    const catPcsOrdinateur = await prisma.category.create({
        data: { nom: 'PCs Ordinateurs', description: 'PCs Ordinateurs' },
    });
    // sous categorie pieces ordinateur
    const catPcsOrdiBureau = await prisma.category.create({
        data: { nom: 'Pieces ordinateurs de Bureau', parentId: catPcsOrdinateur.id }
    })
    // sous categorie de pieces ordinateur de bureau
    const catCarteMereOrdiBureau = await prisma.category.create({
        data: { nom: 'Carte mere', parentId: catPcsOrdiBureau.id }
    })
    const catProcesseurOrdiBureau = await prisma.category.create({
        data: { nom: 'Processeur', parentId: catPcsOrdiBureau.id }
    })
    const catBoitierOrdiBureau = await prisma.category.create({
        data: { nom: 'Boitier', parentId: catPcsOrdiBureau.id }
    })
    const catAlimOrdiBureau = await prisma.category.create({
        data: { nom: 'Alimentation', parentId: catPcsOrdiBureau.id }
    })
    const catVentilateurOrdiBureau = await prisma.category.create({
        data: { nom: 'Ventilateur', parentId: catPcsOrdiBureau.id }
    })
    const catLecteurDVDOrdiBureau = await prisma.category.create({
        data: { nom: 'Lecteur DVD', parentId: catPcsOrdiBureau.id }
    })
    const catCarteGraphiqueOrdiBureau = await prisma.category.create({
        data: { nom: 'Carte graphique', parentId: catPcsOrdiBureau.id }
    })


    // Categories Pieces Laptop -----
    const catPcsOrdiLaptop = await prisma.category.create({
        data: { nom: 'Pieces Laptop', parentId: catPcsOrdinateur.id }
    })
    // sous categories pieces Laptop
    const catCarteMereLaptop = await prisma.category.create({
        data: { nom: 'Carte mere Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catCarcasseLaptop = await prisma.category.create({
        data: { nom: 'Carcasse Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catChargeurLaptop = await prisma.category.create({
        data: { nom: 'Chargeur Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catVentilateurLaptop = await prisma.category.create({
        data: { nom: 'Ventilateur Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catLecteurDVDLaptop = await prisma.category.create({
        data: { nom: 'Lecteur DVD Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catBatterieLaptop = await prisma.category.create({
        data: { nom: 'Batterie Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catClavierLaptop = await prisma.category.create({
        data: { nom: 'Clavier Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catEcranLaptop = await prisma.category.create({
        data: { nom: 'Ecran Laptop', parentId: catPcsOrdiLaptop.id }
    })
    const catConnecteurDeChargeLaptop = await prisma.category.create({
        data: { nom: 'Connecteur de charge', parentId: catPcsOrdiLaptop.id }
    })
    const catCharniereLaptop = await prisma.category.create({
        data: { nom: 'Charniere', parentId: catPcsOrdiLaptop.id }
    })
    const catRam = await prisma.category.create({
        data: { nom: 'RAM', parentId: catPcsOrdinateur.id },
    });
    const catStockage = await prisma.category.create({
        data: { nom: 'SSD', parentId: catPcsOrdinateur.id },
    });



    console.log('Base de données remplie avec succès ! ✅');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });