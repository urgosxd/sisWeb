export type AuthProviderType = {

    user: string | null;
    authTokens: any;
    loginUser:(e:any)=>Promise<void>
    logoutUser:()=>void

}
