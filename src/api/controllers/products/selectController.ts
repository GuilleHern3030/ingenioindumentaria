import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/products/product";

/**
 * Gets one Product from DataBase
 * @param {number} id Product id
 * @returns result of the request
 */
export default async function selectController(id:number, includeDisabled:boolean) {

    const queryParams = query.set({
        disabled: includeDisabled === true
    })

    const { data } = await axios.get(
        endpoint + "/" + id + queryParams, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`products.select(${id})${queryParams}`, data)
    
    return data;
}