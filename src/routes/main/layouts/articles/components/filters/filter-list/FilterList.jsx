import { useState, useRef, useEffect } from 'react'
import styles from './FilterList.module.css'
import Icon from '../icon/Icon';
import { ORDERS } from '../../../utils/OrderUtils';

function recordsAreEqual(a, b) {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }

  return true;
}

export default ({attributes = [], order, filters, setFilters, t}) => {

    const [ list, setList ] = useState(false)
    const [ subList, setSubList ] = useState(false)
    const [ listStyle, setListStyle ] = useState()
    const [ filtersSelected, setFiltersSelected ] = useState(filters ? {...filters} : {})
    const [ orderSelected, setOrderSelected ] = useState({...order})
    const listRef = useRef()
    const headerRef = useRef()

    const orders = ORDERS.map((order, id) => ({ name: t(ORDERS[id].key) + (ORDERS[id].order ? ` (${t(ORDERS[id].order)})` : ''), ...ORDERS[id] }))
    
    const closeList = () => {
        setList(false)
        setSubList(false)
    }

    useEffect(() => {
        if (list) {
            setFiltersSelected(filters ? {...filters} : {})
            setOrderSelected({...order})
        }
    }, [ list ])

    const apply = () => {
        closeList()
        if(!recordsAreEqual(filters, filtersSelected) 
        || !recordsAreEqual(order, orderSelected))
            setFilters(filtersSelected, orderSelected.id)
    }

    const clean = () => {
        closeList()
        if(!recordsAreEqual(filters, {}) 
        || !recordsAreEqual(order, orderSelected))
            setFilters({}, orderSelected.id)
    }

    useEffect(() => { setSubList(false) }, [list])

    const showSubList = (attribute) => {
        setListStyle({
            minWidth: `${listRef.current.clientWidth}px`
        })
        if (attribute) setSubList((subList && attribute.name == subList.name) ? false : attribute)
        else setSubList(subList !== null ? null : false)
    }

    const handleSetFilter = (attribute, value) => {
        if (filtersSelected[attribute.name] == value.name)
            delete filtersSelected[attribute.name]
        else filtersSelected[attribute.name] = value.name
        setFiltersSelected({...filtersSelected})
    }

    const handleSetOrder = (order) => {
        setOrderSelected(order)
    }

    return <>

        <div className={styles.filters} onClick={() => setList(true)}> 
            <Icon/>
            <p>{t('filters')}</p>
            { Object.keys(filters).length > 0 && <p className={styles.amount}>{`(${Object.keys(filters).length})`}</p> }
        </div>
    
        { list && 
            <>
                <div className={styles.list} ref={listRef}>

                    <p ref={headerRef} className={styles.title}>{t('filters')}</p>
                    <hr/>
                    
                    <div className={styles.items}>
                        { // Atributos
                            attributes.map((attribute, key) => 
                                <div className={styles.item} onClick={() => showSubList(attribute)} key={key}>
                                    <p className={`${styles.attribute} ${filtersSelected[attribute.name] != undefined ? styles.selected : ''} ${subList === false ? '' : subList?.name == attribute.name ? styles.clicked : styles.unselected }`}>{attribute.name}</p>
                                    { <p className={(subList !== false && subList?.name != attribute.name) ? styles.transparent : ''}>{'>'}</p> }
                                </div>
                            )
                        }
                    </div>

                    { attributes?.length > 0 && <hr/> }

                    <div className={styles.items}>
                        <div className={styles.item} onClick={() => showSubList(null)}>
                            <p className={`${styles.attribute} ${orderSelected.id != 0 ? styles.selected : ''} ${subList === null ? styles.clicked : subList != false ? styles.unselected : '' }`}>{t('orderby')}</p>
                            { <p className={(subList !== null && subList !== false) ? styles.transparent : ''}>{'>'}</p> }
                        </div>
                    </div>
                    
                    <hr/>

                    <p className={styles.apply} onClick={apply}>{t('filters_apply')}</p>
                    <p className={styles.apply} onClick={clean}>{t('filters_clean')}</p>


                </div>
                <div className={styles.background} onClick={apply}></div>
            </>
        }
    
        { list && subList !== false && 
            <div className={`${styles.list} ${styles.sublist}`} style={listStyle}>

                <p className={styles.title}>{subList === null ? t('order') : subList.name}</p>

                <hr/>

                <div className={styles.items}>
                    { subList !== null ?
                        (subList.values ?? subList.AttributeValues).map((value, key) => 
                            <div className={styles.item} onClick={() => handleSetFilter(subList, value)} key={key}>
                                <p className={`${styles.attribute} ${filtersSelected[subList.name] == value.name ? styles.selected : ''}`}>{value.name}</p>
                            </div>
                        ) : orders.map((order, id) =>
                            <div className={styles.item} onClick={() => handleSetOrder(order)} key={id}>
                                <p className={`${styles.attribute} ${orderSelected.id == order.id ? styles.selected : ''}`}>{order.name}</p>
                            </div>
                        )
                    }
                </div>

                <hr/>

                <p className={`${styles.apply} ${styles.back}`} onClick={() => setSubList(false)}>{t('back')}</p>


            </div>
        }
    </>
}