import { createContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import user, { authenticate } from "../api/users.ts";
import { adminSignTime } from "../api/config.json"

export const UserContext = createContext();

export function UserContextProvider(props) {
    
    const [ email, setEmail ] = useState(user.email())
    useEffect( () => { user.setEmail(email) }, [email])

    const [ picture, setPicture ] = useState(user.picture())
    useEffect( () => { user.setPicture(picture) }, [picture])

    const [ name, setName ] = useState(user.name())
    useEffect( () => { user.setName(name) }, [name])

    const [ lastSession, setLastSession ] = useState(user.lastSession())
    useEffect( () => { user.setLastSession(lastSession) }, [lastSession])

    const [ isAdmin, setIsAdmin ] = useState(user.isAdmin())
    useEffect( () => { user.setAdmin(isAdmin) }, [isAdmin])

    const [ isAuthenticating, setIsAuthenticating ] = useState(false)

    const signOut = () => {
        setEmail(undefined)
        setPicture(undefined)
        setName(undefined)
        setLastSession(undefined)
        setIsAdmin(undefined)
    }

    const signIn = async(data) => new Promise((resolve, reject) => {
        setIsAuthenticating(true)
        authenticate(data)
        .then(result => {
            setName(result.name)
            setPicture(result.picture)
            setEmail(result.username) // email
            setLastSession(result.last_session)
            setIsAdmin(result.is_admin)
            setIsAuthenticating(false)
            resolve(result)
        })
        .catch(e => {
            setIsAuthenticating(false)
            reject(e)
        })
    })

    const isSignedIn = () => email != undefined

    const isAdminSessionActive = () => isAdmin === true && lessThan(lastSession)

    const CLIENT_ID = "164682043545-n2p5pgj7u4rf53iiajr8tu37t8jqkh0j.apps.googleusercontent.com"

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <UserContext.Provider value={{
                email, setEmail,
                picture, setPicture,
                name, setName,
                isAdmin, setIsAdmin,
                isAdminSessionActive,
                lastSession, setLastSession,
                isAuthenticating, setIsAuthenticating,
                isSignedIn,
                signOut, signIn
            }}>
                {props.children}
            </UserContext.Provider>
        </GoogleOAuthProvider>
    )
}

export const lessThan = (timeStamp) => {
    if (timeStamp != null) try {
        const now = new Date()
        const saved = new Date(timeStamp)
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < adminSignTime
    } catch (e) { }
    return false
}