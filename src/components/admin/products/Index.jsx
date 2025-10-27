import { useState, useEffect, useRef } from 'react'

import useArticleFilter from '../../../hooks/useArticleFilter'

import './Index.css'

import useIndexedDB from "../../../hooks/useIndexedDB"
import Loading from "../../loading/Loading"
import Categories from './categories/Categories'

const showGenders = (genders, genderSelected, setGenderSelected) => {
    const array = []
    for (let gender in genders) 
        array.push(
            <p 
                key={array.length + 1} 
                id={genders[gender]}
                className={genderSelected == genders[gender] ? 'selected' : 'option'} 
                onClick={() => setGenderSelected(prevGender => prevGender == genders[gender] ? undefined : genders[gender])}
            >
                {gender}
            </p>
        )
    return array
}

export default () => {

    const { genderSelected, gendersToShow, setGenderSelected, setCategorySelected, setGendersToShow } = useArticleFilter()
    
    const { isLoading, database } = useIndexedDB()

    const [ isCreating, setIsCreating ] = useState(false)
    
    const initialized = useRef(false)

    const createGender = (gender) => {
        database.putGender(gender)
        .then(() => database.selectGenders()
        .then(genders => {
                setGendersToShow(genders)
                console.log("Genders: ", genders)
        })
    )}
    
    useEffect( () => {
        if (initialized.current) return; // evita múltiples ejecuciones
        initialized.current = true;

        //database.pull().then(() => {
            database.selectGenders()
            .then(genders => {
                setGendersToShow(genders)
            })
        //})
    }, []);

    useEffect(() => {
        setIsCreating(false)
        setCategorySelected(undefined)
    }, [genderSelected])

    return <> 

        { isLoading !== false ? <Loading/> : 
            gendersToShow ? 
            <div className={'options'}>
                {
                    showGenders(gendersToShow, genderSelected, setGenderSelected)
                }
            </div>
            : <></>
        }
        
        { isLoading !== false ? <></> :

            isCreating === true ? <div className='creating-div center'>
                <p>Seleccione un género</p>
                { gendersToShow['Hombre'] == undefined ? <p className='gender-option create-button' onClick={() => createGender('M')}>Hombre</p> : <></> }
                { gendersToShow['Mujer'] == undefined ? <p className='gender-option create-button' onClick={() => createGender('F')}>Mujer</p> : <></> }
                { gendersToShow['Niño'] == undefined ? <p className='gender-option create-button' onClick={() => createGender('B')}>Niño</p> : <></> }
                { gendersToShow['Niña'] == undefined ? <p className='gender-option create-button' onClick={() => createGender('G')}>Niña</p> : <></> }
                { gendersToShow['Bebé'] == undefined ? <p className='gender-option create-button' onClick={() => createGender('Y')}>Bebé</p> : <></> }
            </div>

            :

            genderSelected ? 

                <Categories/> 

                : 

                <div className='emptylist center'>
                    <p className='instruction'>Seleccione un género o añada uno</p>
                    <button className='create-button' onClick={() => setIsCreating(true)}>AÑADIR GÉNERO</button>
                </div>
        }


    </>

}