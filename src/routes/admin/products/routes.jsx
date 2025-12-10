import { Route } from "react-router-dom";

import Index from './index/Index'
import Editor from './editor/Editor'
import Creator from './creator/Creator'

export default (
  <>
    <Route index element={<Index/>} />
    <Route path=":id" element={<Editor/>} />
    <Route path="new" element={<Creator/>} />
  </>
)