import { Route } from "react-router-dom";

import Index from './index/Index'
import Attributes from './attributes/Attributes'

export default (
  <>
    <Route index element={<Index/>} />
    <Route path="attributes" element={<Attributes/>}/>
  </>
)