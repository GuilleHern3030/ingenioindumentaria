import { useEffect, useState } from "react"

import useUser from "@/hooks/useUser"
import { useRouteI18n } from '@/hooks/useRouteI18N'

import { getMessages, deleteMessage } from "@/api/messages"
import Loading from "@/components/loading/Loading"
import Dialog from "@/components/dialog/Dialog"

import styles from './Messages.module.css'
import deleteIcon from '@/assets/icons/delete.webp'
import Revalidate from "@/routes/admin/components/revalidate/Revalidate"

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
    
    const { t, ready } = useRouteI18n("admin")

    const [ isLoading, setIsLoading ] = useState()
    const [ messages, setMessages ] = useState([])
    const [ error, setError ] = useState()
    const [ isDialog, setIsDialog ] = useState()

    const { isAdminSessionActive, setIsAdminSessionActive } = useUser()

    const removeMessage = id => {
        setIsDialog(undefined)
        deleteMessage(Number(id)).then(() => {
            loadMessages()
        })
    }

    const loadMessages = () => {
        if (isAdminSessionActive === true) {
            setIsLoading(true)
            getMessages()
            .then(messages => {
                setMessages(messages)
                setError(undefined)
                setIsLoading(false)
            })
            .catch(e => {
                if (e.adminSessionExpired())
                    setIsAdminSessionActive(false)
                setError(e.toString())
                setMessages(undefined)
                setIsLoading(false)
            })
        } else {
            setError(t('revalidate_session_required'))
            setMessages(undefined)
        }
    }

    useEffect(() => { loadMessages() }, [isAdminSessionActive])

    return <>
        <p className={styles.title}>{t('messages')}</p>

        <div className="flex-center">
            { !error && <p className={styles.info}>{t('messages_subtitle')}</p> }
        </div>

        {
            isLoading == true ? <Loading/> :
            messages ?
                messages.length > 0 ?
                    <div>
                        {listMessages(messages, setIsDialog)}
                    </div>
                : <p className={styles.info}>{t('no_messages')}</p>
            : <div className={styles.error_container}>
                <p className={styles.error}>{error}</p>
                <button className={styles.button} onClick={loadMessages}>{t('retry')}</button>
            </div>
        }

        {
            !isDialog ? <></> : <Dialog 
                title={t('question_delete')} 
                message={t('message_is_not_recuperable')} 
                onAccept={() => removeMessage(isDialog)} 
                onReject={() => setIsDialog(undefined)}
            />
        }

    </>
}