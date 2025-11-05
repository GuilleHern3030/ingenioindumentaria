export { default as authenticate } from "./handlers/users/authenticateHandler.ts";

const IS_ADMIN = 'is-admin'
const PICTURE = 'picture'
const NAME = 'name'
const EMAIL = 'email'
const LAST_SESSION = 'last-session'

export const isAdmin = () => localStorage.getItem(IS_ADMIN) != null
const setAdmin = (is?:boolean) => 
    is === true ? 
        localStorage.setItem(IS_ADMIN, "true") : 
        localStorage.removeItem(IS_ADMIN)

const name = () => localStorage.getItem(NAME)
const setName = (name:string|undefined) => 
    name == undefined ? 
        localStorage.removeItem(NAME) : 
        localStorage.setItem(NAME, name)

const picture = () => localStorage.getItem(PICTURE)
const setPicture = (picture:string|undefined) => 
    picture == undefined ? 
        localStorage.removeItem(PICTURE) : 
        localStorage.setItem(PICTURE, picture)

export const email = () => localStorage.getItem(EMAIL)
const setEmail = (email:string|undefined) => 
    email == undefined ? 
        localStorage.removeItem(EMAIL) : 
        localStorage.setItem(EMAIL, email)

const lastSession = () => localStorage.getItem(LAST_SESSION)
const setLastSession = (lastSession:string|undefined) => 
    lastSession == undefined ? 
        localStorage.removeItem(LAST_SESSION) : 
        localStorage.setItem(LAST_SESSION, lastSession)

export default {
    isAdmin, setAdmin,
    picture, setPicture,
    lastSession, setLastSession,
    name, setName,
    email, setEmail
}