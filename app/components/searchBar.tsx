'use client'
import { useEffect, useState } from "react";

export default function SearchBar(){
    const [search, setSearch] = useState('');
    const performSearch = ()=>{
        console.log('looking for '+search)
    }
    useEffect (()=>{
      const debouncedSearch = setTimeout(performSearch,500)
        return()=>{clearTimeout(debouncedSearch)}
    } ,[search])
    return(
        <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
    )
}