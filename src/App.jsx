import { RouterProvider } from 'react-router-dom'

import useRoutes from './hooks/useRoutes'

export default function App() {

  const routes = useRoutes()

  return <RouterProvider router={routes}/>
}
