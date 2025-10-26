import './Menu.css'
import { Link } from 'react-router-dom';

import Genders from './genders/Genders';
import Most from './most/Most';
import useArticleFilter from '../../../hooks/useArticleFilter';

export default () => {

    const { hideFunction } = useArticleFilter()

    return <div className='menu__background'>
        <div className='menu'>
            <ul className='menu__promotions menu__ul'>
                <li><Link to='/recent' onClick={hideFunction}>Lo más nuevo</Link></li>
                <li><Link to='/promos' onClick={hideFunction}>Promociones</Link></li>
            </ul>
            <hr/>
            <ul className='menu__categories menu__ul'>
                <Genders/>
            </ul>
            <hr/>
            <ul className='menu__most menu__ul'>
                <Most/>
            </ul>
            <hr/>
            <ul className='menu__useful menu__ul'>
                <li><Link to='/about' onClick={hideFunction}>Dónde estamos</Link></li>
                <li><Link to='/contact' onClick={hideFunction}>Contacto</Link></li>
                <li><Link to='/help' onClick={hideFunction}>Ayuda</Link></li>
                <li><Link to='/admin' onClick={hideFunction}>Admin</Link></li>
            </ul>
        </div>
    </div>
}