'use client'
import useFetchCategories from "../hooks/global/useFetchCategories"
import useFetchProducts from "../hooks/global/useFetchProducts"


export default function productSorted() {
    const {data: categoriesData, error: categoriesError, isLoading: categoriesIsLoading} = useFetchCategories()
    const {data: productsData, error: productsError, isLoading: productsIsLoading} = useFetchProducts()
    return(
        <div>
            {categoriesData?.map((category: any) => (
                <div key={category.id}>
                    <h2>{category.nom}</h2>
                    {productsData?.filter((product: any) => product.categorieId === category.id).map((product: any) => (
                        <div key={product.id}>
                            <p>{product.nom}</p>
                            <p>{product.quantiteActuelle}</p>
                            <p>{product.prixAchat}</p>
                            <p>{product.prixVente}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}