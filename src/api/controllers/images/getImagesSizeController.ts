import { email, language, axios } from '@/api'

const endpoint = "/images/size";

/**
 * Gets images size of backend
 * @returns result of the request
 */
export const getImagesSize = async() => {

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

export default getImagesSize