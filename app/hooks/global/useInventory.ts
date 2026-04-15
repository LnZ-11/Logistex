import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useFetchProducts() {
  const { data, error, isLoading, mutate: mutateProducts } = useSWR('/api/products', fetcher);
  return { products: data, error, isLoading, mutateProducts };
}

export function useFetchCategories() {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher);
  return { categories: data, error, isLoading };
}

export function useFetchMovements() {
  const { data, error, isLoading, mutate: mutateMovements } = useSWR('/api/movements', fetcher);
  return { movements: data, error, isLoading, mutateMovements };
}

// Global mutate triggers for optimistic updates
export const triggerProductUpdate = () => mutate('/api/products');
export const triggerMovementUpdate = () => mutate('/api/movements');
