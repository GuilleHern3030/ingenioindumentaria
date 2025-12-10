import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  slugs: undefined, // map (object) -> contiene ids de attributes que contiene
  attributes: undefined, // map (object) -> contiene AttributeValues
}

export const categoriesSlice = createSlice({
  name: 'categories', // nombre del "estado global"
  initialState, // valor inicial del "estado global"
  reducers: { // funciones/métodos que el "estado global" puede usar
    setCategories: (state, action) => {
      const categories = action.payload
      const categoriesMap = { }
      const attributesMap = { }
      categories.forEach(category => {
        const attributesId = []
        category.Attributes.forEach(attribute => {
          attributesId.push(attribute.id)
          attributesMap[attribute.id] = {
            name: attribute.name,
            values: attribute.AttributeValues
          }
        })
        categoriesMap[category.slug] = attributesId
      })
      state.slugs = categoriesMap
      state.attributes = attributesMap
    }
  }
})

// Create Actions
export const { 
  setCategories
} = categoriesSlice.actions

export default categoriesSlice.reducer