import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"

import Loading from "@/components/loading/FullLoading"

import Main, { routes as mainRoutes } from "./main"
import Auth from "./auth"

const Admin = lazy(() => import("./admin"))
const AdminRoutes = lazy(() => import("./admin").then(mod => ({ default: mod.routes })))

export default () => {

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>

          <Route element={<Main />}>
            {mainRoutes}
          </Route>

          <Route path="/auth" element={<Auth/>}/>

          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loading />}>
                <Admin />
              </Suspense>
            }
          >
            <Route // subrutas
              path="*"
              element={
                <Suspense fallback={<Loading />}>
                  <AdminRoutes />
                </Suspense>
              }
            />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}