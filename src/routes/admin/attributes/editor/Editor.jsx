import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

import styles from '../Attributes.module.css'

import { put, disable, remove, enable, get } from '@/api/attributes'
import { devMode, request } from "@/api";

import Editor from '../components/editor/Editor';
import Loading from "@/components/loading/FullLoading";
import Alert from "@/components/alert/Alert";
import useUser from "@/hooks/useUser";

export default () => {

    const { t } = useOutletContext();

    const navigate = useNavigate()
    const location = useLocation()

    const { setIsAdminSessionActive } = useUser()

    const [ attribute, setAttribute ] = useState()
    const [ from, setFrom ] = useState()
    const [ slug, setSlug ] = useState()
    const [ categories, setCategories ] = useState()

    const [ dialog, setDialog ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ error, setError ] = useState()

    useEffect(() => {// state: { attribute, from, slug, categories }
        if (location?.state) {
            console.log(location.state)
            setAttribute(location.state.attribute)
            setFrom(location.state.from)
            setSlug(location.state.slug)
            setCategories(location.state.categories)
        } else navigate("/admin/attributes")
    }, [])

    const reload = (attribute) => {
        //const state = { ...location.state }
        //state.attribute = { ...attribute }
        setAttribute(attribute)
        /*navigate('.', { 
            replace: true, 
            //state
        })*/
        //window.location.reload()
    }

    const goBack = () => navigate(slug ? `${from}?slug=${slug}` : from)

    const handleEdit = (attribute, newName) => {
        request(setIsLoading, setError, put, attribute, newName)
        .then(result => { 
            navigate(slug ? `${from}?slug=${slug}` : from)
        })
        .catch(e => {
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
            console.error(e)
        })
    }

    const handleDelete = (attribute) => {
        const deleter = attribute?.disabled !== true ? disable : remove
        request(setIsLoading, setError, deleter, attribute)
        .then(result => result?.disabled ? reload(attribute) : goBack() )
        .catch(e => {
            console.error(e)
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
        })
    }

    const handleEnable = (attribute) => {
        request(setIsLoading, setError, enable, attribute)
        .then(result => reload(attribute) )
        .catch(e => {
            console.error(e)
            if(e.adminSessionExpired())
                setIsAdminSessionActive(false)
        })
    }

    return <>
        <p className={styles.subtitle}>{t('edit')}</p>
        { error && <p className="error">{error}</p>}
        { attribute && 
            <Editor
                attributeSelected={attribute}
                categories={categories}
                onSuccess={handleEdit} 
                onCancel={goBack} 
                onDelete={handleDelete}
                onEnable={handleEnable}
                t={t}
            /> 
        }
        
        { dialog }

        { isLoading && <Loading/> }
        
    </>
    
}