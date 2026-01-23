import { useState, useEffect, useRef } from 'react'

import styles from './DeleteCategory.module.css'

import Loading from '@/components/loading/Loading'

import useUser from '@/hooks/useUser'

import { remove, disable } from '@/api/categories'
import { reload, request } from '@/api'

const OPTION_DISABLE = 'disable' // deshabilita pero no borra
const OPTION_DELETE = 'delete' // borra sólo la categoría y las hijas pasarán al nodo padre (o raíz)


export default ({category, onDelete, t}) => {

    const [ isShowed, setIsShowed ] = useState(false)
    const [ isShowingOptions, setIsShowingOptions ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ warning, setWarning ] = useState()

    const { setIsAdminSessionActive } = useUser()

    const checkbox = useRef()

    useEffect(() => { 
        setIsShowed(false) 
        setIsShowingOptions(false)
    }, [category])

    const showFirstMenu = () => {
        setIsShowingOptions(false)
        setIsShowed(true) 
    }

    const handleDelete = (option) => {
        const remover = option === OPTION_DELETE ? remove : disable
        request(setIsLoading, setWarning, remover, category.slug, checkbox.current.checked)
        .then(response => {
            reload()
        })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    return isLoading ? <Loading/> :

        !isShowed ? <div className='flex-center'>
            <button className={styles.button} onClick={() => showFirstMenu()}>{`${t('delete')} ${category.name}`}</button>
        </div> : 
        
        <div className={styles.deletes} onClick={() => setIsShowed(false)}>
            <div className={styles.form} onClick={e => e.stopPropagation()}>
                <p className={styles.title}>{category.name}</p>
                <p className={styles.subtitle}>{category.slug}</p>

                { !isShowingOptions ? <>
                    <p className={styles.subtitle}>{t('category_delete_question')}</p>
                    <button className={styles.button} onClick={() => setIsShowingOptions(true)}>{t('delete')}</button>
                    <button className={`${styles.button} ${styles.cancel}`} onClick={() => setIsShowed(false)}>{t('cancel')}</button>
                </> : <>
                    <p className={styles.subtitle}>{t('category_delete_method_question')}</p>
                    <button className={`${styles.button} ${styles.cancel}`} onClick={() => setIsShowed(false)}>{t('cancel')}</button>
                    { !category.disabled && <button onClick={() => handleDelete(OPTION_DISABLE)} className={`${styles.button} ${styles.option}`}>{t('disable')}</button> }
                    <button onClick={() => handleDelete(OPTION_DELETE)} className={`${styles.button} ${styles.option}`}>{t('delete_force')}</button>
                    <div className='flex-center'>
                        <input ref={checkbox} style={{marginRight: '.5rem'}} type='checkbox'/>
                        <p>{t('category_apply_to_subcategories')}</p>
                    </div>
                </>
                }

                <p className={styles.warning}>{warning}</p>
            </div>
        </div>

}