export { default as authenticate } from "./handlers/users/authenticateHandler";

const ADMIN = 'admin'
const PICTURE = 'picture'
const NAME = 'name'
const EMAIL = 'email'
const LAST_SESSION = 'last-session'

export const isAdmin = () => localStorage.getItem(ADMIN) != null
export const clearAdmin = () => setAdmin(false)
export const admin = () => localStorage.getItem(ADMIN) ?? false

const setAdmin = (role?:string|boolean) => 
    (typeof(role) === 'string' && role.length > 0 || role === true) ? 
        localStorage.setItem(ADMIN, role === true ? '*' : role) :
        localStorage.removeItem(ADMIN)

const name = () => localStorage.getItem(NAME)
const setName = (name?:string) => 
    name == undefined ? 
        localStorage.removeItem(NAME) : 
        localStorage.setItem(NAME, name)

const picture = () => localStorage.getItem(PICTURE)
const setPicture = (picture?:string) => 
    picture == undefined ? 
        localStorage.removeItem(PICTURE) : 
        localStorage.setItem(PICTURE, picture)

export const email = () => localStorage.getItem(EMAIL)
const setEmail = (email?:string) => 
    email == undefined ? 
        localStorage.removeItem(EMAIL) : 
        localStorage.setItem(EMAIL, email)

const lastSession = () => localStorage.getItem(LAST_SESSION)
const setLastSession = (lastSession?:string) => 
    lastSession == undefined ? 
        localStorage.removeItem(LAST_SESSION) : 
        localStorage.setItem(LAST_SESSION, lastSession)

export const clear = () => {
    setAdmin()
    setName()
    setPicture()
    setEmail()
    setLastSession()
}

export default {
    isAdmin, setAdmin, admin,
    picture, setPicture,
    lastSession, setLastSession,
    name, setName,
    email, setEmail
}