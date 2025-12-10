import { email, language, axios } from '@/api'

const endpoint = "/users";

export const getToken = async(credentials:any) => {
    
    const { data } = await axios.post(
        endpoint, 
        credentials
    )

    return data.token;
}

export default getToken;