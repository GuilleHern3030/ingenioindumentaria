import styles from './Name.module.css'

import Star from '@/components/star/Star'

import { usersCanSignIn } from '@/api/config.json'

export default ({id, name, onFavouriteChange}) => {
    return <div className={styles.container}>
        <h2 className={styles.name}>{name}</h2>
        { usersCanSignIn && 
            <Star
                onChange={onFavouriteChange}
            />
        }
    </div>
}