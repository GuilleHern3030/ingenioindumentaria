import { email, language, axios, devConsole } from '@/api'

import { image } from '@/api/models/Image'
import product from '@/api/models/Product'

const endpoint = "/products";

/**
 * Creates a Product into DataBase
 */
export default async function(
    product:product, 
    images?:image[],
    slugs?:string[],
    variants?:any[]) 
    {

    try { delete product.id } catch(e) { }
    
    devConsole("%cPRODUCT POST", "color:blue; background:pink; padding:4px; border:1px solid blue;")
    devConsole("product:", product)
    devConsole("images:", images)
    devConsole("slugs:", slugs)
    devConsole("variants:", variants)

    const { data } = await axios.post(
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
    
    devConsole("%cPRODUCT POST RESPONSE", "color:blue; background:green; padding:4px; border:1px solid blue;", data)
    
    return data;
}