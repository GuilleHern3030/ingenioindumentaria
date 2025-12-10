import { useEffect, useRef, useState } from "react"
import styles from './Slug.module.css'
import cancel from '@/assets/icons/cancel.webp'
import accept from '@/assets/icons/accept.webp'
import Loading from '@/components/loading/Loading'
import { rename } from '@/api/categories'
import { request } from "@/api"
import useUser from "@/hooks/useUser";

export default ({categories, category, onClick, onEdit, canEdit=undefined, t}) => {

    const [ slug, setSlug ] = useState()
    const [ isEditing, setIsEditing ] = useState()
    const [ isPutting, setIsPutting ] = useState(false)
    const input = useRef()
    
    const { setIsAdminSessionActive } = useUser()

    useEffect(() => {

        setIsEditing(undefined)
        setIsPutting(undefined)

        if (category) {
            const slug = category.slug()
            const slugs = category.slugs()
            const slugArray = category.toSlug()
            const routes = slugs.map((route, index) => 
                <div className="flex-center" key={index}>
                    <p className={styles.separator}>/</p>
                    <p
                        className={styles.route} 
                        onClick={ route == slug ? 
                            () => handleEdit(slug) :
                            () => onClick(categories.get(route))
                        }
                        >{slugArray[index]} 
                    </p>
                </div>
            )

            setSlug(routes)

        } else setSlug()
    }, [category])

    const handleEdit = (slug) => {
        if (canEdit)
            setIsEditing(slug)
    }

    const handleCancel = () => {
        setIsEditing(undefined)
        setIsPutting(false)
    }

    const handleAccept = () => {
        const newName = input.current.value
        request(setIsPutting, ()=>{}, rename, category.slug(), newName)
        .then(response => {
            setIsEditing(undefined)
            onEdit(response)
        })
        .catch(e => { 
            console.error(e)
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            else alert(t('couldnt_edit_category')) 
        })
    }

    return categories && <div className={styles.routes}>
        { isPutting ? <Loading/> :
          isEditing !== undefined ?
            <>
                <p><span style={{fontWeight:'bold'}}>{`${t('editing')}:`}</span>{` '${isEditing}'`}</p>
                <input ref={input} className={styles.input} placeholder={t('new_name')}/>
                <img className={styles.button} src={accept} onClick={handleAccept}/>
                <img className={styles.button} src={cancel} onClick={handleCancel}/>
            </> : <>
                <p className={styles.route} onClick={() => onClick()}>{"index"}</p>
                {slug}
            </>

        }
    </div>

}