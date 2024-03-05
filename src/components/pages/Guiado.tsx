
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createBoleto, createGuiado, createHotel, createRest, createTraslado, createTren, createUps, deleteBoleto, deleteGuiado, deleteHotel, deleteRest, deleteTraslado, deleteTren, updateBoleto, updateGuiado, updateHotel, updateRest, updateTraslado, updateTren } from "../lib/api";
import Title from "../compo/title/Title.tsx";

export const Guiado = () => {
  // const notification = useSWR(
  //   // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
  //   "http://127.0.0.1:8000/apiCrud/notification/notification/",
  //   // fetcher,{ refreshInterval: 1000 }
  //   fetcher
  // );


  const { user, roleMode } = AuthData() as AuthProviderType

  if (!user.isAuthenticated) {
    const ga = useNavigate()
    ga("/login")
  }


        // fields = ['id','ciudad','servicio','pppAdulto','ppeAdulto','pppNinio','ppeNinio','pppInfante','ppeInfante','estudinateP','estudianteE']
  const baseColumns = [
    {name:"servicio",extra:"none",type: "text"},
    {name:"idioma",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"precioPullp",extra:"sol",type: "number"},
    {name:"precioPulle",extra:"dolar",type: "number"},
    {name:"precioPrivadop",extra:"sol",type: "number"},
    {name:"precioPrivadoe",extra:"dolar",type: "number"},
  ]
  const baseColumnsO = [
    {name:"servicio",extra:"none",type: "text"},
    {name:"idioma",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"precioPullp",extra:"sol",type: "number"},
    {name:"precioPulle",extra:"dolar",type: "number"},
    {name:"precioPrivadop",extra:"sol",type: "number"},
    {name:"precioPrivadoe",extra:"dolar",type: "number"},
  ]
const baseColumnsV = [
    {name:"servicio",extra:"none",type: "text"},
    {name:"idioma",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"precioPullp",extra:"sol",type: "number"},
    {name:"precioPulle",extra:"dolar",type: "number"},
    {name:"precioPrivadop",extra:"sol",type: "number"},
    {name:"precioPrivadoe",extra:"dolar",type: "number"},
  ]
 const roles:{[key:string]:any} = {
    "Operaciones":baseColumnsO,
    "Ventas":baseColumnsV,
    "Administrator":baseColumns
  }

  const permisos:{[key:string]:boolean} = {
    "Operaciones":false,
    "Ventas": false,
    "Administrator":true
  }


  return (
    <div className={"mt-[170px] ml-3"}>
      <Typography>
        <Title title={"GUIADO"} />
      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      {/* <RowTable baseColumns={user.role == "Operaciones" ? baseColumns : baseColumnsV}  user={user} permission={user.role == "Operaciones" ? true : false} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/guiados/guiado/`} methods={{ create: createGuiado, update: updateGuiado, delete: deleteGuiado }} /> */}
      <RowTable baseColumns={user.role == "Administrator" ? roles[roleMode] : roles[user.role]} user={user} permission={user.role == "Administrator" ? permisos[roleMode]: permisos[user.role]} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/guiados/guiado/`} />
    </div>
  );
}
