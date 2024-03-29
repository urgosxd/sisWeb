import {
  Navbar,
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Radio,
} from "@material-tailwind/react";
import React, { useState } from "react";
// import { MiniNavbar } from "./miniNavBarDash";
import { UserIcon, PlayCircleIcon, ArrowDownTrayIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
// import { usePathname } from "next/navigation";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { RenderLogout } from "./RenderNavigation";
import { NavbarSimple } from "../compo/SimpleNavBar.tsx";
import { AuthData } from "../../provider/authProvider.tsx";
import { AuthProviderType } from "../../@types/authTypes";

// import Link from 'next/link'
const NamesNavbar2URL: { [key: string]: string } = {
  "Cambio": "/cambio",
  "TOURS": "/tours",
  "HOTELES": "/hoteles",
  "RESTAURANTES": "/restaurantes",
  "BOLETOS": "/boletos",
  "TRASLADOS": "/traslados",
  "TRENES": "/trenes",
  "TRANSPORTES": "/transportes",
  "UPSELLINGS": "/upsellings",
  "GUIADOS": "/guiados",
  "Account": "/account",
}

export function NavigationDash({ children }: { children: React.ReactNode }) {

  const { user, roleMode, setRoleMode } = AuthData() as AuthProviderType
  const [open, setOpen] = useState(true);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = () => {
    if (open == true) {
      closeDrawer()
    } else {
      openDrawer()
    }
  }

  // const currentPage = usePathnajme();
  const location = useLocation()
  const currentPage = location.pathname
  const currentSlug = (currentPage.split("/").slice(-1))
  console.log(currentPage)
  // console.log(currentSlug)
  const navNameICon = [
    { logo: <PlayCircleIcon className="w-5 text-white" />, name: "TOURS" },
    { logo: <BuildingOfficeIcon className="w-5 text-white" />, name: "HOTELES" },
    { logo: <ArrowDownTrayIcon className="w-5 text-white" />, name: "RESTAURANTES" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "BOLETOS" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "TRASLADOS" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "TRENES" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "TRANSPORTES" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "UPSELLINGS" },
    { logo: <CalendarIcon className="w-5 text-white" />, name: "GUIADOS" }]

  const navNames = navNameICon.map(ele => ele.name)
  const [idxNav, setIdxNav] = useState<number>(navNames.indexOf(currentSlug[0].toUpperCase()))


  const variants: Variants = {
    visible: (custom: number) => ({
      translateY: custom * 55
    })
  }


  const changeRoleMode =(e)=>{
      setRoleMode(e.target.value)
  }

  return (

    <div>
      <NavbarSimple />
      
      <div className="flex flex-row">
        <Drawer open={open} onClose={() => { }} overlay={false} className="top-22 static bg-black flex-col items-center justify-center">
          { user.role == "Administrator" &&
        <div className="z-10">
          <Radio name="rol" label="Operaciones" value="Operaciones" checked={roleMode == "Operaciones"} onChange={changeRoleMode} />
          <Radio name="rol" label="Ventas" value="Ventas" checked={roleMode == "Ventas"} onChange={changeRoleMode}/>
          <Radio name="rol" label="Admin" value="Administrator" checked={roleMode == "Administrator"} onChange={changeRoleMode}/>
        </div> 
      }


          <div className={"flex justify-center mt-3"}>
            <Typography color={"white"} className={"font-bold"} children={"PDS DASHBOARD"} />
          </div>

          {/* <div> */}
          {/*   <Radio name="type" label="HTML" /> */}
          {/*   <Radio name="type" label="React" defaultChecked /> */}
          {/* </div> */}

          <div className="flex flex-row">
            <motion.div custom={idxNav} animate="visible" variants={variants} className="h-7 w-2 bg bg-[#D20000] mt-4"></motion.div>
            <List>
              {navNameICon.map((ele, idx) => (
                <Link to={NamesNavbar2URL[ele.name]}>
                  <ListItem key={idx} onClick={() => setIdxNav(idx)} >
                    <ListItemPrefix >
                      {ele.logo}
                    </ListItemPrefix>
                    <Typography className={"font-roboto"} color={"white"}>
                      {ele.name}
                    </Typography>
                  </ListItem>
                </Link>
              ))}
            </List>

          </div>
          <div className={"w-full flex justify-center items-center"}>
            <RenderLogout />
          </div>
        </Drawer>
        {children}
      </div>

    </div>
  )
}




