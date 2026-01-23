import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'
import query from '@/utils/QueryUtils';

const endpoint = "/articles";

/**
 * Select articles from DataBase with specific filters and options
 */
export default async function getsController(ids:number[]) {

    if (!loadFromBackend || !lazyLoading)
        throw new Error('Backend is not allowed')

    const param = ids.join("-")
    const queryParams = query.set({ id: param })

    const { data } = await axios.get(
        endpoint + queryParams,
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.gets(ids:${ids})`, data)
    
    return data;
}