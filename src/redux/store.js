import { configureStore } from '@reduxjs/toolkit'

// Reducers
import articlesReducer from './reducers/articles/articlesSlice'
import indexReducer from './reducers/index/indexSlice'

export default configureStore({
    reducer: {
        articles: articlesReducer,
        index: indexReducer
    }
})

