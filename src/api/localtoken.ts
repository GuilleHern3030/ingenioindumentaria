const KEY = 'tmp-token'
const USER = 'tmp-user'

export const getLocalToken = () => sessionStorage.getItem(KEY)
export const setLocalToken = (token:string) => sessionStorage.setItem(KEY, token != undefined ? token : "")
export const removeLocalToken = () => sessionStorage.removeItem(KEY)

export const getLocalUser = () => sessionStorage.getItem(USER)
export const setLocalUser = (user:string) => sessionStorage.setItem(USER, user != undefined ? user : "")
export const removeLocalUser = () => sessionStorage.removeItem(USER)