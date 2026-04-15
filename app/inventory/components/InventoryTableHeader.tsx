export default function InventoryTableHeader() {
  return (
    <thead>
      <tr className="bg-base-300">
        <th>SKU</th>
        <th>Nom & Catégorie</th>
        <th>Stock Actuel</th>
        <th>Prix (Achat / Vente)</th>
        <th className="text-right">Actions rapides</th>
        <th className="text-right">Gérer</th>
      </tr>
    </thead>
  );
}
