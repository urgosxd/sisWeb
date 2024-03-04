import { createContext, useContext, useEffect, useState } from "react";
import {
    InitialRoute,
    RenderInfo,
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";

import { AuthProviderType } from "../@types/authTypes";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { NavigationDash } from "../components/structure/drawer";
import NotificationToast from "../components/compo/notification";

const BASEURL = `${import.meta.env.VITE_URL_BACK}/`

const AuthContext = createContext<null | AuthProviderType>(null);
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!!)
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? {
          name: JSON.parse(localStorage.getItem("authTokens")!!).user.username,
          role: JSON.parse(localStorage.getItem("authTokens")!!).user.role,
          isAuthenticated: true,
        }
      : { name: "", isAuthenticated: false, role: "" }
  );

  const [currencyRate,setCurrencyRate] = useState(1)

  // const history = useHistory()
  // const router = useNavigate()
  const navigate = useNavigate();

  const loginUser = async (e: any) => {
    e.preventDefault();
    const response = await fetch(BASEURL + "apiAuth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser({
        name: data.user.username,
        isAuthenticated: true,
        role: data.user.role,
      });
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/tour");
    } else {
      alert("Something went wrong!");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser({ ...user!, isAuthenticated: false });
    localStorage.removeItem("authTokens");
    navigate("/login");
    // router("/login")
    // history.push('/login')
  };

  const updateToken = async () => {
    const response = await fetch(BASEURL + "apiAuth/tokken/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser({
        name: data.user.name,
        isAuthenticated: true,
        role: data.user.role,
      });
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
  };

  const contextData = {
    user: user!,
    authTokens: authTokens,
    login: loginUser,
    logout: logoutUser,
    currencyRate:currencyRate,
    setCurrencyRate:setCurrencyRate
  };

  useEffect(() => {

    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      <>
        {/* <RenderInfo/> */}
        {/* <Tabs value="cambio" orientation="vertical"> */}
        {/*   <TabsHeader className="w-56"> */}
        {/*     <RenderMenu /> */}
        {/*   </TabsHeader> */}
        {/*   <TabsBody> */}
        {/*     <RenderRoutes /> */}
        {/*   </TabsBody> */}
        {/* </Tabs> */}

        {
          user.isAuthenticated ?
        <NavigationDash>
          <RenderRoutes/>
        </NavigationDash>
        : <InitialRoute/>
          
      }
      </>
    </AuthContext.Provider>
  );
};
