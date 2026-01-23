import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import styles from './UserMenu.module.css'

import useUser from '@/hooks/useUser'

import Cross from '@/components/icon/cross'
import Dialog from '@/components/dialog/Dialog'

export default ({ onHide, onShowSubmenu, onBack, onError, onAuth, t }) => {

    const navigate = useNavigate()

    const [ dialog, setDialog ] = useState(null)

    const { name, signOut } = useUser()

    const handleHide = () => {
        onHide()
        goTop()
    }

    const handleSignOut = () => {
        setDialog(
            <Dialog
                title={t('user:sign-out-dialog-title')}
                message={t('user:sign-out-dialog-message')}
                onReject={() => setDialog(null)}
                onAccept={() => {
                    setDialog(null)
                    signOut()
                    onAuth()
                }}
            />
        )
    }

    return <div className='menu__background' onClick={onHide}>
        <div className='header__background'></div>
        <div className='menu menu-right' onClick={e => e.stopPropagation()}>

            <div className={styles.title}>
                <p>{ name ?? t('user:user') }</p>
                <Cross className={styles.cross} onClick={onHide}/>
            </div>

            <hr />

            <ul className='menu__ul'>
                <li className={styles.li}><Link to='/user/profile' onClick={handleHide}>{t('user:my-profile')}</Link></li>
                <li className={styles.li}><Link to='/user/favourites' onClick={handleHide}>{t('user:my-favourites')}</Link></li>
                <li className={styles.li}><Link to='/user/buys' onClick={handleHide}>{t('user:my-buys')}</Link></li>
                <li className={styles.li}><Link to='/user/opinions' onClick={handleHide}>{t('user:my-opinions')}</Link></li>
            </ul>

            <hr />

            <p 
                className={`button_square_white ${styles.back}`}
                onClick={handleSignOut}>
                {t("user:sign-out")}
            </p>


        </div>

        { dialog }
        
    </div>
}