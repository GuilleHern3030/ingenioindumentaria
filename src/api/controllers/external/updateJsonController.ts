import { email, language, axios } from '@/api'

const endpoint = "/external/json/update";

export const updateJson = async() => {
    
    const { data } = await axios.get(
        endpoint, 
        { 
            headers: { 
                user: email(),
                lang: language 
            } 
        } 
    )
    
    return data;
}

export default updateJson;