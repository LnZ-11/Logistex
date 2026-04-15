import { Stack } from "@mui/material";
import useFetchProducts from "../hooks/global/useFetchProducts";
import Card from "./card";

export default function CardBoard() {
    const {data, error, isLoading} = useFetchProducts()
    if (isLoading) return <div>Loading...</div>
    if (error) { console.log(error); return <div>Error: {error.message}</div>}
    if (data) return(
        <Stack
        width={1/2}
        flexWrap={'wrap'}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        >
        {data?.map((product: any) => (
            <Card key={product.id} product={product} />
        ))}
        </Stack>
    );
}