import { useEffect, useState } from 'react'
import styles from './Categories.module.css'

import { Categories } from '@/api/objects/Categories'

import addIcon from '@/assets/icons/add.webp'
import removeIcon from '@/assets/icons/remover.webp'
import acceptIcon from '@/assets/icons/accept.webp'
import cancelIcon from '@/assets/icons/cancel.webp'

import Dialog from '@/components/dialog/Dialog'
import Slug from '@/routes/admin/components/slug/Slug'

export default ({defaultCategories, onChange, t}) => {

    const [ dialog, setDialog ] = useState(null)

    const [ slug, setSlug ] = useState(null)

    const [ categories, setCategories ] = useState(Categories.toSlug(defaultCategories))
    useEffect(() => { onChange(categories) }, [categories])
    useEffect(() => { setCategories(Categories.toSlug(defaultCategories)) }, [defaultCategories])

    const handleRemove = (slug:string) => {
        setDialog(<Dialog
            title={t('editor_remove_category')}
            message={t('can_restore_later')}
            onReject={() => setDialog(null)}
            onAccept={() => (removeCategory(slug), setDialog(null), setSlug(null))}
        ><></></Dialog>)
    }

    const removeCategory = (slug:string) => {
        if (categories) {
            const indexOf = categories.indexOf(slug)
            if (indexOf >= 0) {
                categories.splice(indexOf, 1)
                setCategories(categories.slice())
            }
        }
    }

    const addCategory = (slug:string) => {
        if (categories) {
            if (slug && !categories.includes(slug)) {
                categories.push(slug)
                setCategories(categories.slice())
            }
        } else setCategories([slug])
    }

    return <div className={styles.categories}>

        { !categories || categories.length == 0 ? <p>{t('no_categories_assigned')}</p> : <p style={{paddingBottom:'.8em'}}>{t('categories_assigned')}</p> }

        { categories && // Categorías ya establecidas
            categories.map((slug:string, index: number) =>
                <div key={index} className={styles.category}>
                    <p className={styles.slug}>{slug}</p>
                    <img src={removeIcon} onClick={() => handleRemove(slug)}/>
                </div>
            )
        }

        { slug !== null &&
            <div className={styles.searching}>
                <div className={styles.searching_slug}>
                    <Slug onSlugChange={(slug:any) => setSlug(slug)} />
                </div>
                <div className={styles.accept}>
                    <div>
                        <img src={acceptIcon} onClick={() => (addCategory(slug), setDialog(null), setSlug(null))}/>
                        <img src={cancelIcon} onClick={() => setSlug(null)}/>
                    </div>
                </div>
            </div>
        }

        { slug === null &&
            <div className={styles.add}>
                <img src={addIcon} onClick={() =>  setSlug('')}/>
            </div>
        }

        {dialog}

    </div>
}