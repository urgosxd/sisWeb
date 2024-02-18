export type AuthProviderType = {

    user: {name:string,isAuthenticated:boolean,role:string}
  authTokens: any
    login:(e)=>Promise<void>
    logout:()=>void

}
