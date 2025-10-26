import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { getMost } from '../../../../redux/reducers/index/IndexSelector'
import useArticleFilter from '../../../../hooks/useArticleFilter';

export default () => {

    const categories = useSelector(getMost())
    const { hideFunction } = useArticleFilter()

    return categories.map((category, index) => 
        <li key={index}>
            <Link
                to={`/products/${category}`}
                onClick={hideFunction}>
                {category}
            </Link>
        </li>)

}