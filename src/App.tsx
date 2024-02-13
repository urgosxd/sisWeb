import React from "react";
import useSWR from "swr";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./provider/authProvider";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthWrapper/>
      </BrowserRouter>      
    </div>
  );
}
