import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  articles: undefined, // map (object)
  hasDiscounts: false, // boolean
}

export const articlesSlice = createSlice({
  name: 'articles', // nombre del "estado global"
  initialState, // valor inicial del "estado global"
  reducers: { // funciones/métodos que el "estado global" puede usar
    setArticles: (state, action) => {
      const articles = action.payload
      const articlesMap = { }
      let hasDiscount = false
      articles.forEach(article => { 
        articlesMap[article.id] = article
        if (!hasDiscount && article.discount > 0)
          hasDiscount = true
      })
      state.articles = articlesMap;
      state.hasDiscounts = hasDiscount;
    }
  }
})

// Create Actions
export const { 
  setArticles
} = articlesSlice.actions

export default articlesSlice.reducer