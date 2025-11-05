import { useNavigate } from 'react-router-dom'
import styles from './Account.module.css'
import useUsers from '../../../../hooks/useUser'
import Item from '../Item/Item'

import adminIcon from '../../../../assets/icons/config.webp'

export default ({hideFunction}) => {

    const { name, email, isAdmin } = useUsers()
    const navigate = useNavigate()

    return <>
        <ul className={`${styles.data} ${styles.ul}`}>
            <p className={styles.name}>{name}</p>
            <p className={styles.email}>{email}</p>
        </ul>
        <hr style={{margin:'.5em 0'}}/>
        <ul className={`${styles.ul}`}>
        </ul>

        { isAdmin && <>
                <hr style={{margin:'.5em 0'}}/>
                <Item icon={adminIcon} text={"Administración"} onClick={() => navigate("/admin")}/>
            </>
        }

    </>
}