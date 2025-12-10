import { email, language, axios } from '@/api'

const endpoint = "/messages";

/**
 * Deletes all messages from DataBase
 * @returns result of the request
 */
export const deleteMessages = async() => {

    const { data } = await axios.delete(
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

export default deleteMessages