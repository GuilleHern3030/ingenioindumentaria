import { Link } from "react-router-dom"

import Header from "../../../components/header/Header"
import logo from '../../../assets/icons/logo.webp'

export default function() {
    return <>
    
        <Header 
            pageName={"Administración"}
            colorOnScroll='#1f1f1fff'
            logo={logo}
            mainLink={null}
            changeBackgroundOnScroll={false}>
            <Link to="/admin/products"> Artículos </Link>
            <Link to="/admin/messages"> Mensajes </Link>
        </Header>
    </>
}