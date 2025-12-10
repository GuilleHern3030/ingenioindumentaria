import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'

const endpoint = "/articles";

/**
 * Gets one article from DataBase
 * @param {number} id Product id
 * @returns result of the request
 */
export default async function getController(id:number) {

    if (!loadFromBackend || !lazyLoading)
        return undefined
    
    const { data } = await axios.get(
        endpoint + "/" + id, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.get(${id})`, data)
    
    return data;
}