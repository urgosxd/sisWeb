import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import React,{ useState } from "react";
// import { MiniNavbar } from "./miniNavBarDash";
import {UserIcon,PlayCircleIcon,ArrowDownTrayIcon,CalendarIcon} from '@heroicons/react/24/outline'
// import { usePathname } from "next/navigation";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { RenderInfo, RenderLogout } from "./RenderNavigation";

// import Link from 'next/link'
const NamesNavbar2URL:{[key:string]:string} = {
  "Cambio":"/cambio",
  "Tours":"/tour",
  "Hoteles":"/hotel",
  "Restaurantes": "/restaurante",
  "Boletos": "/boleto",
  "Traslados": "/traslado",
  "Trenes": "/tren",
  "Transportes": "/transporte",
  "Upsellings": "/upselling",
  "Guiados": "/guiado",
  "Account": "/account",
}

export function NavigationDash({children}:{children:React.ReactNode}) {
  const [open, setOpen] = useState(true);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = ()=> {
    if (open == true){
      closeDrawer()
    }else{
      openDrawer()
    }
  }

  // const currentPage = usePathnajme();
  const location = useLocation()
  const currentPage = location.pathname
  const currentSlug = (currentPage.split("/").slice(-1))
  console.log(currentPage)
  // console.log(currentSlug)
  const navNameICon = [{logo:<PlayCircleIcon className="w-5"/>,name:"Tours"},{logo:<ArrowDownTrayIcon className="w-5"/>,name:"Hoteles"},{logo:<ArrowDownTrayIcon className="w-5"/>,name:"Restaurantes"},{logo:<CalendarIcon className="w-5"/>,name:"Boletos"},{logo:<CalendarIcon className="w-5"/>,name:"Traslados"},{logo:<CalendarIcon className="w-5"/>,name:"Trenes"},{logo:<CalendarIcon className="w-5"/>,name:"Transportes"},{logo:<CalendarIcon className="w-5"/>,name:"Upsellings"},{logo:<CalendarIcon className="w-5"/>,name:"Guiados"}]
  const navNames = navNameICon.map(ele=>ele.name)
  const [idxNav, setIdxNav] = useState<number>(navNames.indexOf(currentSlug[0])+1)
  
const variants: Variants = {
    visible: (custom: number) => ({
      translateY: custom * 47.5
    })
  }

 
  return (
    <div>
      {/* <MiniNavbar action={toggleDrawer}/> */}
      <div className="flex flex-row">
      <Drawer open={open} onClose={()=>{}} overlay={false} className="top-22 static">

        <RenderInfo/>
        <div className="flex flex-row">
        <motion.div  custom={idxNav} animate="visible" variants={variants} className="h-7 w-2 bg bg-[#D20000] mt-4"></motion.div>
        <List>
          {navNameICon.map((ele,idx)=>(

          <Link to={NamesNavbar2URL[ele.name]}>
             <ListItem key={idx} onClick={()=>setIdxNav(idx)} >
                <ListItemPrefix>
                  {ele.logo}
                </ListItemPrefix>
                  {ele.name}
            </ListItem>
            
              </Link>
          ))}
        </List>
          </div>
        <RenderLogout/>
      </Drawer>
        
      {children}
      </div>
    </div>
  );
}




