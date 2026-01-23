import { language, axios } from '@/api'
const endpoint = "/users";

/**
 * Hay 2 variantes según se use GoogleLogin o useGoogleLogin
 *  - GoogleLogin: google contendrá 'credential', el cual es un string con el token brindado por google
 *  - useGoogleLogin: google contendrá 'code', el cual es un string con un código que el backend validará con google para obtener credential (token) por sí mismo
 * @param google Data to send to backend. It contains "credential" or "code"
 * @returns response from backend
 */
export const authenticate = async(google:Record<string, any>) => {

    const { data } = await axios.post(
        endpoint,
        google, // json que contiene "credential" o "code"
        { headers: { 
            "auth-method": "GOOGLE",
            lang: language 
        } }
    )

    return data
}

export default authenticate