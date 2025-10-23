import { useEffect } from 'react';
import { useSelector } from 'react-redux'

import { getCategories } from '../../../../../redux/reducers/index/IndexSelector'

import useArticleFilter from '../../../../../hooks/useArticleFilter';

export default () => {

    const { genderSelected, categorySelected, setCategoriesToShow, categoriesToShow } = useArticleFilter()

    const categories = useSelector(getCategories(genderSelected))

    useEffect(() => { 
        setCategoriesToShow(categories) 
    }, [genderSelected, categorySelected])

    return !genderSelected ? <></> : <>

        {  !categoriesToShow ? <></> :
            categoriesToShow.map((category, key) => { return <li key={key}>{category}</li> })
        }

    </>

}