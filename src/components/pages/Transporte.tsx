
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createBoleto, createHotel, createRest, createTransporte, createTraslado, createTren, deleteBoleto, deleteHotel, deleteRest, deleteTransporte, deleteTraslado, deleteTren, updateBoleto, updateHotel, updateRest, updateTransporte, updateTraslado, updateTren } from "../lib/api";
import Title from "../compo/title/Title.tsx";

export const Transporte = () => {
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
    {name:"ppp",extra:"sol",type:"number"},
    {name:"ppe",extra:"dolar",type:"number"},
  ]

  return (
    <div className={"mt-10 ml-10"}>
      <Typography>
          <Title title={"TRANSPORTE"} />

      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={`${import.meta.env.VITE_URL_BACK}/apiCrud/transportes/transporte/`} methods={{ create: createTransporte, update: updateTransporte, delete: deleteTransporte }} />
    </div>
  );
}
