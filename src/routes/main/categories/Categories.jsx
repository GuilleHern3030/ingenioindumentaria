import { useParams, useNavigate } from 'react-router-dom'

import useDataBase from '@/hooks/useDataBase'

import ID from '@/utils/IdUtils'

import Layout from '../layouts/articles/Articles'

export default () => {

    const { getArticles, getAttributes } = useDataBase()

    const { "*": slug } = useParams() // obtiene todo el param
    const navigate = useNavigate()
    const base = window.location.pathname.split('/')[1]

    const handleError = () => {
        console.error("Not found")
    }

    const handleNetworkError = () => {
        console.error("Network error")
    }

    const handleSelect = (id, variantId, queryParams, from) => {
        console.log(queryParams)
        navigate("/article/" + ID.serialize(id, variantId, slug) + queryParams, {
            state: { from }
        })
    }

    const handleShowOtherArticles = () => {
        navigate("/articles")
    }

    return <Layout
        onLoadRequest={getArticles}
        onAttributesRequest={getAttributes}
        onSelect={handleSelect}
        onEmptySelect={handleShowOtherArticles}
        onError={handleError}
        onNetworkError={handleNetworkError}
        params={slug}
        parent={base}
    />
}