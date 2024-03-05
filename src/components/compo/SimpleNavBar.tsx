import React from "react";
import {
    Navbar,
    Collapse,
    Typography,
    IconButton,
} from "@material-tailwind/react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {RenderInfo} from "../structure/RenderNavigation.tsx";

function NavList() {
    return (
            <RenderInfo />
    );
}

export function NavbarSimple() {
    const [openNav, setOpenNav] = React.useState(false);

    const handleWindowResize = () =>
        window.innerWidth >= 960 && setOpenNav(false);

    React.useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return (
        <Navbar className="max-w-full fixed z-20 lg:px-8 bg-[#D20000]  h-[150px]" >
            <div className="flex flex-row  items-center justify-between text-white">
                <div className={" w-40 h-[150px]"}>
                    <img className=" max-w-40 max-h-40" src={"/src/assets/logo-psd.svg"}/>
                </div>
                <Typography className={"font-roboto font-bold text-3xl self-center"} children={"SISTEMA DE REGISTRO PDS VIAJES"} />
                    <NavList />
            </div>
        </Navbar>
    );
}