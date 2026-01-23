import { Suspense, lazy } from "react";
import { Navigate, Route } from "react-router-dom";

import Loading from "@/components/loading/FullLoading";

import Index from "./index/Index";

const Contact = lazy (() => import("./contact/Contact"))
const About = lazy (() => import("./about/About"))
const Help = lazy (() => import("./help/Help"))
const Politics = lazy (() => import("./politics/Politics"))
const Terms = lazy (() => import("./terms/Terms"))
const Categories = lazy(() => import("./categories/Categories"))
const Article = lazy(() => import("./article/Article"))
const Articles = lazy(() => import("./articles/Articles"))
const Cart = lazy(() => import("./cart/Cart"))
const FAQ = lazy(() => import("./faq/FAQ"))
const Search = lazy(() => import("./search/Search"))
const Recent = lazy(() => import("./recent/Recent"))
const Promos = lazy(() => import("./promos/Promos"))

const User = lazy(() => import("./user/User"))
import userRoutes from './user/routes'

export default (
  <>
    <Route index element={<Index/>} />
    <Route path="article/*" element={<Suspense fallback={<Loading/>}><Article/></Suspense>}/>
    <Route path="category/*" element={<Suspense fallback={<Loading/>}><Categories/></Suspense>}/>
    <Route path="search/*" element={<Suspense fallback={<Loading/>}><Search/></Suspense>}/>
    <Route path="cart/*" element={<Suspense fallback={<Loading/>}><Cart/></Suspense>}/>
    <Route path="articles" element={<Suspense fallback={<Loading/>}><Articles/></Suspense>}/>
    <Route path="recent" element={<Suspense fallback={<Loading/>}><Recent/></Suspense>}/>
    <Route path="promos" element={<Suspense fallback={<Loading/>}><Promos/></Suspense>}/>
    <Route path="contact" element={<Suspense fallback={<Loading/>}><Contact/></Suspense>}/>
    <Route path="about" element={<Suspense fallback={<Loading/>}><About/></Suspense>}/>
    <Route path="help" element={<Suspense fallback={<Loading/>}><Help/></Suspense>}/>
    <Route path="politics" element={<Suspense fallback={<Loading/>}><Politics/></Suspense>}/>
    <Route path="terms" element={<Suspense fallback={<Loading/>}><Terms/></Suspense>}/>
    <Route path="faq" element={<Suspense fallback={<Loading/>}><FAQ/></Suspense>}/>
    <Route path="user" element={<Suspense fallback={<Loading/>}><User/></Suspense>}> { userRoutes } </Route>
    <Route path="*" element={<Navigate to={'/'} replace={true}/>}/>
  </>
);