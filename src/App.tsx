import React from "react";
import useSWR from "swr";
import {AuthProvider} from "./provider/authProvider";
const fetcher = (url:string) => fetch(url).then((res) => res.json());
import PrivateRoute, { ProtectedRouteProps } from "./routes/privateRouter";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./auth/AuthWrapper";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthWrapper/>
      </BrowserRouter>      
    </div>
  );
}
