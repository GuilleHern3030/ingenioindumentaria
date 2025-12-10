import { Outlet } from 'react-router-dom'
import styles from './Attribute.module.css'
import { useLayoutEffect, useRef, useState } from 'react'

export default ({attribute, onAttributeSelected, t}) => {

    const [ height, setHeight ] = useState(0)
    const productRef = useRef()
    useLayoutEffect(() => { setHeight(productRef.current.clientHeight) }, [])

    return <article ref={productRef} id={attribute.id} className={styles.product}>
        { attribute.disabled === true && <div className={styles.disabled} onClick={() => onAttributeSelected(attribute)} style={{height:height}}><p>{t('disabled')}</p></div> }
        <div className={styles.productdata} onClick={() => onAttributeSelected(attribute)}>

            <div className={styles.object}>
                <p className={styles.key}>{`${t('name')}:`}</p>
                <p className={styles.value}>{attribute.name}</p>
            </div>

        </div>

    </article>
}