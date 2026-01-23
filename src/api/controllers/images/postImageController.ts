import { email, language, axios } from '@/api'

const endpoint = "/images";

/**
 * Creates an image and put it into DataBase
 * @param {FormData} image FormData of an image
 * @returns {Promise} { id, src, size } result of the request 
 */
export const postImage = async(image:FormData): Promise<Record<string, any>> => {

    const { data } = await axios.post(
        endpoint,
        image, 
        { 
            headers: { 
                "Content-Type": "multipart/form-data",
                //token: getLocalToken(), 
                user: email(),
                lang: language 
            } 
        }
    )
    
    return data;
}

export default postImage