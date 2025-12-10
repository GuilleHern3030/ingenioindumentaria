import { 
    get as getCategories 
} from './categories.ts'

import { 
    selectByCategory as selectProductsByCategory, 
    selectByCategoryCascade as selectProductsByCategoryCascade,
    count as countProducts
} from './products.ts'

import { 
    selectAll as selectAllAttributes, 
    selectByCategory as selectAttributesByCategory, 
    selectByCategoryCascade as selectAttributesByCategoryCascade
} from './attributes.ts'


export default {
    init: async() => { },
    categories: {
        selectAll: getCategories, // json
    },
    attributes: {
        selectAll: selectAllAttributes,
        selectByCategory: selectAttributesByCategory,
        selectByCategoryCascade: selectAttributesByCategoryCascade
    },
    products: {
        selectByCategory: selectProductsByCategory,
        selectByCategoryCascade: selectProductsByCategoryCascade,
        count: countProducts
    }

}
