import useSWR from "swr";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function NotificationToast() {
  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    "http://127.0.0.1:8000/apiCrud/notification/notification/",
    fetcher,{ refreshInterval: 10 }
    // fetcher
  );

  useEffect(()=>{
      if(!data) return
      notify()
  },[data])

  const notify = () => toast(data.message);
  return(
    <ToastContainer />
 ) 
}

export default NotificationToast
