
import styles from './PageSelector.module.css'

import { useCommonI18n } from '@/hooks/useRouteI18N'

export default ({page, pages, onChange, className}) => {
    
    const { t } = useCommonI18n()

    return pages > 1 && <section className={`${styles.pages} ${className ?? ''}`}>
        <div className={`${styles.navigate}`}>
            <p>{t('common:last')}</p>
        </div>

        <Pages 
            page={page}
            pages={pages}
            onChange={onChange}
        />

        <div className={`${styles.navigate}`}>
            <p>{t('common:next')}</p>
        </div>
    </section>

}

function Pages({ page, pages, onChange }) {

    const arr = generatePages(page, pages)

    return (
        <div className={styles.selector}>
            {arr.map((item, i) => {
                if (item === '...') {
                    return (
                        <p key={i} className={styles.dots}>
                            ...
                        </p>
                    )
                }

                const isSelected = item === page

                return (
                    <p
                        key={i}
                        className={isSelected ? styles.selected : styles.selectable}
                        onClick={() => !isSelected && onChange(item)}
                    >
                        {item}
                    </p>
                )
            })}
        </div>
    )
}

function generatePages(current, total) {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i)
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
}