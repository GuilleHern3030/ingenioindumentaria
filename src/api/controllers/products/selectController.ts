import { email, language, axios, devConsole } from '@/api'

const endpoint = "/products/product";

/**
 * Gets one Product from DataBase
 * @param {number|number[]} id Product id
 * @returns result of the request
 */
export default async function selectController(id:number|number[]) {

    const { data } = await axios.get(
        endpoint + "/" + id, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`products.select(${id})`, data)
    
    return data;
}