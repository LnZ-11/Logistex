import useSWR from "swr";

export default function useFecthProducts() {
    const url = '/api/products';
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    })
    return { data, error, isLoading }
}