import './Menu.css'
import { Link } from 'react-router-dom';

import Genders from './genders/Genders';
import Most from './most/Most';

export default ({hide}) => {

    return <div className='menu__background'>
        <div className='menu'>
            <ul className='menu__promotions menu__ul'>
                <li><Link to='/recent' onClick={hide}>Lo más nuevo</Link></li>
                <li><Link to='/promos' onClick={hide}>Promociones</Link></li>
            </ul>
            <hr/>
            <ul className='menu__categories menu__ul'>
                <Genders/>
            </ul>
            <hr/>
            <ul className='menu__most menu__ul'>
                <Most hide={hide}/>
            </ul>
            <hr/>
            <ul className='menu__useful menu__ul'>
                <li>Dónde estamos</li>
                <li>Contacto</li>
                <li>Ayuda</li>
            </ul>
        </div>
    </div>
}