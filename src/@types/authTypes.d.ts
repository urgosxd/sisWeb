export type AuthProviderType = {

    user: {
    name:string
    isAuthenticated:boolean
  };
    login:(e)=>Promise<void>
    logout:()=>void

}
