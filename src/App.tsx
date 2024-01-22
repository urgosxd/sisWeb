import React from "react";
import useSWR from "swr";
import {AuthProvider} from "./provider/authProvider";
import Routes from "./routes";
const fetcher = (url:string) => fetch(url).then((res) => res.json());
import { BrowserRouter as Router, Route } from 'react-router-dom'

export default function App() {
return (
    
    <Router>
    <AuthProvider>
        <div></div>
    </AuthProvider>

    </Router>
      );
}
