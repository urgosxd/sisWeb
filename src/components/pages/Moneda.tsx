
import { Input } from "@material-tailwind/react";
import { AuthProviderType } from "../../@types/authTypes";
import { AuthData } from "../../provider/authProvider";
export const Moneda = () => {
        const {currencyRate,setCurrencyRate} = AuthData() as AuthProviderType
     return (
          <div className="page">
      Taza de Cambio de sol a dolar <a href={"https://www.google.com/search?q=dolar+sol&rlz=1C1VDKB_esPE1060PE1060&oq=dolar&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIXCAEQRRg5GEMYgwEYsQMYyQMYgAQYigUyDAgCEAAYQxiABBiKBTIMCAMQABhDGIAEGIoFMg0IBBAAGJIDGIAEGIoFMg0IBRAAGJIDGIAEGIoFMgwIBhAAGEMYgAQYigUyBggHEEUYPdIBCDExNDRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8"} target="_blank"> ir a google </a> <Input defaultValue={currencyRate} onChange={(e)=>setCurrencyRate(Number(e.target.value))}/>
          </div>
     )
}
