import { Navigate, Route, Routes } from 'react-router-dom'

import Index from './index/AdminIndex'
import Workers from './workers/Workers'
import Attributes, { routes as attributeRoutes } from './attributes/Attributes'
import Categories, { routes as categoriesRoutes } from './categories/Categories.tsx'
import Users from './users/Users'
import Messages from './messages/Messages'
import Products, { routes as productRoutes } from './products/Products'

import ErrorBoundary from '@/components/error-boundary/ErrorBoundary'

/*export default () => {
  return <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="workers" element={<Workers/>}/>
      <Route path="categories" element={<Categories/>}> { categoriesRoutes } </Route>
      <Route path="attributes" element={<Attributes/>}> { attributeRoutes } </Route>
      <Route path="messages" element={<Messages/>} />
      <Route path="users" element={<Users/>} />
      <Route path="products" element={<Products/>}> { productRoutes } </Route>
      <Route path="*" element={<Navigate to={'/admin'} replace={true}/>}/>
    </Routes>
}*/

export default () => {
  return <ErrorBoundary to="/admin/error">
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="workers" element={<Workers/>}/>
      <Route path="categories" element={<Categories/>}> { categoriesRoutes } </Route>
      <Route path="attributes" element={<Attributes/>}> { attributeRoutes } </Route>
      <Route path="messages" element={<Messages/>} />
      <Route path="users" element={<Users/>} />
      <Route path="products" element={<Products/>}> { productRoutes } </Route>
      <Route path="*" element={<Navigate to={'/admin'} replace={true}/>}/>
    </Routes>
  </ErrorBoundary>
}