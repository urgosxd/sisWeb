export type AuthProviderType = {

    user: {name:string,isAuthenticated:boolean,role:string,id:number}
  authTokens: any
    login:(e)=>Promise<void>
    logout:()=>void
    currencyRate:number
    setCurrencyRate:React.Dispatch<React.SetStateAction<number>>


}
