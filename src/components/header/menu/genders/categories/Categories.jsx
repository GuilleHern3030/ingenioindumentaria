import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { getCategories } from '../../../../../redux/reducers/index/IndexSelector'

import useArticleFilter from '../../../../../hooks/useArticleFilter';

export default () => {

    const { genderSelected, categorySelected, setCategoriesToShow, categoriesToShow, hideFunction } = useArticleFilter()

    const categories = useSelector(getCategories(genderSelected))

    useEffect(() => { 
        setCategoriesToShow(categories) 
    }, [genderSelected, categorySelected])

    return !genderSelected ? <></> : <>

        {  !categoriesToShow ? <></> :
            categoriesToShow.map((category, key) => { 
                return <li key={key} className='category' >
                        <Link
                            to={`/category/${genderSelected}/${category}`}
                            onClick={hideFunction}
                        >{category}</Link>
                </li> 
            })
        }

    </>

}