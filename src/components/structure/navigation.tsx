import { About } from "../pages/About"
import { Account } from "../pages/Account"
import { Tour } from "../pages/Tour"
import { Login } from "../pages/Login"
import { Private } from "../pages/Private"
import { Moneda } from "../pages/Moneda"
import { Hotel } from "../pages/Hotel"
import { Restaurante } from "../pages/Restaurante"
import { Boleto } from "../pages/Boleto"
import { Traslado } from "../pages/Traslado"
import { Tren } from "../pages/Tren"
import { Transporte } from "../pages/Transporte"
import { Upselling } from "../pages/Upselling"
import { Guiado } from "../pages/Guiado"

export const nav = [
     // { path:     "/cambio",         name: "cambio",        element: <Moneda />,       isMenu: true,     isPrivate: false  },
     { path:     "/tour",         name: "Tour",        element: <Tour />,       isMenu: true,     isPrivate: false  },
     { path:     "/hotel",         name: "Hotel",        element: <Hotel />,       isMenu: true,     isPrivate: false  },
     { path:     "/restaurante",    name: "Restaurante",       element: <Restaurante />,      isMenu: true,     isPrivate: false  },
     { path:     "/boleto",    name: "Boletos",       element: <Boleto />,      isMenu: true,     isPrivate: false  },
     { path:     "/traslado",    name: "Traslados",       element: <Traslado />,      isMenu: true,     isPrivate: false  },
     { path:     "/tren",    name: "Tren",       element: <Tren />,      isMenu: true,     isPrivate: false  },
     { path:     "/transporte",    name: "Transporte",       element: <Transporte />,      isMenu: true,     isPrivate: false  },
     { path:     "/upselling",    name: "Upselling",       element: <Upselling />,      isMenu: true,     isPrivate: false  },
     { path:     "/guiado",    name: "Guiado",       element: <Guiado />,      isMenu: true,     isPrivate: false  },
     { path:     "/login",    name: "Login",       element: <Login />,      isMenu: false,    isPrivate: false  },
     { path:     "/private",  name: "Private",     element: <Private />,    isMenu: true,     isPrivate: true  },
     { path:     "/account",  name: "Account",     element: <Account />,    isMenu: true,     isPrivate: true  },
]
