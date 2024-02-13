export type AuthProviderType = {

    user: any
  authTokens: any
    login:(e)=>Promise<void>
    logout:()=>void

}
