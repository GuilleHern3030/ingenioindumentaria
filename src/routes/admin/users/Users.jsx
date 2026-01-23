import { useState } from 'react'

import styles from './Users.module.css'

import useUser from '@/hooks/useUser'
import { useRouteI18n } from '@/hooks/useRouteI18N'
import Input from '../components/input/Input'

export default () => {

    const { email, hasPermission } = useUser()
    const { t, ready } = useRouteI18n()

    const [ user, setUser ] = useState()

    const handleSearch = (user) => {
        if (user) {

        } 
    }

    return <>

        <section className={styles.user}>
            <div className={styles.box}>
                <Input label={t('user')} className={styles.input}/>
                <button onClick={handleSearch}>{t('search')}</button>
            </div>
        </section>
    
    </>

}