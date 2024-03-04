import useSWR from "swr";
import { ToastContainer, toast} from 'react-toastify';
import React, {useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Spinner, Typography} from "@material-tailwind/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json().catch(e=> {
  throw new Error(e)
}));

function NotificationToast() {

  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    `${import.meta.env.VITE_URL_BACK}/apiCrud/notification/notification/`,
    fetcher,
    {refreshInterval:1000}

  );

  // const Comp = <div className="flex flex-col"><Typography variant="h4" children={"Ultima Accion"} placeholder={"Ultima Accion"}/>
  //                                                         <Typography children={data && data.message} placeholder={"mensaje"}/></div>

  // const CompError = (error:string)=> <div className="flex flex-col"><Typography variant="h4" children={"Error"} placeholder={"Error"}/>
  //                                                                   <Typography children={error} placeholder={"error"}/></div>

  // const notify = (comp: React.JSX.Element) => toast(comp);
  const comp = <div className="flex flex-col"><Typography variant="h4">Ultima Accion</Typography> <Typography>{data && data.message}</Typography></div>

  useEffect(() => {

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


    // if(error){
    //   notify(CompError)
    // }
    // else {
    //   notify(Comp)
    // }

if(!data){
      return
    }
    notify()
  },[data])

 const notify = () => toast(comp);
  return(
      <>
       <ToastContainer />
      </>
 )
}
export default NotificationToast
