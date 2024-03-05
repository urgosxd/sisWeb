import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createHotel, deleteHotel, updateHotel } from "../lib/api";
import Title from "../compo/title/Title.tsx";

export const Hotel = () => {
  // const notification = useSWR(
  //   // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
  //   "http://127.0.0.1:8000/apiCrud/notification/notification/",
  //   // fetcher,{ refreshInterval: 1000 }
  //   fetcher
  // );

  
    const {user,currencyRate} = AuthData() as AuthProviderType

  if(!user.isAuthenticated){
   const ga = useNavigate()
    ga("/login")
  }

// ['id','ciudad','clase','nombre','categoria','telefono','telefonoRecepcion','simple','doble','triple','horarioDesayuno','checkIn','checkOut','figma','fichasTecnicas']
  const baseColumns = [ 
    {name:"ciudad",extra:"none",type: "text"},
    {name:"clase",extra:"none",type: "text"},
    {name:"nombre",extra:"none",type: "text"},
    {name:"categoria",extra:"none",type: "text"},
    {name:"telefonoReserva",extra:"tel",type:"text"},
    {name:"telefonoRecepcion",extra:"tel",type:"text"},
    {name:"precioConfidencial",extra:"dolar",type:"number"},
    {name:"simple",extra:"dolar",type:"number"},
    {name:"doble",extra:"dolar",type:"number"},
    {name:"triple",extra:"dolar",type:"number"},
    {name:"horarioDesayunoInicio",extra:"time",type:"text"},
    {name:"horarioDesayunoFinal",extra:"time",type:"text"},
    {name:"checkIn",extra:"time",type:"text"},
    {name:"checkOut",extra:"time",type:"text"},
    { name: "recomendacionesImagen", extra: "link", type: "text" },
    { name: "fichaTecnica", extra: "link", type: "text" },
    { name: "pdfProveedor", extra: "link", type: "text" },
  ]

const baseColumnsV = [
  {name:"ciudad",extra:"none",type: "text"},
    {name:"clase",extra:"none",type: "text"},
    {name:"nombre",extra:"none",type: "text"},
    {name:"categoria",extra:"none",type: "text"},
    {name:"telefonoReserva",extra:"tel",type:"text"},
    {name:"telefonoRecepcion",extra:"tel",type:"text"},
    {name:"precioConfidencial",extra:"dolar",type:"number"},
    {name:"simple",extra:"dolar",type:"number"},
    {name:"doble",extra:"dolar",type:"number"},
    {name:"triple",extra:"dolar",type:"number"},
    {name:"horarioDesayunoInicio",extra:"time",type:"text"},
    {name:"horarioDesayunoFinal",extra:"time",type:"text"},
    {name:"checkIn",extra:"time",type:"text"},
    {name:"checkOut",extra:"time",type:"text"},
    { name: "fichaTecnica", extra: "link", type: "text" },
  ]


  return (
    <div className={"mt-[170px] ml-3"}>
        <Typography>
            <Title title={"HOTELES"} />
        </Typography>
      <NotificationToast/>
      <RowTable baseColumns={user.role == "Operaciones" ? baseColumns : baseColumnsV} user={user} permission={user.role == "Operaciones" ? true : false} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/hoteles/hotel/`} methods={{create:createHotel,update:updateHotel,delete:deleteHotel}} />
    </div>
  );
}
