import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'
import query from '@/utils/QueryUtils';

const endpoint = "/articles";

/**
 * Select articles from DataBase
 */
export default async function getRecentController(start:number=0, limit:number=20) {

    if (!loadFromBackend || !lazyLoading)
        return []
    
    const queryParams = query.set({
        start,
        limit
    })

    const { data } = await axios.get(
        endpoint + queryParams,
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.recent()`, data)
    
    return data;
}