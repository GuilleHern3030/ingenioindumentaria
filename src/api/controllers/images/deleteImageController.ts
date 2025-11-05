import axios from '../axios.ts'
//import { getLocalToken, getAdminUser } from '../../../api'
import { email } from '../../../api'

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
                //token: getLocalToken(), 
                user: email() 
            } 
        }
    )
    return data;
}

export default deleteImage