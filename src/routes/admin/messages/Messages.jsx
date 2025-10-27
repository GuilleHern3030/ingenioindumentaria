import { useEffect, useState } from "react"
import { getMessages, deleteMessage } from "../../../api/messages"
import Loading from "../../../components/loading/Loading"
import Dialog from "../../../components/dialog/Dialog"

import styles from './Messages.module.css'
import deleteIcon from '../../../assets/icons/delete.webp'

const listMessages = (messages, remove) => 
    messages.map((message, index) => 
        <div key={index} className={styles.messagebox}>

            { message.name &&
                <div className={styles.box}>
                    <p className={styles.box_title}>Nombre</p>
                    <p className={styles.box_content}>{message.name}</p>
                </div>
            }

            { message.email &&
                <div className={styles.box}>
                    <p className={styles.box_title}>Email</p>
                    <p className={styles.box_content}>{message.email}</p>
                </div>
            }

            { message.phone &&
                <div className={styles.box}>
                    <p className={styles.box_title}>Telefono</p>
                    <p className={styles.box_content}>{message.phone}</p>
                </div>
            }

            { message.message &&
                <div className={styles.box}>
                    <p className={styles.box_title}>Mensaje</p>
                    <p className={styles.box_content}>{message.message}</p>
                </div>
            }

            <div 
                className={styles.box_button}
                onClick={() => remove(message.id)}>
                <img src={deleteIcon}/>
            </div>
            
        </div> 
)

export default () => {

    const [ isLoading, setIsLoading ] = useState()
    const [ messages, setMessages ] = useState([])
    const [ isDialog, setIsDialog ] = useState()

    const removeMessage = id => {
        setIsDialog(undefined)
        deleteMessage(Number(id)).then(() => {
            loadMessages()
        })
    }

    const loadMessages = () => {
        setIsLoading(true)
        getMessages()
        .then(messages => {
            setMessages(messages)
            setIsLoading(false)
        })
        .catch(e => {
            setMessages(undefined)
            setIsLoading(false)
        })
    }

    useEffect(() => { loadMessages() }, [])

    return <>

        <div className="flex-center">
            <p className={styles.info}>Acá podés visualizar los mensajes que dejan los clientes</p>
        </div>

        {
            !isDialog ? <></> : <Dialog 
                title={"¿Querés borrar este mensaje?"} 
                message={"El mensaje no se podrá recuperar"} 
                onAccept={() => removeMessage(isDialog)} 
                onReject={() => setIsDialog(undefined)}
            />
        }

        {
            isLoading == true ? <Loading/> :
            messages && messages.length > 0 ?
                <div>
                    {listMessages(messages, setIsDialog)}
                </div>
            :
                <p className={styles.info}>Aún no hay mensajes</p>
        }

    </>
}