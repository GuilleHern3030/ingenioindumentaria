import { email, language, axios } from '@/api'

const endpoint = "/messages";

export const getMessages = async() => {
    
    const { data } = await axios.get(
        endpoint, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language 
            } 
        }
    )

    return data;
}

export default getMessages;