import { email, language, axios, devConsole } from '@/api'

const endpoint = "/attributes";

/**
 * Gets one Attribute from DataBase
 * @param {number} id Attribute id
 * @returns result of the request
 */
export default async function selectController(id:number) {

    const { data } = await axios.get(
        endpoint + "/" + id, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )

    devConsole(`attributes.select(${id})`, data)
    
    return data;
}