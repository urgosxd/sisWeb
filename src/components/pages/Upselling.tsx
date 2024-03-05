
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createBoleto, createHotel, createRest, createTraslado, createTren, createUps, deleteBoleto, deleteHotel, deleteRest, deleteTraslado, deleteTren, deleteUps, updateBoleto, updateHotel, updateRest, updateTraslado, updateTren, updateUps } from "../lib/api";
import Title from "../compo/title/Title.tsx";

export const Upselling = () => {
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
    {name:"servicioProducto",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"pnp",extra:"sol",type:"number"},
    {name:"pne",extra:"dolar",type:"number"},
    {name:"pvp",extra:"sol",type:"number"},
    {name:"pve",extra:"dolar",type:"number"},
  ]
  const baseColumnsO = [
    {name:"servicioProducto",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"pnp",extra:"sol",type:"number"},
    {name:"pne",extra:"dolar",type:"number"},
    {name:"pvp",extra:"sol",type:"number"},
    {name:"pve",extra:"dolar",type:"number"},
  ]
  const baseColumnsV = [
    {name:"servicioProducto",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"pnp",extra:"sol",type:"number"},
    {name:"pne",extra:"dolar",type:"number"},
    {name:"pvp",extra:"sol",type:"number"},
    {name:"pve",extra:"dolar",type:"number"},
  ]
  return (
    <div className={"mt-[170px] ml-3"}>
      <Typography>
          <Title title={"UPSELLING"} />

      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      {/* <RowTable baseColumns={user.role == "Operaciones" ? baseColumns : baseColumnsV} user={user} permission={user.role == "Operaciones" ? true : false} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/upsellings/upselling/`} methods={{ create: createUps, update: updateUps, delete: deleteUps }} /> */}
      <RowTable baseColumns={user.role == "Administrator" ? roles[roleMode] : roles[user.role]} user={user} permission={user.role == "Administrator" ? permisos[roleMode]: permisos[user.role]} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/upsellings/upselling/`} />
    </div>
  );
}
