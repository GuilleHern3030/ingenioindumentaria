import { email, language, axios, devConsole } from '@/api'
import { loadFromBackend, lazyLoading } from '@/api/config.json'
import query from '@/utils/QueryUtils';

const endpoint = "/articles";

/**
 * Select articles from DataBase with specific filters and options
 */
export default async function selectController(slug:string, include_children:boolean, filters:object, order:object, page:number=1, limit:number=18) {

    if (!loadFromBackend || !lazyLoading)
        throw new Error('Backend is not allowed')

    const queryParams = query.set({
        children: include_children === true,
        slug: slug ?? '',
        page,
        limit
    })

    const { data } = await axios.put(
        endpoint + queryParams,
        {
            filters,
            order
        },
        { 
            headers: { 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`articles.select(slug:${slug})`, data)
    
    return data;
}