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

    const rawProducts = [
        {
            "id": 39,
            "sku": "ACC-AUD-JED-553",
            "barcode": "6974316463009",
            "nom": "Jedel S-553",
            "description": "Gaming Baffle baff usb couleur",
            "quantiteActuelle": 4,
            "seuilCritique": 0,
            "prixAchat": 900,
            "prixVente": 1600,
            "categorieId": 4,
            "dateCreation": "2026-04-10T10:58:55.985Z",
            "dateMiseAJour": "2026-04-10T10:58:55.985Z"
        },
        {
            "id": 41,
            "sku": "ACC-DIV-PAP-NORM",
            "barcode": "6133746002619",
            "nom": "Noram Ram 500 Feuilles A4",
            "description": "papier A4 Ram",
            "quantiteActuelle": 15,
            "seuilCritique": 3,
            "prixAchat": 480,
            "prixVente": 580,
            "categorieId": 8,
            "dateCreation": "2026-04-10T11:05:15.930Z",
            "dateMiseAJour": "2026-04-10T11:05:15.930Z"
        },
        {
            "id": 1,
            "sku": "ENT-TNR-RCC-435A",
            "barcode": "6936809796418",
            "nom": "RC Cartridge 435A/436A/278A/285A",
            "description": "Toner Laser Canon LBP-6200, MF-4410, MF-4430, MF-4450, MF-4550, MF-4570, MF-4580, MF-4730, MF-4750, MF-4780, MF-4870, MF-4890. LBP-6000, LBP-6020, LBP-6030, MF-3010. LaserJet Pro M1210/M1212nf/P1102/P1102w.",
            "quantiteActuelle": 16,
            "seuilCritique": 3,
            "prixAchat": 900,
            "prixVente": 1400,
            "categorieId": 9,
            "dateCreation": "2026-04-09T23:00:39.575Z",
            "dateMiseAJour": "2026-04-10T11:09:24.680Z"
        },
        {
            "id": 2,
            "sku": "ENT-TNR-STI-450A",
            "barcode": "6950840639318",
            "nom": "Star Ink 435A/436A/278A/285A",
            "description": "Toner 435A/436A/278A/285A Cartouche Toner Laser Canon et HP LaserJet Pro P1102/P1102w/M1132.",
            "quantiteActuelle": 3,
            "seuilCritique": 0,
            "prixAchat": 900,
            "prixVente": 1400,
            "categorieId": 9,
            "dateCreation": "2026-04-09T23:03:46.486Z",
            "dateMiseAJour": "2026-04-10T11:09:49.402Z"
        },
        {
            "id": 36,
            "sku": "ENT-TNR-RCC-TN1000",
            "barcode": "6936904790683",
            "nom": "RC Cartridge TN1000/1030/1040/1050/1060/1070/1075",
            "description": "Toner Cartouche Laser Brother HL-1110, HL-1112, HL-1210W, DCP-1510, MFC-1810.",
            "quantiteActuelle": 4,
            "seuilCritique": 3,
            "prixAchat": 750,
            "prixVente": 1400,
            "categorieId": 9,
            "dateCreation": "2026-04-09T23:19:13.551Z",
            "dateMiseAJour": "2026-04-12T16:21:00.344Z"
        },
        {
            "id": 40,
            "sku": "ACC-AUD-JED-526",
            "barcode": "6974316462743",
            "nom": "Jedel S-526",
            "description": "Baffle baff gaming couleur usb",
            "quantiteActuelle": 4,
            "seuilCritique": 0,
            "prixAchat": 1100,
            "prixVente": 1900,
            "categorieId": 4,
            "dateCreation": "2026-04-10T11:00:49.206Z",
            "dateMiseAJour": "2026-04-13T11:37:25.775Z"
        },
        {
            "id": 38,
            "sku": "IMP-INK-CAN-G3410",
            "barcode": "4549292095487",
            "nom": "Canon Pixma G3410",
            "description": "imprimante canon pixma",
            "quantiteActuelle": 3,
            "seuilCritique": 0,
            "prixAchat": 39900,
            "prixVente": 47000,
            "categorieId": 12,
            "dateCreation": "2026-04-09T23:24:30.058Z",
            "dateMiseAJour": "2026-04-13T11:59:16.446Z"
        },
        {
            "id": 35,
            "sku": "ENT-TNR-IPR-2612A",
            "barcode": "6936904796159",
            "nom": "Ink Print RC 2612A/C103/503/703/FX9/10/L90/C104",
            "description": "Laser 2612A/C103/503/703/FX9/10/L90/C104. HP LaserJet P1102, P1005, M1132 MFP.",
            "quantiteActuelle": 3,
            "seuilCritique": 3,
            "prixAchat": 950,
            "prixVente": 1500,
            "categorieId": 9,
            "dateCreation": "2026-04-09T23:15:04.100Z",
            "dateMiseAJour": "2026-04-13T12:00:48.362Z"
        },
        {
            "id": 37,
            "sku": "ENT-TNR-NWL-4092A",
            "barcode": null,
            "nom": "New Light 4092A/EP22",
            "description": "New Light Laser Cartouche 4092A/EP22 Tonner toner",
            "quantiteActuelle": 1,
            "seuilCritique": 0,
            "prixAchat": 950,
            "prixVente": 1500,
            "categorieId": 9,
            "dateCreation": "2026-04-09T23:22:17.939Z",
            "dateMiseAJour": "2026-04-13T12:00:59.948Z"
        }
    ]

    console.log("🚀 Injection des produits...");
    for (const prod of rawProducts) {
        await prisma.product.create({
            data: prod
        });
    }

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