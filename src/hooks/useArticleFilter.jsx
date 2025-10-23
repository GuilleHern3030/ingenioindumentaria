import { useContext } from 'react'
import { ArticlesFilterContext } from '../context/ArticlesFilterContext'

export default () => {
    return useContext(ArticlesFilterContext)
}