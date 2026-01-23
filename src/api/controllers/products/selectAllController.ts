import { email, language, axios, devConsole } from '@/api'

const endpoint = "/products/all";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
export const selectAllProducts = async() => {
    
    // Request
    const { data } = await axios.get(endpoint,
      {
        headers: {
          user: email(),
          lang: language
        }
      }
    )
    
    devConsole(`products.selectAll()`, data)

    return data;
}

export default selectAllProducts