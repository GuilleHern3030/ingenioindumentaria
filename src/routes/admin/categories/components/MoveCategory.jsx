import { useEffect, useState } from 'react'

import styles from './MoveCategory.module.css'

import Loading from '@/components/loading/Loading'
import Dialog from '@/components/dialog/Dialog'

import useUser from '@/hooks/useUser'

import { move } from '@/api/categories'
import { reload, request } from '@/api'


/*function getParentSlug(slug) {
  const parts = slug.split('/');
  if (parts.length <= 1) return undefined; // es raíz
  parts.pop(); // eliminamos el último segmento
  return parts.join('/');
}*/

export default ({categorySelected, category, onSelect, t}) => {

    const [ dialogShowed, setDialogShowed ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ warning, setWarning ] = useState(undefined)

    const { setIsAdminSessionActive } = useUser()

    useEffect(() => { 
        setDialogShowed(false) 
    }, [category])

    const handleMove = (category, categorySelected) => {
        setDialogShowed(<Dialog
            title={t('category_move_question')}
            message={`'${categorySelected.slug()}' -> ${category?.slug() ?? 'index'}`}
            onAccept={() => confirmMove(category, categorySelected)}
            onReject={() => setDialogShowed(false)}
        />)
    }

    const confirmMove = (category, categorySelected) => {
        setDialogShowed(false)
        request(setIsLoading, setWarning, move, categorySelected, category)
        .then(response => { reload() })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }
    
    return <>
        <div className='flex-center-column'>
            { 
                isLoading == true ? <Loading/> : 
                categorySelected === undefined ? 
                    category && <button className={styles.button} onClick={() => onSelect(category)}>{`${t('move')} ${category.name()}`}</button> 
                :
                <>
                <div className='flex-center-column'>
                    <button className={styles.button} onClick={() => handleMove(category, categorySelected)}>{`${t('move')} ${categorySelected.name()} ${t('category_here')}`}</button>
                    <button className={styles.button} onClick={() => onSelect(undefined)}>{t('category_cancel_move')}</button>
                </div>
                <p className={styles.warning}>{warning}</p>
                </>
            }
        </div>
        {dialogShowed}
    </>


}