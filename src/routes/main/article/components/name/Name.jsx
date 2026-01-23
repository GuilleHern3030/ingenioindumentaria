import { useNavigate } from 'react-router-dom'

import styles from './Name.module.css'

import Star from '@/components/star/Star'

import { usersCanSignIn } from '@/api/config.json'
import { isAdmin } from '@/api'

export default ({ id, name, onFavouriteChange }) => {

    const navigate = useNavigate()

    const handleClick = () => {
        if (isAdmin())
            navigate("/admin/products/" + id)
    }

    return <div className={styles.container}>
        <h2 
            onClick={handleClick}
            className={`${styles.name} ${isAdmin() ? styles.selectable : ''}`}
            > { name }
        </h2>
        { usersCanSignIn && 
            <Star
                onChange={onFavouriteChange}
            />
        }
    </div>
}