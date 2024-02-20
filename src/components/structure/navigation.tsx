import { About } from "../pages/About"
import { Account } from "../pages/Account"
import { Tour } from "../pages/Tour"
import { Login } from "../pages/Login"
import { Private } from "../pages/Private"
import { Moneda } from "../pages/Moneda"
import { Hotel } from "../pages/Hotel"

export const nav = [
     // { path:     "/cambio",         name: "cambio",        element: <Moneda />,       isMenu: true,     isPrivate: false  },
     { path:     "/tour",         name: "Tour",        element: <Tour />,       isMenu: true,     isPrivate: false  },
     { path:     "/hotel",         name: "Hotel",        element: <Hotel />,       isMenu: true,     isPrivate: false  },
     { path:     "/about",    name: "About",       element: <About />,      isMenu: true,     isPrivate: false  },
     { path:     "/login",    name: "Login",       element: <Login />,      isMenu: false,    isPrivate: false  },
     { path:     "/private",  name: "Private",     element: <Private />,    isMenu: true,     isPrivate: true  },
     { path:     "/account",  name: "Account",     element: <Account />,    isMenu: true,     isPrivate: true  },
]
