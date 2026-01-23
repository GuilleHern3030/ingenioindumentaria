import styles from './Filters.module.css'

import Box from './box/Box'
import FilterList from './filter-list/FilterList'

import Order from '../../utils/OrderUtils';

export default ({className, attributes, columns, onChangeColumns, onChangeFilters, filters, order, t}) => {

    return <section className={className}>

        <div className={styles.filters}>

            <div className={styles.filters_box}> 

                <FilterList 
                    setFilters={(filters, order) => onChangeFilters(filters, order)}
                    attributes={attributes}
                    filters={filters}
                    order={Order.get(order)}
                    t={t}
                />

            </div>

            <div className={styles.filters_liststyle}> {/* Selectores de estilo de lista */}
                <Box onClick={() => onChangeColumns(1)} boxes={1} selected={1 == columns}/>
                <Box onClick={() => onChangeColumns(2)} boxes={2} selected={2 == columns}/>
                <Box onClick={() => onChangeColumns(3)} boxes={3} selected={3 == columns}/>
            </div>

        </div>

    </section>

}