import { useEffect, useRef, useState } from 'react'

import styles from './CreateCategory.module.css'

import Loading from '@/components/loading/Loading'

import useUser from '@/hooks/useUser'

import StringUtils from '@/utils/StringUtils'

import { post } from '@/api/categories'
import { request } from '@/api'

export default ({parent, onCreate, t}) => {

    const [ isDisabled, setIsDisabled ] = useState(true)
    const [ isCreating, setIsCreating ] = useState(false)
    const [ isPosting, setIsPosting ] = useState(false)
    const [ warning, setWarning ] = useState("")

    const { setIsAdminSessionActive } = useUser()

    const input = useRef()

    useEffect(() => { 
        setIsCreating(false) 
        if (parent) setIsDisabled(!parent.isActive())
        else setIsDisabled(false)
    }, [parent])

    const handleCreate = () => {
        const categoryName = input.current.value.trim()
        const parentSlug = parent ? parent.slug() : undefined
        if (categoryName.length > 0) {
            if (!StringUtils.hasSpecialCharacter(categoryName)) {
                request(setIsPosting, setWarning, post, categoryName, parentSlug)
                .then(result => {
                    setIsCreating(false)
                    onCreate(result)
                })
                .catch(e => {
                    if(e.adminSessionExpired())
                        setIsAdminSessionActive(false)
                    console.error(e)
                })
            } else setWarning(t('category_invalid_name'))
        } else setWarning(t('category_create_no_name_error'))
    }

    return isDisabled === true ? <p className={styles.disabled}>{t('category_disabled')}</p> :
        !isCreating ? <div className='flex-center'>
        <button className={styles.button} onClick={() => setIsCreating(true)}>{parent ? t('category_create_subcategory') : t('create')}</button>
    </div> : !isPosting ? <div className={styles.form}>
        <p className={styles.title}>{t('category_category_name')}</p>
        <input ref={input} className={styles.input}/>
        <button className={styles.button} onClick={handleCreate}>{t('create')}</button>
        <p className={styles.warning}>{warning}</p>
    </div> : <Loading/>


}