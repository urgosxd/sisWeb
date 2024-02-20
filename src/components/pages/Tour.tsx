import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";
import { AuthData } from "../../provider/authProvider";
import { AuthProviderType } from "../../@types/authTypes";
import { useNavigate } from "react-router-dom";
import { createTour, deleteTour, getFicha, updateTour } from "../lib/api";

export const Tour = () => {
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
    {name:"ciudad",extra:"none"},
    {name:"excursion",extra:"none"},
    {name:"provedor",extra:"none"},
    {name:"ppp",extra:"sol"},
    {name:"ppe",extra:"dolar"},
    {name:"pvp",extra:"sol"},
    {name:"pve",extra:"dolar"},
    {name:"figma",extra:"none"},
    {name:"pdf",extra:"none"},
  ]


  return (
    <div>
      <Typography>
        TOURS
      </Typography>
      <NotificationToast />
      <RowTable baseColumns={baseColumns} permission={user.role == "Ventas" ? false : true} url={"http://127.0.0.1:8000/apiCrud/tours/tour/"} methods={{ create: createTour, update: updateTour, delete: deleteTour }} />
    </div>
  );
}
