import useSWR from "swr";
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import RowTable from "../compo/rowTable";
import NotificationToast from "../compo/notification";

export const Home = () => {
  // const notification = useSWR(
  //   // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
  //   "http://127.0.0.1:8000/apiCrud/notification/notification/",
  //   // fetcher,{ refreshInterval: 1000 }
  //   fetcher
  // );



  return (
    <div> 
      <NotificationToast/>
      <RowTable />
    </div>
  );
}
