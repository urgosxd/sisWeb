import useSWR from "swr";
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const Home = () => {
  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    "http://127.0.0.1:8000/apiCrud/tours/tour/",
    fetcher
  );
  const [isCreating,setIsCreating] = useState(false)
  
  const TABLE_HEAD = ["Ciudad", "Excursion", "Proveedor", "ppp", "pvp","pdf","Edit"];
  const TABLE_ROWS: {
    id:number
    ciudad: string
    excursion: string
    provedor: string
    ppp: string
    pvp: string
    fichasTecnicas: number[]
  }[] = data
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  console.log(data)
  return (
    <div> 
      <RowTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={TABLE_ROWS} isCreating={isCreating}/>

      <button onClick={()=>setIsCreating(prev=>!prev)}> ++</button>
      
    </div>
  );
}
