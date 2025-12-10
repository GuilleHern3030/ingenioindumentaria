import { email, language, axios, devConsole } from '@/api'

const endpoint = "/attributes";

/**
 * Creates a Product into DataBase
 * @param {Record<String, any>} attribute product json
 * @param {string[]} slugs array of slugs
 * @returns result of the request
 */
export default async function(
    attribute:Record<string, any>, 
    slugs?:string[]) 
    {

    try { delete attribute.id } catch(e) { }

    const { data } = await axios.post(
        endpoint, 
        { 
            attribute,
            slugs
        }, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )

    devConsole(`attributes.post(${attribute}, ${slugs})`, data)
    
    return data;
}