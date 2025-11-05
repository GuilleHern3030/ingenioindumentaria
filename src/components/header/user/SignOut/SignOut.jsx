import { useState } from 'react'
import styles from './SignOut.module.css'
import icon from '../../../../assets/icons/session-out.webp'
import useUsers from '../../../../hooks/useUser'
import Dialog from '../../../dialog/Dialog'
import Item from '../Item/Item'
import { reload } from '../../../../api'

export default () => {

    const [ isClosing, setIsClosing ] = useState(false)

    const { signOut } = useUsers()

    const handleCloseSession = () => {
        signOut()
        reload()
    }

    return isClosing === false ? 
        <Item 
            onClick={() => setIsClosing(true)} 
            icon={icon} 
            text={'Cerrar sesión'}
        />
    : <Dialog
        title={"¿Deseas cerrar tu sesión?"}
        message={"Podrás iniciar sesión más tarde"}
        onAccept={handleCloseSession}
        onReject={() => setIsClosing(false)}
    />

}