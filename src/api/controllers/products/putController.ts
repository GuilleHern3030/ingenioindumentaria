import { image } from '@/api/objects/Image'
import { email, language, axios, devConsole } from '@/api'

const endpoint = "/products";

/**
 * Edit a Product from DataBase
 * @param {Record<String, any>} product product json
 * @returns result of the request
 */
export default async function(product:Record<string, any>, images?:image[], slugs?:string[], attributes?:any[], variants?:any[]) {

    devConsole("products.put request:", product, images, slugs, attributes, variants)

    const { data } = await axios.put(
        endpoint, 
        { 
            product,
            images,
            slugs,
            attributes,
            variants
        }, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`products.put response:`, data)
    
    return data;
}