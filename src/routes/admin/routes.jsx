import { Route, Routes } from "react-router-dom";

import Index from './index/AdminIndex'
import GoogleSheet from './googlesheet/GoogleSheet'
import Attributes, { routes as attributeRoutes } from './attributes/Attributes'
import Categories, { routes as categoriesRoutes } from './categories/Categories'
import Messages from './messages/Messages'
import Products, { routes as productRoutes } from './products/Products'

export default () => {
  return <Routes>
    <Route path="/" element={<Index/>} />
    <Route path="googlesheet" element={<GoogleSheet/>}/>
    <Route path="categories" element={<Categories/>}> { categoriesRoutes } </Route>
    <Route path="attributes" element={<Attributes/>}> { attributeRoutes } </Route>
    <Route path="messages" element={<Messages/>} />
    <Route path="products" element={<Products/>}> { productRoutes } </Route>
  </Routes>
}