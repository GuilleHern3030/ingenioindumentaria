import { useParams, useNavigate } from 'react-router-dom'

import useDataBase from '@/hooks/useDataBase'

import ID from '@/utils/IdUtils'

import Layout from '../layouts/articles/Articles'

export default () => {

    const { searchArticles } = useDataBase()

    const { "*": prompt } = useParams() // obtiene todo el param
    const navigate = useNavigate()
    const base = window.location.pathname.split('/')[1]

    const handleError = () => {
        //navigate("/articles")
    }

    const handleNetworkError = () => {
        console.error("Network error")
    }

    const handleSelect = (id, variantId, queryParams, from) => {
        navigate("/article/" + ID.serialize(id, variantId) + queryParams, {
            state: { from }
        })
    }

    const handleShowOtherArticles = () => {
        navigate("/articles")
    }

    return <Layout
        onLoadRequest={searchArticles}
        //onAttributesRequest={getAttributes}
        onSelect={handleSelect}
        onEmptySelect={handleShowOtherArticles}
        onError={handleError}
        onNetworkError={handleNetworkError}
        params={prompt}
        parent={base}
    />
}