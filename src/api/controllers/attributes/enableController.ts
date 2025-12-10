import { email, language, axios, devConsole } from '@/api'

const endpoint = "/attributes/enable";

/**
 * Enables a Attribute from DataBase
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

    devConsole(`attributes.enable(${id})`, data)
    
    return data;
}