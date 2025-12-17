import { createContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import user, { authenticate } from "@/api/users.ts";
import { adminSignTime } from "@/api/config.json"

export const UserContext = createContext();

export function UserContextProvider(props) {

    const [ email, setEmail ] = useState(user.email())
    useEffect( () => { 
        user.setEmail(email)
        setIsSignedIn(email != undefined)
    }, [email])

    const [ picture, setPicture ] = useState(user.picture())
    useEffect( () => { user.setPicture(picture) }, [picture])

    const [ name, setName ] = useState(user.name())
    useEffect( () => { user.setName(name) }, [name])

    const [ lastSession, setLastSession ] = useState(user.lastSession())
    useEffect( () => { user.setLastSession(lastSession) }, [lastSession])

    const [ isAdmin, setAdmin ] = useState(user.admin())
    useEffect( () => { user.setAdmin(isAdmin) }, [isAdmin])

    const signOut = () => {
        setEmail(undefined)
        setPicture(undefined)
        setName(undefined)
        setLastSession(undefined)
        setIsSignedIn(false)
        setAdmin(false)
    }

    const [ isSigningIn, setIsSigningIn ] = useState(false)
    const signIn = async(data) => new Promise((resolve, reject) => {
        setIsSigningIn(true)
        authenticate(data)
        .then(result => {
            setName(result.name)
            setPicture(result.picture)
            setEmail(result.username) // email
            setLastSession(result.last_session)
            setAdmin(result.is_admin)
            setIsSigningIn(false)
            resolve(result)
        })
        .catch(e => {
            setIsSigningIn(false)
            reject(e)
        })
    })

    const [ isAdminSessionActive, setIsAdminSessionActive ] = useState(isAdmin != false && lessThan(lastSession))
    const verifyIsAdminSessionActive = () => {
        const isActive = isAdmin != false && isAdminSessionActive === true && lessThan(lastSession)
        setIsAdminSessionActive(isActive)
        return isActive
    }

    const [ isSignedIn, setIsSignedIn ] = useState(user.email() != null)

    const CLIENT_ID = "164682043545-n2p5pgj7u4rf53iiajr8tu37t8jqkh0j.apps.googleusercontent.com"

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <UserContext.Provider value={{
                email, setEmail,
                picture, setPicture,
                name, setName,
                isAdmin, setAdmin,
                verifyIsAdminSessionActive, 
                isAdminSessionActive, setIsAdminSessionActive,
                isSigningIn, setIsSigningIn,
                lastSession, setLastSession,
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