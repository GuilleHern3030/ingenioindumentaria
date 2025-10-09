import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

import styles from './Nav.module.css';

export default function Nav(
        {
            children, 
            forceMenu=false, 
            color="#000",
            barsColor="#fff",
            backgroundColor="#7d7d7d48",
            height=50
        }) {

    const divRef = useRef();
    const [ menu, setMenu ] = useState(forceMenu);
    const [ deployed, setDeployed ] = useState(undefined);
    const links = children ? filterLinks(children, color) : [];
    const handleNavAnimation = () => { setDeployed((deployed === undefined) ? true : !deployed) }
    useEffect(() => observeMenuDeployed(divRef.current, setMenu), []);

    return (<>
        { menu === false ? <div ref={divRef} className={styles.navHorizontal} style={{height:height, color:color}}> { links } </div> : 
            <div className={styles.navDeployed}>
                <div className={styles.navMenu} onClick={handleNavAnimation}>
                    <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanTop__active : styles.headerRNSpanTop__inactive}></span>
                    <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanCenter__active : styles.headerRNSpanCenter__inactive}></span>
                    <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanBottom__active : styles.headerRNSpanBottom__inactive}></span>
                </div>
                { 
                    deployed !== undefined ? 
                        <div 
                            className={`${styles.navMenuItems} ${deployed ? styles.headerRN__active : styles.headerRN__inactive}`} style={{backgroundColor:backgroundColor}}> 
                            {links} 
                        </div> 
                    : <></> 
                }
            </div>
        } 
    </>);
}

const filterLinks = (elements, color) => {
    const links = [];
    for (const link of elements) {
        if (link.type === Link || link.type === 'a') try {
            const styles = link.props.style ? link.props.style : {}
            links.push(
                <Link 
                    key={links.length}
                    to={link.props.to || link.props.href}
                    onClick={link.props.onClick ? link.props.onClick : () => window.scrollTo({top:0})}
                    style={{...styles, color:color}}
                    >{link.props.children}
                </Link>
            );
        } catch(e) { }
        else if (link.type === 'button') {
            const styles = link.props.style ? link.props.style : {}
            links.push(
                <button 
                    key={links.length}
                    onClick={link.props.onClick}
                    style={{...styles, color:color}}
                    >{link.props.children}
                </button>
            );
        } else links.push(link)
    }
    return links;
}

const observeMenuDeployed = (divRef, setMenu) => {
    const checkDivPosition = () => {
        if (divRef) {
            const rootRect = document.querySelector("body").getBoundingClientRect();
            const divRect = divRef.getBoundingClientRect();
            if (divRect.right > rootRect.right || divRect.left < rootRect.left)
                setMenu(true)
        }
    };
    window.addEventListener('resize', checkDivPosition); // Llamar a la función para verificar la posición cuando cambie el tamaño de la ventana
    checkDivPosition(); // Llamar a la función para verificar la posición cuando el componente se monte
    return () => { window.removeEventListener('resize', checkDivPosition) } // Eliminar el oyente cuando el componente se desmonte
}