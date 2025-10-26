import { useEffect } from 'react';
import { useSelector } from 'react-redux'

import { getGenders } from '../../../../redux/reducers/index/IndexSelector'

import useArticleFilter from '../../../../hooks/useArticleFilter';

import Categories from './categories/Categories';

export default () => {

    const { genderSelected, setGenderSelected, gendersToShow, setGendersToShow } = useArticleFilter()
    const genders = useSelector(getGenders())

    useEffect(() => { 
        if (genders.length === 1)
            setGenderSelected(genders[0])
        setGendersToShow(genders) 
    }, [])

    if (!gendersToShow || !Array.isArray(gendersToShow)) 
        return null

    //return gendersToShow && gendersToShow.length == 1 ? <Categories/> : <>
    return <>
        {
            gendersToShow.map((gender, key) => genderSelected != gender ?
                <li key={key} onClick={() => setGenderSelected(gender)}>{gender}</li> :
                <div key={key}>
                    { (genders.length > 1) ? <li style={{color:'blue'}} onClick={() => setGenderSelected(undefined)}>{gender}</li> : <></> }
                    <Categories/>
                </div>
            ) 
        }
    </>

}