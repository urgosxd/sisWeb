import { Route, redirect } from 'react-router-dom'
import { useContext } from 'react'

const PrivateRoute = ({children, ...rest}) => {
    let {user} = useAuth as AuthProviderType
    return(
        <Route {...rest}>{!user ? <Redirect to="/login" /> :   children}</Route>
    )
}

export default PrivateRoute;
