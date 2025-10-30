import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shoppingcart: undefined // array
}

export const articlesSlice = createSlice({
  name: 'shoppingcart', // nombre del "estado global"
  initialState, // valor inicial del "estado global"
  reducers: { // funciones/métodos que el "estado global" puede usar
    setShoppingCart: (state, action) => {
      state.shoppingcart = action.payload
    },
    setSelection: (state, action) => { // params: id, amount
      const article = state.shoppingcart.find(article => article.id == action.payload.id);
      article["amountSelected"] = action.payload.amount;
    }
  }
})

// Create Actions
export const { 
  setShoppingCart, 
  setSelection
} = articlesSlice.actions

export default articlesSlice.reducer