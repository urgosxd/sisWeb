import { AuthWrapper,AuthData } from "../../provider/authProvider"
import { AuthProviderType } from "../../@types/authTypes"
import React from "react"

import { useNavigate } from "react-router-dom";



export const Login = () => {
    const {user,login} = AuthData() as AuthProviderType
  //   if(user.isAuthenticated){
  //     const ga = useNavigate()
  //   ga("/")
  // }
    return (
            <form onSubmit={login}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
          )
}



