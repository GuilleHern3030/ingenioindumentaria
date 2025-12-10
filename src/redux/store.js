import { configureStore } from '@reduxjs/toolkit'

// Reducers
import articlesReducer from './reducers/articles/articlesSlice'
import indexReducer from './reducers/index/indexSlice'
import shoppingCartReducer from './reducers/shoppingcart/shoppingcartSlice'
import categoriesReducer from './reducers/categories/categoriesSlice'

export default configureStore({
    reducer: {
        categories: categoriesReducer,
        articles: articlesReducer,
        index: indexReducer,
        shoppingcart: shoppingCartReducer
    }
})

