import useSWR from "swr";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from "@material-tailwind/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function NotificationToast() {
  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    `${import.meta.env.VITE_URL_BACK}/apiCrud/notification/notification/`,
    fetcher   // fetcher
  );
  const prevData = useRef(undefined)

  const comp = <div className="flex flex-col"><Typography variant="h4">Ultima Accion</Typography> <Typography>{data && data.message}</Typography></div>
  useEffect(()=>{
    //   prevData.current = data
    // console.log("GIII");
    // console.log(prevData.current);
    //   if(!data){
    //   return
    // }else{
    //   if(prevData.current == null){
    //     console.log("GAA")
    //     return
    //   }else{
    //     console.log("GEE")
    //   notify()
    //   }
    // }
    if(!data){
      return
    }
    notify()

  },[data])

  const notify = () => toast(comp);
  return(
    <ToastContainer />
 ) 
}

export default NotificationToast
