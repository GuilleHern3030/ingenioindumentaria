import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";

import Loading from "@/components/loading/FullLoading";

import Index from "./index/Index";
const Contact = lazy (() => import("./contact/Contact"))
const About = lazy (() => import("./about/About"))
const Help = lazy (() => import("./help/Help"))
const Politics = lazy (() => import("./politics/Politics"))
const Terms = lazy (() => import("./terms/Terms"))
const Categories = lazy(() => import("./categories/Categories"))
const Article = lazy(() => import("./article/Article"))


export default (
  <>
    <Route index element={<Index/>} />
    <Route path="article/*" element={<Suspense fallback={<Loading/>}><Article/></Suspense>}/>
    <Route path="category/*" element={<Suspense fallback={<Loading/>}><Categories/></Suspense>}/>
    <Route path="recent" element={<Suspense fallback={<Loading/>}><Categories/></Suspense>}/>
    <Route path="promos" element={<Suspense fallback={<Loading/>}><Categories/></Suspense>}/>
    <Route path="contact" element={<Suspense fallback={<Loading/>}><Contact/></Suspense>}/>
    <Route path="about" element={<Suspense fallback={<Loading/>}><About/></Suspense>}/>
    <Route path="help" element={<Suspense fallback={<Loading/>}><Help/></Suspense>}/>
    <Route path="politics" element={<Suspense fallback={<Loading/>}><Politics/></Suspense>}/>
    <Route path="terms" element={<Suspense fallback={<Loading/>}><Terms/></Suspense>}/>
  </>
);