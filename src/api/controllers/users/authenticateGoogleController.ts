import { language, axios } from '@/api'
const endpoint = "/users";

export const authenticate = async(credential:string) => {

    const { data } = await axios.post(
        endpoint,
        { credential },
        { headers: { 
            "auth-method": "GOOGLE",
            lang: language 
        } }
    )

    return data
}

export default authenticate