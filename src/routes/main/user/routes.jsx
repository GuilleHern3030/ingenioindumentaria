import { Suspense, lazy } from "react";
import { Navigate, Route } from "react-router-dom";

import Loading from "@/components/loading/FullLoading";

const Profile = lazy(() => import("./profile/Profile"))
const Favourites = lazy(() => import("./favourites/Favourites"))
const Buys = lazy(() => import("./buys/Buys"))
const Opinions = lazy(() => import("./opinions/Opinions"))

export default (
  <>
    <Route index element={<Navigate to={"profile"} replace={true}/>} />
    <Route path="profile" element={<Suspense fallback={<Loading/>}><Profile/></Suspense>}/>
    <Route path="favourites" element={<Suspense fallback={<Loading/>}><Favourites/></Suspense>}/>
    <Route path="buys" element={<Suspense fallback={<Loading/>}><Buys/></Suspense>}/>
    <Route path="opinions" element={<Suspense fallback={<Loading/>}><Opinions/></Suspense>}/>
  </>
)