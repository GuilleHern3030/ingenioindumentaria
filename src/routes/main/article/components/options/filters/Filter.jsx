import { useState, useEffect } from 'react'
import styles from './Filters.module.css'

import FilterSelector from './FilterSelector'

export default ({attribute, values, prevValue, availables, onChange, filters}) => {

    useEffect(() => { 
        setAttributeClicked(undefined) 
    }, [filters])

    const [ attributeClicked, setAttributeClicked ] = useState()
    const [ dialog, setDialog ] = useState()

    const handleShowDialog = (attribute) => {
        if (attributeClicked && attribute == attributeClicked) 
            setAttributeClicked(undefined)
        if (!attributeClicked) 
            setAttributeClicked(attribute)
    }

    const handleSelection = (attribute, value, available) => {
        setAttributeClicked(undefined)
        onChange(attribute, value, available)
    }

    useEffect(() => {
        if (attributeClicked)
            setDialog(
                <FilterSelector 
                    availables={availables}
                    values={values}
                    prevValue={prevValue}
                    onSelect={(value, available) => handleSelection(attribute, value, available)}
                    onCancel={() => setDialog(null)}
                />
            )
        else setDialog(undefined)
    }, [attributeClicked])

    return <>
        <div 
            className={styles.filter}
            onClick={() => handleShowDialog(attribute)}
        >
            <p>{attribute}</p>
            <div className={styles.menu}>
                <p>{prevValue??''}</p>
                <p className={attributeClicked ? styles.rotated : ''}><b>{'>'}</b></p>
            </div>
        </div>
        {dialog}
        <hr className={styles.hr}/>
    </>

}