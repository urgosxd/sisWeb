import React, {useContext} from 'react'
import { useAuth } from '../provider/authProvider'
import { AuthProviderType } from '../@types/authTypes'

const LoginPage = () => {
    let {loginUser} = useAuth() as AuthProviderType
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type="text" name="username" placeholder="Enter Username" />
                <input type="password" name="password" placeholder="Enter Password" />
                <input type="submit"/>
            </form>
        </div>
    )
}

export default LoginPage
