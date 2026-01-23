import { useEffect, useState } from 'react'
import styles from './Categories.module.css'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import Dialog from '@/components/dialog/Dialog'
import Slug from './slug/Slug'

export default ({ categories, slugs, onAdd, onRemove, t, editable = true }) => {

    const [ dialog, setDialog ] = useState(null)

    const [ slug, setSlug ] = useState(null)

    const [ firstRemove, setFirstRemove ] = useState(true)

    const handleRemove = (slug:string) => {
        const remove = () => (onRemove(slug), setDialog(null), setSlug(null), setFirstRemove(false))
        firstRemove ? setDialog(<Dialog
            title={t('editor_remove_category')}
            message={t('can_restore_later')}
            onReject={() => setDialog(null)}
            onAccept={remove}
        ><></></Dialog>) : remove()
    }

    const handleAdd = (slug:string) => {
        if (slug) 
            onAdd(slug)
        setDialog(null)
        setSlug(null)
        setFirstRemove(true)
    }

    return <section className={styles.categories}>

        { !slugs || slugs.length == 0 ? <p>{t('no_categories_assigned')}</p> : <p style={{paddingBottom:'.8em'}}>{t('categories_assigned')}</p> }

        <div className={styles.category_container}>
            { slugs && // Categorías ya establecidas
                slugs.map((slug:string, index: number) =>
                    <div key={index} className={styles.category}>
                        <p className={styles.slug}>{slug}</p>
                        { editable && <img src={removeIcon} onClick={() => handleRemove(slug)}/> }
                    </div>
                )
            }
        </div>

        { slug !== null &&
            <div className={styles.searching}>
                <div className={styles.searching_slug}>
                    <Slug categories={categories} onSlugChange={(slug:any) => setSlug(slug)} />
                </div>
                <div className={styles.accept}>
                    <div>
                        <img src={acceptIcon} onClick={() => handleAdd(slug)}/>
                        <img src={cancelIcon} onClick={() => setSlug(null)}/>
                    </div>
                </div>
            </div>
        }

        { categories?.length > 0 && slug === null && editable &&
            <div className={styles.add}>
                <img src={addIcon} onClick={() =>  setSlug('')}/>
            </div>
        }

        {dialog}

    </section>
}