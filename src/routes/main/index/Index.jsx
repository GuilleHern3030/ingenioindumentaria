import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"

import styles from './Index.module.css'

import { title } from '@/assets/data/data.json'

import Articles from './components/articles/Articles'

import useDataBase from '@/hooks/useDataBase'
import { useRouteI18n } from '@/hooks/useRouteI18N'

export default () => {

    const { t, ready } = useRouteI18n("main/index")

    const { preloadedArticles, hasPromos, hasNewest } = useDataBase()

    const navigate = useNavigate()

    return ready && <main className={styles.main}>
        <section>
            <h1 className={styles.title}>{title}</h1>
        </section>

        <hr/>

        <section className={`${styles.section} ${styles.welcomes} flex-center-column`}>
            <p className={styles.welcome}>{t('welcome_1')}</p>
            <p className={styles.welcome}>{t('welcome_2')}</p>
        </section>

        <hr/>

        { preloadedArticles?.length > 0 ? 
            <>

                { (hasNewest == true || hasPromos == true) &&
                    <>
                        <section className={`${styles.section} flex-center-column`}>

                            { hasNewest == true && <button className={`button_square_white ${styles.offer}`} onClick={() => navigate(`/recent`)}>{t('recent')}</button> }

                            { hasPromos == true && <button className={`button_square_white ${styles.offer}`} onClick={() => navigate(`/promos`)}>{t('promos')}</button> }

                        </section>
                        <hr/>
                    </> 
                }

                <Articles 
                    articles={preloadedArticles} 
                    limit={6} 
                    t={t} 
                />

                <hr/>

                <section>
                    {/* Agregar más información */}
                </section>
            </> : <>
                <section className={`${styles.section} ${styles.no_articles} flex-center-column`}>
                    <p>{t('no_articles_1')}</p>
                    <p>{t('no_articles_2')}</p>
                    <p>{t('no_articles_3')}</p>
                </section>
            </>
        }

    </main>
}