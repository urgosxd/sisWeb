import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createHotel, createRest, deleteHotel, deleteRest, updateHotel, updateRest } from "../lib/api";

export const Restaurante = () => {
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

  // ['id','ciudad','nombre','especialidad','tipoDeServicio','horarioDeAtencion','direccion','telefonoReserva','telefonoRecepcion','precioMenu','precioMenuE','checkOut','figma','fichasTecnicas']
  const baseColumns = [
    {name:"ciudad",extra:"none",type: "text"},
    {name:"clase",extra:"none",type: "text"},
    {name:"nombre",extra:"none",type: "text"},
    {name:"categoria",extra:"none",type: "text"},
    {name:"telefono",extra:"tel",type: "text"},
    {name:"telefonoRecepcion",extra:"tel",type:"text"},
    {name:"simple",extra:"dolar",type:"number"},
    {name:"doble",extra:"dolar",type:"number"},
    {name:"triple",extra:"dolar",type:"number"},
    {name:"horarioDesayuno",extra:"time",type:"text"},
    {name:"checkIn",extra:"time",type:"text"},
    {name:"checkOut",extra:"time",type:"text"},
    {name:"figma",extra:"none",type:"text"},
    {name:"pdf",extra:"none",type:"file"},
  ]


  return (
    <div>
      <Typography>
        RESTAURANTE
      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={"http://127.0.0.1:8000/apiCrud/hoteles/hotel/"} methods={{ create: createRest, update: updateRest, delete: deleteRest }} />
    </div>
  );
}
