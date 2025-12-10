import './Menu.css'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { isAdmin } from '@/api'

import Genders from './genders/Genders'
import Most from './most/Most'

export default () => {

    const promos = useSelector(hasPromos())

    return <div className='menu__background' onClick={hideFunction}>
        <div className='header__background'></div>
        <div className='menu' onClick={e => e.stopPropagation()}>
            <ul className='menu__promotions menu__ul'>
                { recent && <li><Link to='/recent' onClick={hideFunction}>Lo más nuevo</Link></li> }
                { promos && <li><Link to='/promos' onClick={hideFunction}>Promociones</Link></li> }
            </ul>
            <hr/>
            <ul className='menu__categories menu__ul'>
                <Genders/>
            </ul>
            <hr/>
            { genders.length > 1 && 
                <>
                    <ul className='menu__most menu__ul'>
                        <Most/>
                    </ul>
                    <hr/>
                </>
            }
            <ul className='menu__useful menu__ul'>
                <li><Link to='/about' onClick={hideFunction}>Dónde estamos</Link></li>
                <li><Link to='/contact' onClick={hideFunction}>Contacto</Link></li>
                {/*<li><Link to='/help' onClick={hideFunction}>Ayuda</Link></li>*/}
                { isAdmin() === true && <li><Link to="/admin">Panel de administración</Link></li> }
            </ul>
        </div>
    </div>
}