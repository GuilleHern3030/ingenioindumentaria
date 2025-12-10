import { useState } from 'react'
import Login from '../login/Login'
import styles from './Revalidate.module.css'

export default ({onFinish, message}) => {

    const [ messageShowed, setMessageShowed ] = useState(message)

    const handleError = (e) => {
        setMessageShowed(e.toString())
    }

    return <div className={styles.revalidate} onClick={onFinish}>

            <Login 
                message={messageShowed}
                onSuccess={onFinish} 
                onError={handleError}
            />

    </div>
}