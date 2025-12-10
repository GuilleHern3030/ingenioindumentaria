import { language, axios } from '@/api'
const endpoint = "/users";

export const authenticate = async(username:string, password:string):Promise<Record<string,any>> => {
    
    const { data } = await axios.post(
        endpoint,
        { username, password },
        { headers: { 
            "auth-method": "FORM",
            lang: language 
        } }
    )

    return data
}

export default authenticate