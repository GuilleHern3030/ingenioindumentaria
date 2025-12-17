import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'
import query from '@/utils/QueryUtils';

const endpoint = "/articles/most";

/**
 * Select articles from DataBase
 */
export default async function getRecentController(order:object=null, page:number=1, limit:number=18) {

    if (!loadFromBackend || !lazyLoading)
        return []
    
    const queryParams = query.set({
        page,
        limit
    })

    const { data } = await axios.put(
        endpoint + queryParams,
        {
            order
        },
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.most()`, data)
    
    return data;
}