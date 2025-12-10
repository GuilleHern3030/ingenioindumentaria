import { useState } from 'react';
import { email, language, axios } from '@/api'
import styles from './GoogleSheet.module.css'
import { useRouteI18n } from '@/hooks/useRouteI18N';
import SizeUtils from '@/utils/SizeUtils';

import updateGoogleSheet from '@/api/handlers/external/updateGoogleSheetHandler';
import updateJson from '@/api/handlers/external/updateJsonHandler';
import Loading from '@/components/loading/LogoLoading';

export default () => {

    const { t, ready } = useRouteI18n()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ data, setData ] = useState(null)
    const [ error, setError ] = useState(null)

    const handleUpdate = async(updater) => {
        setIsLoading(true)
        setData(null)
        setError(null)
        updater().then(data => {
            setData(data)
            setIsLoading(false)
            console.log(data)
        }).catch(e => { 
            setIsLoading(false)
            setError(<p className='error'>{e.toString()}</p>) 
        })
    }

    return (ready && !isLoading) ?
        <main className='unselectable'>

            {error}

            { data && 
                <section className={styles.data}>
                    <p className={styles.updated}>{t('updated')}</p>
                    { data.megabytes && <p className={styles.size}>{`${t('size')}: ${SizeUtils.toString(data.megabytes * 1024 * 1000)}`}</p> }
                    { data.url && <a className={styles.link} href={data.url}>{data.url}</a> }
                </section> 
            }

            <section className="flex-center-column">
                <button className={`button_square_white ${styles.button}`} onClick={() => handleUpdate(updateGoogleSheet)}>{t('update_googlesheet')}</button>
                <button className={`button_square_white ${styles.button}`} onClick={() => handleUpdate(updateJson)}>{t('update_json')}</button>
            </section> 

        </main> : <Loading/>
}