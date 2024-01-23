import { AuthData } from "../../auth/AuthWrapper"
import { AuthProviderType } from "../../@types/authTypes"




export const Login = () => {
    let {login} = AuthData() as AuthProviderType
    return (
        <div>
            <form onSubmit={login}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}



