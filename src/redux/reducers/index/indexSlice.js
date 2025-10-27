import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  index: undefined,
}

export const indexSlice = createSlice({
  name: 'index', // nombre del "estado global"
  initialState, // valor inicial del "estado global"
  reducers: { // funciones/métodos que el "estado global" puede usar
    setIndex: (state, action) => {
      state.index = action.payload
    },
    setSelection: (state, action) => { // params: id, amount
      const article = state.articles.find(article => article.id == action.payload.id);
      article["amountSelected"] = action.payload.amount;
    }
  },
})

// Create Actions
export const { 
  setIndex, 
  setSelection
} = indexSlice.actions

export default indexSlice.reducer