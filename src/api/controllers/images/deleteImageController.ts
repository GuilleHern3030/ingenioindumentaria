import axios from '../axios.ts'
import { getLocalToken, getLocalUser } from '../../../api'

const endpoint = "/images";

/**
 * Creates an image and put it into DataBase
 * @param {string} src src of the image
 * @returns result of the request
 */
export const deleteImage = async(src:string) => {
    const { data } = await axios.delete(
        endpoint + "/" + encodeURIComponent(src), 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getLocalUser() 
            } 
        }
    )
    return data;
}

export default deleteImage