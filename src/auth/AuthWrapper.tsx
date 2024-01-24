import { createContext, useContext, useEffect, useState } from "react"
import { RenderMenu, RenderRoutes } from "../components/structure/RenderNavigation";
import { AuthProviderType } from "../@types/authTypes";
import { useNavigate } from "react-router-dom";

const BASEURL = 'https://siswebbackend.pdsviajes.com/'

const AuthContext = createContext<null | AuthProviderType>(null) ;
export const AuthData = () => useContext(AuthContext);


export const AuthWrapper = () => {
  
 let [authTokens, setAuthTokens] = useState(localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!!) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? {name:JSON.parse(localStorage.getItem('authTokens')!!).user.username,isAuthenticated:true} : {name:"",isAuthenticated:false})
    let [loading, setLoading] = useState(true)

    // const history = useHistory()
      // const router = useNavigate()

    let loginUser = async (e:any )=> {
        e.preventDefault()
        let response = await fetch(BASEURL + 'apiAuth/login/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser({name:data.user.username,isAuthenticated:true})
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser({...user!!,isAuthenticated:false})
        localStorage.removeItem('authTokens')
        // router("/login")
        // history.push('/login')
    }


    let updateToken = async ()=> {

        let response = await fetch(BASEURL+'apiAuth/tokken/refresh/', {
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
        user:user!,
        authTokens:authTokens,
        login:loginUser,
        logout:logoutUser,
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


     return (
          
               <AuthContext.Provider value={contextData}>
                    <>
                         <RenderMenu />
                         <RenderRoutes />
                    </>
               </AuthContext.Provider>
          
     )

}
