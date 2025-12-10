import { email, language, axios } from '@/api'

const endpoint = "/images/delete";

/**
 * Creates an image and put it into DataBase
 * @param {string|number} param src of the image or the id number
 * @returns result of the request
 */
export const deleteImage = async(param:string|number) => 
    (typeof(param) === 'string') ?
        deleteBySrc(param) :
        deleteById(param)

const deleteById = async(id:number) => {

    const { data } = await axios.delete(
        endpoint + `/${id}`, 
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

const deleteBySrc = async(src:string) => {

    const { data } = await axios.put(
        endpoint,
        { src }, 
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

export default deleteImage