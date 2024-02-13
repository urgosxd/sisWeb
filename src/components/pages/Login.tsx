import { AuthWrapper,AuthData } from "../../provider/authProvider"
import { AuthProviderType } from "../../@types/authTypes"
import React from "react"




export const Login = () => {
    const {login} = AuthData() as AuthProviderType
    return (
            <form onSubmit={login}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
          )
}



