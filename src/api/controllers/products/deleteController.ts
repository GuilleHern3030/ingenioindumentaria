import { email, language, axios, devConsole } from '@/api'

const endpoint = "/products/delete";

/**
 * Deletes a Product from DataBase
 * @param {number} id Product id
 * @returns result of the request
 */
export default async function(id:number) {

    const { data } = await axios.delete(
        endpoint + "/" + id, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`products.delete(${id})`, data)
    
    return data;
}