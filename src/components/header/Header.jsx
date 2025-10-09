/**
 * requires normalize.css
 */

import { Link } from 'react-router-dom';
import Nav from './Nav';
import { useLayoutEffect, useRef, useEffect, useState } from 'react';

import styles from './Header.module.css';

const max = (...numbers) => Math.max(...numbers);
export const goTop = () => window.scrollTo({top:0});

export default function Header(
        {
            children, 
            image, 
            pageName,
            color="#000",
            title,
            subtitle, 
            titleColor,
            subtitleColor,
            backgroundColor="#ebe9e9",
            changeBackgroundOnScroll=false,
            backgroundColorOnScroll="#7d7d7d48",
            colorOnScroll="#fff",
            height=0
        }) {

    const topRef = useRef();
    const contentRef = useRef();
    const isBackgroundTransparent = isTransparent(backgroundColor);
    const [ srcImage, setImageSrc ] = useState(image);
    const [ topHeight, setTopHeight ] = useState(0);
    const [ headerSize, setHeaderSize ] = useState(0);
    const [ pageScrolled, setPageScrolled ] = useState(undefined);
    useLayoutEffect(() => { setTopHeight(topRef.current.clientHeight) }, [])

    useEffect(() => {
        observeNavWidth(contentRef.current, headerSize, setHeaderSize);
        if (changeBackgroundOnScroll) observeScroll(setPageScrolled);
    }, []);

    return (
        <header className={styles.header} style={{minHeight:max(height, headerSize, topHeight)}}>

            <div 
                ref={topRef} 
                className={`${styles.top} ${ pageScrolled === false ? styles.header__opaque : pageScrolled === true ? styles.header__transparent : "" }`} 
                style={{ backgroundColor: pageScrolled === undefined ? backgroundColor : {} }}
            >
                { 
                    pageName ? 
                        <Link 
                            className={styles.pageName} 
                            style={
                                { 
                                    color: pageScrolled ? colorOnScroll : color 
                                }
                            } 
                            to="/" 
                            onClick={()=>goTop()}
                        > 
                            <h2> {pageName} </h2> 
                        </Link> 
                    : <p></p> 
                }
                { 
                    children && topHeight > 0 ? 
                        <Nav 
                            height={topHeight} 
                            backgroundColor={ pageScrolled ? backgroundColorOnScroll : backgroundColor } 
                            color={ pageScrolled ? colorOnScroll : color } 
                            barsColor={ pageScrolled ? colorOnScroll : color }
                        >
                            {children}
                        </Nav> 
                    : <></> 
                }
            </div>

            <div ref={contentRef} className={styles.content}>
                { 
                    title ? (
                        <div className={styles.contentText} style={{paddingTop: topHeight, paddingBottom: topHeight, minHeight:height, marginTop:!isBackgroundTransparent?topHeight:0}}>
                            <h1 style={{color:titleColor ? titleColor : color}}>{title}</h1>
                            { subtitle ? <p style={{color:subtitleColor ? subtitleColor : color}}>{subtitle}</p> : <></> }
                        </div>
                    ) : <> </>
                }
            </div>

            { 
                srcImage && headerSize > 0 ? 
                    <img 
                        className={styles.banner} 
                        src={srcImage}
                        onError={() => setImageSrc(undefined)}
                        style={
                            {
                                height:max(height, headerSize),
                                paddingTop:!isBackgroundTransparent?topHeight:0
                            }
                        } 
                    /> 
                : <div 
                className={styles.banner}
                style={
                    {
                        height:max(height, headerSize),
                        backgroundColor:backgroundColor,
                        paddingTop:!isBackgroundTransparent?topHeight:0
                    }
                }/>
            }
        
        </header>
    )
}

const observeNavWidth = (observedElement, headerSize, setter) => {
    if (!observedElement) return;
    const observer = new ResizeObserver((entries) => {
        // entry.target es el elemento observado
        // entry.contentRect contiene información sobre el tamaño actual del elemento
        const headerHeight = entries[0].contentRect.height;
        if (headerHeight != headerSize) 
            setter(observedElement.clientHeight);
    });
    observer.observe(observedElement); // Empieza a observar el elemento
    return () => { observer.unobserve(observedElement) }// Limpia la observación cuando el componente se desmonta
}

const observeScroll = (setPageScrolled, umbral=50) => {
    window.addEventListener("scroll", function() {
        const scrollPosition = window.scrollY; // Verifica la posición actual del scroll vertical
        const scrolled = scrollPosition > umbral;
        setPageScrolled(prev => prev !== undefined ? scrolled : prev === undefined && scrolled === true ? true : undefined)
    });
}

const isTransparent = (color, umbral=1) => {
    if (isColor(color)) {
        if (color.startsWith('rgb')) return rgbTransparent(color, umbral);
        else if (color.startsWith('#')) return rgbTransparent(hexToRgba(color), umbral);
    }
    return false;
}

const isColor = color => {
    if (color.startsWith('rgb')
        || color.startsWith('#') && color.length <= 9
    ) return true;
    else return false;
}

const rgbTransparent = (color, umbral=1) => {
    try {
        color = color.replace(/\s/g, '').toLowerCase();
        if (color.startsWith('rgba(')) {
            const alpha = parseFloat(color.substring(color.lastIndexOf(',') + 1, color.lastIndexOf(')')));
            return alpha < umbral;
        }
    } catch(e) { }
    return false;
}

const hexToRgba = hexColor => {
    let r = 0, g = 0, b = 0, a = 1;

    if (hexColor.length <= 5 && hexColor.length > 0) {
        let color = "#";
        for (const h of hexColor) {
            if (h === '#') continue;
            color += `${h}${h}`;
        }
        hexColor = color;
    }

    if (hexColor.length === 9) {
        r = parseInt(hexColor.substring(1, 3), 16);
        g = parseInt(hexColor.substring(3, 5), 16);
        b = parseInt(hexColor.substring(5, 7), 16);
        a = parseInt(hexColor.substring(7, 9), 16) / 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    else if (hexColor.length === 7) {
        r = parseInt(hexColor.substring(1, 3), 16);
        g = parseInt(hexColor.substring(3, 5), 16);
        b = parseInt(hexColor.substring(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    return undefined;
}