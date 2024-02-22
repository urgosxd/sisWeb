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

  const baseColumns = [
    {name:"ciudad",extra:"none",type: "text"},
    {name:"nombre",extra:"none",type: "text"},
    {name:"especialidad",extra:"none",type: "text"},
    {name:"tipoDeServicio",extra:"none",type: "text"},
    {name:"horarioDeAtencion",extra:"time",type: "text"},
    {name:"direccion",extra:"none",type:"text"},
    {name:"telefonoReserva",extra:"tel",type:"text"},
    {name:"telefonoRecepcion",extra:"tel",type:"text"},
    {name:"precioMenu",extra:"sol",type:"number"},
    {name:"precioMenuE",extra:"dolar",type:"number"},
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
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/restaurantes/restaurante/`} methods={{ create: createRest, update: updateRest, delete: deleteRest }} />
    </div>
  );
}
