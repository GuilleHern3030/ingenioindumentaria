import { useEffect, useState } from 'react'
import { enable } from '@/api/categories'
import { reload, request } from '@/api'
import styles from './EnableCategory.module.css'
import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'
import useUser from "@/hooks/useUser";

export default ({category, t}) => {

    const [ dialogShowed, setDialogShowed ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ warning, setWarning ] = useState(undefined)

    const { setIsAdminSessionActive } = useUser()

    useEffect(() => { 
        setDialogShowed(false) 
    }, [category])

    const handleEnable = () => {
        setDialogShowed(false)
        request(setIsLoading, setWarning, enable, category.slug())
        .then(() => { reload() })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    return <>
        {
            dialogShowed && <Dialog 
                title={category.name()}
                message={t('category_enable_question')}
                onAccept={handleEnable}
                onReject={() => setDialogShowed(false)}
            />
        }
        <div className='flex-center-column'>
            { isLoading == true ? <Loading/> : <>
                    <button className={styles.button} onClick={() => setDialogShowed(true)}>{`${t('reenable')} ${category.name()}`}</button>
                    <p className={styles.warning}>{warning}</p>
                </>
            }
        </div>
    </>


}