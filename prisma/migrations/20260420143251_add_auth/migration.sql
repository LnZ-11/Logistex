-- 1. Création des énumérations (Enums)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StockType') THEN
        CREATE TYPE "StockType" AS ENUM ('ENTREE', 'SORTIE', 'AJUSTEMENT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
    END IF;
END $$;

-- 2. Table Category
CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "parentId" INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_nom_key" ON "Category"("nom");

-- 3. Table User (Authentification)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER'
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- 4. Table Product
CREATE TABLE IF NOT EXISTS "Product" (
    "id" SERIAL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "quantiteActuelle" INTEGER NOT NULL,
    "seuilCritique" INTEGER NOT NULL,
    "prixAchat" DOUBLE PRECISION NOT NULL,
    "prixVente" DOUBLE PRECISION NOT NULL,
    "categorieId" INTEGER NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_barcode_key" ON "Product"("barcode");

-- 5. Table Session (Gestion des sessions DB)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Table StockMovement
CREATE TABLE IF NOT EXISTS "StockMovement" (
    "id" SERIAL PRIMARY KEY,
    "typeMouvement" "StockType" NOT NULL,
    "reference" TEXT,
    "raison" TEXT,
    "dateMouvement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table StockMovementItem
CREATE TABLE IF NOT EXISTS "StockMovementItem" (
    "id" SERIAL PRIMARY KEY,
    "mouvementId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantiteChangee" INTEGER NOT NULL,
    CONSTRAINT "StockMovementItem_mouvementId_fkey" FOREIGN KEY ("mouvementId") REFERENCES "StockMovement"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StockMovementItem_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);