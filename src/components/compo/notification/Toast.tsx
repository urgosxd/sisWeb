import React, {useEffect} from "react";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Spinner, Typography} from "@material-tailwind/react";

function Toast({message}){
    const toastMessage = ({data, error})=>{
        return(
            <div className="flex flex-col">
                <Typography variant="h4" children={"Ultima Accion"} placeholder={error?"Error":"Ultima Accion"}/>
                <Typography children={error?error:data.message} placeholder={"mensaje"}/>
            </div>
        )
    }

    useEffect(() => {
        toast(toastMessage(message))
    }, [message]);

    return(
        <>
            {message.isLoading && <Spinner/>}
            <ToastContainer />
        </>
    )
}
export default  Toast