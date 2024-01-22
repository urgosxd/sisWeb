import React from "react";
import useSWR from "swr";
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
const fetcher = (url:string) => fetch(url).then((res) => res.json());

export default function App() {
return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
