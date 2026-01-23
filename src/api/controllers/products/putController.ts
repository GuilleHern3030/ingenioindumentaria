import { email, language, axios, devConsole } from '@/api'

import { product } from '@/api/models/Product'
import { image } from '@/api/models/Image'

const endpoint = "/products";

/**
 * Edit a Product from DataBase
 */
export default async function(
    product:product, 
    images?:image[], 
    slugs?:string[], 
    variants?:any[]) 
    {

    devConsole("%cPRODUCT PUT", "color:blue; background:pink; padding:4px; border:1px solid blue;")
    devConsole("product:", product)
    devConsole("images:", images)
    devConsole("slugs:", slugs)
    devConsole("variants:", variants)

    const { data } = await axios.put(
        endpoint, 
        { 
            product,
            images,
            slugs,
            variants
        }, 
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole("%cPRODUCT PUT RESPONSE", "color:blue; background:green; padding:4px; border:1px solid blue;", data)
    
    return data;
}