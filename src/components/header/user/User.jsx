import { Link } from 'react-router-dom';
import styles from './User.module.css'

import useArticleFilter from '../../../hooks/useArticleFilter';
import useUsers from '../../../hooks/useUser';

import SignIn from './SignIn/SignIn';
import SignOut from './SignOut/SignOut';
import Account from './Account/Account';

export default () => {

    const { hideFunction } = useArticleFilter()
    const { isSignedIn } = useUsers()

    
    return <div className='menu__background' onClick={hideFunction}>
        <div className='header__background'></div>
        <div className={`menu ${styles.usermenu}`} onClick={e => e.stopPropagation()}>
            {
                isSignedIn() === true ? <>
                    <Account hideFunction={hideFunction}/>
                    <hr style={{margin:'.5em 0'}}/>
                    <SignOut/>
                </> 
                : <SignIn/>
            }
        </div>
    </div>
}