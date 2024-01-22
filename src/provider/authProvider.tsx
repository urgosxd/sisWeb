import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthProviderType } from "../@types/authTypes";
import { Navigate, Outlet } from "react-router-dom";

const BASEURL = 'https://siswebbackend.pdsviajes.com/'

const AuthContext = createContext<AuthProviderType | null>(null);

export const AuthProvider:React.FC<{children:React.ReactNode}> = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!!) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!!).user.username : null)
    let [loading, setLoading] = useState(true)

    // const history = useHistory()

    let loginUser = async (e:any )=> {
        e.preventDefault()
        let response = await fetch(BASEURL + 'api/login/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(data.user.username)
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        // history.push('/login')
    }


    let updateToken = async ()=> {

        let response = await fetch(BASEURL+'api/tokken/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(data.user.username)
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {

        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
  return useContext(AuthContext);
};



