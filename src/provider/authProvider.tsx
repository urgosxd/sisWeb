import { createContext, useContext, useEffect, useState } from "react";
import {
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

const BASEURL = "http://127.0.0.1:8000/";

const AuthContext = createContext<null | AuthProviderType>(null);
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  let [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!!)
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? {
          name: JSON.parse(localStorage.getItem("authTokens")!!).user.username,
          role: JSON.parse(localStorage.getItem("authTokens")!!).user.role,
          isAuthenticated: true,
        }
      : { name: "", isAuthenticated: false, role: "" }
  );

  // const history = useHistory()
  // const router = useNavigate()
  const navigate = useNavigate();

  let loginUser = async (e: any) => {
    e.preventDefault();
    let response = await fetch(BASEURL + "apiAuth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser({
        name: data.user.username,
        isAuthenticated: true,
        role: data.user.role,
      });
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser({ ...user!!, isAuthenticated: false });
    localStorage.removeItem("authTokens");
    navigate("/login");
    // router("/login")
    // history.push('/login')
  };

  let updateToken = async () => {
    let response = await fetch(BASEURL + "apiAuth/tokken/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json();

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

  let contextData = {
    user: user!,
    authTokens: authTokens,
    login: loginUser,
    logout: logoutUser,
  };

  useEffect(() => {

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
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
        <Tabs value="home" orientation="vertical">
          <TabsHeader className="w-32">
            <RenderMenu />
          </TabsHeader>
          <TabsBody>
            <RenderRoutes />
          </TabsBody>
        </Tabs>
      </>
    </AuthContext.Provider>
  );
};
