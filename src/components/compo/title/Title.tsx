import React from "react";
import {Typography} from "@material-tailwind/react";

  const Title = ({title})=>{
    return(
        <Typography className={"w-full flex justify-center text-3xl mb-5 font-bold text-[#9AA0A6]"}>
            {title}
        </Typography>
    )
}

export  default Title