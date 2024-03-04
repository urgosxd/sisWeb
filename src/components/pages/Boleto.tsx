import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable"; import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createBoleto, createHotel, createRest, deleteBoleto, deleteHotel, deleteRest, updateBoleto, updateHotel, updateRest } from "../lib/api";
import Title from "../compo/title/Title.tsx";

export const Boleto = () => {
  // const notification = useSWR(
  //   // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
  //   "http://127.0.0.1:8000/apiCrud/notification/notification/",
  //   // fetcher,{ refreshInterval: 1000 }
  //   fetcher
  // );


  const { user, currencyRate } = AuthData() as AuthProviderType

  if (!user.isAuthenticated) {
    const ga = useNavigate()
    ga("/login")
  }


        // fields = ['id','ciudad','servicio','pppAdulto','ppeAdulto','pppNinio','ppeNinio','pppInfante','ppeInfante','estudinateP','estudianteE']
  const baseColumns = [
    {name:"ciudad",extra:"none",type: "text"},
    {name:"servicio",extra:"none",type: "text"},
    {name:"pppAdulto",extra:"sol",type:"number"},
    {name:"ppeAdulto",extra:"dolar",type:"number"},
    {name:"pppNinio",extra:"sol",type:"number"},
    {name:"ppeNinio",extra:"dolar",type:"number"},
    {name:"pppInfante",extra:"sol",type:"number"},
    {name:"ppeInfante",extra:"dolar",type:"number"},
    {name:"precioMenuE",extra:"dolar",type:"number"},
    {name:"estudianteP",extra:"sol",type:"number"},
    {name:"estudianteE",extra:"dolar",type:"number"},
  ]

  return (
    <div className={"mt-10 ml-10"}>
      <Typography >
        <Title title={"BOLETOS"} />
      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/boletos/boleto/`} methods={{ create: createBoleto, update: updateBoleto, delete: deleteBoleto }} />
    </div>
  );
}
