import { useEffect } from 'react';
import { useSelector } from 'react-redux'

import { getMost } from '../../../../redux/reducers/index/IndexSelector'

export default ({hide}) => {

    const categories = useSelector(getMost())

    return categories.map((category, index) => <li key={index} onClick={hide}>
        {category}
    </li>)

}