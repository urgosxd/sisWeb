import { Link, Route, Routes } from "react-router-dom";
import { AuthWrapper, AuthData } from "../../provider/authProvider";
import { nav } from "./navigation";
import { AuthProviderType } from "../../@types/authTypes";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
} from "@material-tailwind/react";
import {UserCircleIcon} from '@heroicons/react/24/outline'
import Home from "../pages/Initial";
import { Login } from "../pages/Login"

export const RenderInfo = () => {
  const { user } = AuthData() as AuthProviderType;
  return (
      <div className={"flex flex-row w-1/6 justify-center items-center"}>
          <p className="text-white text-xl">{user.name}</p>
          <UserCircleIcon className="w-[32px]  mr-8 inline-block text-white "/>
          <Typography className={"text-xl"} color="white">
            {user.role}
          </Typography>
      </div>
  );
};
export const InitialRoute =() =>{

  return(
  <Routes>
    <Route key="ini" path="/" element={<Home/>}/>
    <Route key="log" path="/login" element={<Login/>}/>
  </Routes>
  )

}
export const RenderRoutes = () => {
  const { user } = AuthData() as AuthProviderType;
  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};
export const RenderMenu = () => {
  const { user, logout } = AuthData() as AuthProviderType;

  const MenuItem = ({ value, path, name }) => {
    return (
      <Tab  key={value} value={value} className="px-0 h-16 text-2xl">
       <Link  className="w-full" to={path}>
       {name}
       </Link>
      </Tab>
    );
  };
  return (
    <>

        {nav.map((r, i) => {
          if (user.isAuthenticated && r.isMenu) {
            return (
              <MenuItem
                value={r.name.toLowerCase()}
                path={r.path}
                name={r.name}
              />
            );
          } else return false;
        })}
      </>
  );
};
export const RenderLogout = () => {
  const { user,logout } = AuthData() as AuthProviderType;
  return (
      <button onClick={()=>logout()}>Logout</button>
  );
};