import useSWR from "swr";
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const Home = () => {
  const { data, error, isLoading } = useSWR(
    "https://siswebbackend.pdsviajes.com/apiCrud/tours/",
    fetcher
  );
  const TABLE_HEAD = ["Ciudad", "Excursion", "Proveedor", "ppp", "pvp"];
  const TABLE_ROWS: {
    ciudad: string
    excursion: string
    provedor: string
    ppp: string
    pvp: string
  }[] = data
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  console.log(data)
  return (
    <div> 

      <RowTable TABLE_HEAD={Object.keys(data[0])} TABLE_ROWS={data}/>

      
    </div>
  );
}
