import { email, language, axios, devConsole } from '@/api'

const endpoint = "/attributes/disable";

/**
 * Disables a Attribute from DataBase
 * @param {number} id Attribute id
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

    devConsole(`attributes.disable(${id})`, data)
    
    return data;
}