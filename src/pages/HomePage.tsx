import React, {useState, useEffect, useContext} from 'react'
import { useAuth } from '../provider/authProvider'
import { AuthProviderType } from '../@types/authTypes'

const HomePage = () => {
    let {authTokens, logoutUser} = useAuth() as AuthProviderType

    // useEffect(()=> {
    //     getNotes()
    // }, [])


        return (
        <div>
            <p>You are logged to the home page!</p>


            <ul>
            </ul>
        </div>
    )
}

export default HomePage
