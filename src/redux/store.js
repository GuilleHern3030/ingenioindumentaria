import { configureStore } from '@reduxjs/toolkit'

// Reducers
import articlesReducer from './reducers/articles/articlesSlice'
import indexReducer from './reducers/index/indexSlice'
import shoppingCartReducer from './reducers/shoppingcart/shoppingcartSlice'

export default configureStore({
    reducer: {
        articles: articlesReducer,
        index: indexReducer,
        shoppingcart: shoppingCartReducer
    }
})

