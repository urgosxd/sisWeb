
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";
import { createBoleto, createHotel, createRest, createTraslado, createTren, createUps, deleteBoleto, deleteHotel, deleteRest, deleteTraslado, deleteTren, deleteUps, updateBoleto, updateHotel, updateRest, updateTraslado, updateTren, updateUps } from "../lib/api";

export const Upselling = () => {
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
    {name:"servicioProducto",extra:"none",type: "text"},
    {name:"detalle",extra:"large",type: "text"},
    {name:"ppp",extra:"sol",type:"number"},
    {name:"ppe",extra:"dolar",type:"number"},
  ]

  return (
    <div>
      <Typography>
        UPSELLING
      </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast />
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={"http://127.0.0.1:8000/apiCrud/upsellings/upselling/"} methods={{ create: createUps, update: updateUps, delete: deleteUps }} />
    </div>
  );
}
