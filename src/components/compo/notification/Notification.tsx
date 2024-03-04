import useSWR from "swr";
import { ToastContainer, toast} from 'react-toastify';
import React, {useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Spinner, Typography} from "@material-tailwind/react";
import Toast from "./Toast.tsx";

const fetcher = (url: string) => fetch(url).then((res) => res.json().catch(e=> { throw new Error(e) }));

function NotificationToast() {

    const message = useSWR(
        // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
        `${import.meta.env.VITE_URL_BACK}/apiCrud/notification/notification/`,
        fetcher,
        {refreshInterval: 25}
    );

    return(
        <>
            <Toast message={message} />
        </>
    )
}
export default NotificationToast