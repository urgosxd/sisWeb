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
        <Navbar className="max-w-full px-4 py-8 lg:px-8 bg-[#D20000] h-[120px]" >
            <div className="flex items-center justify-between text-white">
                <Typography
                    as="a"
                    href="#"
                    variant="h6"
                    className="mr-4 cursor-pointer py-1.5"
                >
                    <img  className="h-16 w-full object-cover object-center" src={"/src/assets/pdslogo.svg"} />
                    <Typography className={"font-roboto font-bold text-3xl"} children={"SISTEMA DE REGISTRO PDS VIAJES"} />
                </Typography>
                <NavList />
            </div>
        </Navbar>
    );
}
