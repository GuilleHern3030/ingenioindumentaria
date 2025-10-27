import { useState } from "react"
import useIndexedDB from "../../../hooks/useIndexedDB"

import Dialog from "../../../components/dialog/Dialog"
import Loading from "../../../components/loading/Loading"

import Catalog from "../../../components/admin/products/Index"

export default function() {

    const [ dialog, setDialog ] = useState()    
    
    const { isLoading, database } = useIndexedDB()

    const handleReload = confirmed => {

        if (confirmed == undefined) {
            setDialog(
                <Dialog
                    title={"¿Deseas recargar el catálogo?"}
                    onAccept={() => handleReload(true)}
                    onReject={() => handleReload(false)}
                />
            )
            return;
        } 

        else if (confirmed === true) { // accepted
            database.pull()
        }

        setDialog(undefined)
    }

    return <>
        { dialog ? dialog : <></> }
        <>

            { 
                isLoading === true ? 
                <Loading/> :
                <Catalog reload={() => handleReload(true)}/>
            }

        </>
    </>

}