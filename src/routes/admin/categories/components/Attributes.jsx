import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Attributes.module.css'

import Dialog from '@/components/dialog/Dialog'
import Loading from '@/components/loading/Loading'

import useUser from '@/hooks/useUser'

export default ({ categories, category, t }) => {

    const navigate = useNavigate()
    const param = category ? `?category=${category}` : ''

    const handleNavigate = () => {
        console.log(categories)

        navigate('attributes' + param,
            {
                state: {
                    categories: categories.toJson()
                }
            }
        )
        
    }

    return <>
        <div className='flex-center-column'>
            <button 
                className={styles.button} 
                onClick={handleNavigate}
                >{`${category ? t('attributes_set') : t('attributes_set_global') }`}
            </button> 
        </div>
    </>
}