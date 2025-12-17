import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'
import query from '@/utils/QueryUtils';

const endpoint = "/articles/count";

/**
 * Select articles from DataBase with specific filters and options
 */
export default async function selectController(slug:string, include_children:boolean, filters:object) {

    if (!loadFromBackend || !lazyLoading)
        return null

    const queryParams = query.set({
        children: include_children === true,
        slug: slug ?? ''
    })

    const { data } = await axios.put(
        endpoint + queryParams,
        {
            filters
        },
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.count(slug:${slug})`, data)
    
    return data;
}