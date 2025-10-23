import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  articles: undefined // array
}

export const articlesSlice = createSlice({
  name: 'articles', // nombre del "estado global"
  initialState, // valor inicial del "estado global"
  reducers: { // funciones/métodos que el "estado global" puede usar
    setArticles: (state, action) => {
      state.articles = action.payload.articles
    },
    setSelection: (state, action) => { // params: id, amount
      const article = state.articles.find(article => article.id == action.payload.id);
      article["amountSelected"] = action.payload.amount;
    }
  }
})

// Create Actions
export const { 
  setArticles, 
  setSelection
} = articlesSlice.actions

export default articlesSlice.reducer