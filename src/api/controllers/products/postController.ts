import { image } from '@/api/objects/Image'
import { email, language, axios, devConsole } from '@/api'

const endpoint = "/products";

/**
 * Creates a Product into DataBase
 * @param {Record<String, any>} product product json
 * @param {image[]} images array of processed images to put into product in DataBase
 * @returns result of the request
 */
export default async function(
    product:Record<string, any>, 
    images?:image[],
    slugs?:string[],
    attributes?:any[],
    variants?:any[]) 
    {

    try { delete product.id } catch(e) { }
    devConsole("products.post request:", product, images, slugs, attributes, variants)

    const { data } = await axios.post(
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
    
    devConsole(`products.post response:`, data)
    
    return data;
}