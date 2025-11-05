import axios from '../axios.ts'
//import { getLocalToken, getAdminUser } from '../../../api'
import { email } from '../../../api'

const endpoint = "/images";

/**
 * Creates an image and put it into DataBase
 * @param {FormData} image FormData of an image
 * @returns result of the request
 */
export const postImage = async(image:FormData) => {

//    for (const pair of image.entries()) {
//  console.log(pair[0], pair[1]);
//}

    const { data } = await axios.post(
        endpoint,
        image, 
        { 
            headers: { 
                "Content-Type": "multipart/form-data",
                //token: getLocalToken(), 
                user: email() 
            } 
        }
    )
    
    return data;
}

export default postImage