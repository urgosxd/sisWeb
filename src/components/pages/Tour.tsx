import useSWR from "swr";
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { RenderInfo } from "../structure/RenderNavigation";

export const Tour = () => {
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



    

  return (
    <div> 
        <Typography>
        TOURS
        </Typography>
      {/* <Input type={"number"} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/> */}
      <NotificationToast/>
      <RowTable permission={user.role == "Ventas" ? false:true} url={"http://127.0.0.1:8000/apiCrud/tours/tour/"} />
    </div>
  );
}
