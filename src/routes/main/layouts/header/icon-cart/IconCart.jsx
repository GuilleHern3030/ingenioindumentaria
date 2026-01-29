import { useContext, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { usersCanConsult, usersCanBuy } from '@/api/config.json'

import { ThemeContext } from '@/context/ThemeContext'

import styles from './IconCart.module.css'
import menuStyles from './MenuCart.module.css'
import articleStyles from './ArticleCart.module.css'

import cart_light from './cart-white.webp'
import cart_dark from './cart-black.webp'

import useCart from "@/hooks/useCart";
import Cross from "@/components/icon/cross";
import useClientInfo from "@/hooks/useClientInfo";
import Dialog from "@/components/dialog/Dialog";

const goTop = () => window.scrollTo({top:0})

export default ({ onShowMenu, onHide, t }) => {

    const [ deployed, setDeployed ] = useState(undefined)

    const { theme } = useContext(ThemeContext)
    const { count } = useCart()

    const handleHide = () => {
        setDeployed(false)
        return onHide()
    }

    const handleBack = () => {
        return handleShowMenu('')
    }

    const handleNavAnimation = () => {
        const newDeployment = (deployed === undefined) ? true : !deployed
        setDeployed(newDeployment)
        if (!deployed)
            handleShowMenu()
        else handleHide()
    }

    const handleShowMenu = () => {
        onShowMenu(<Menu
            onHide={handleHide}
            onShowSubmenu={handleShowMenu}
            onBack={handleBack}
            t={t}
        />
        )
    }

    return (
        <div className={styles.shoppingcart} onClick={handleNavAnimation}>
            { count() > 0 &&
                <div className={styles.counter}>
                    <p>{count() > 99 ? "99+" : `${count()}`}</p>
                </div>
            }
            <div className={styles.img}>
                <img src={theme == 'dark' ? cart_light : cart_dark} />
            </div>
        </div>
    )

}

const Menu = ({ onHide, onShowSubmenu, onBack, t }) => {

    const navigate = useNavigate()

    const [ dialog, setDialog ] = useState(null)

    const { dataLoaded, coinSymbol, contactlink, decimals } = useClientInfo()

    const { articles, subtotal, subtotalFeesless, clear, count, remove, params } = useCart()

    const handleConsult = () => {
        if (dataLoaded) {
            const link = `${location.origin}/cart/` + params()
            window.open(contactlink + `?text=${t('cart:consults-message')} ` + link, "_blank")
        }
    }

    const handleLink = (link) => {
        console.log(link)
        onHide()
        goTop()
        navigate(link)
    }

    const handleHide = () => {
        onHide()
        goTop()
    }

    const handleSelect = (article) => {
        
    }

    const showRemoveDialog = (article) => {
        setDialog(
            <Dialog
                title={t('cart:dialog-remove-title')}
                message={article.snapshot.name}
                onReject={() => setDialog(null)}
                onAccept={() => {
                    remove(article)
                    setDialog(null)
                }}
            />
        )
    }

    const showClearDialog = () => {
        setDialog(
            <Dialog
                title={t('cart:dialog-clear-title')}
                message={t('cart:dialog-clear-message')}
                onReject={() => setDialog(null)}
                onAccept={() => {
                    clear()
                    onHide()
                    setDialog(null)
                }}
            />
        )
    }

    return dataLoaded && <div className='menu__background' onClick={onHide}>
        <div className='header__background'></div>
        <div className='menu menu-right' onClick={e => e.stopPropagation()}>

            <div className={menuStyles.title}>
                <p>{t('cart:cart')}</p>
                <Cross className={menuStyles.cross} onClick={onHide}/>
            </div>

            <hr />

            { count() > 0 ?
                <>
                    <Articles 
                        articles={articles} 
                        coinSymbol={coinSymbol}
                        decimals={decimals}
                        onRemove={showRemoveDialog}
                        onClick={handleSelect}
                        t={t}
                    />

                    <div className={menuStyles.subtotal}>
                        <p>{t('cart:subtotal')}</p>
                        <p>{`${coinSymbol} ${subtotal().toFixed(decimals)}`}</p>
                    </div>

                    { subtotalFeesless() != subtotal() &&
                        <div className={`${menuStyles.subtotal} ${menuStyles.subtotal_nofees}`}>
                            <p>{`${t('cart:subtotal-nofees')}`}</p>
                            <p>{`${coinSymbol} ${subtotalFeesless().toFixed(decimals)}`}</p>
                        </div>
                    }

                    <hr />

                    { usersCanConsult && <p className={menuStyles.button} onClick={() => handleConsult()}>{t('cart:consult')}</p> }
                    { usersCanBuy && <p className={menuStyles.button} onClick={() => handleLink(`/cart`)}>{t('cart:continue')}</p> }
                    <p className={menuStyles.button} onClick={showClearDialog}>{t('cart:clear')}</p>
                </>
            :
                <>
                    <div className={menuStyles.instructions}>
                        <p>{t('cart:instructions')}</p>
                    </div>

                    <hr />

                    { /* <p className={menuStyles.button} onClick={() => handleLink('/help')}>{t('common:help')}</p> */ }
                </>

            }
        </div>
        { dialog }
    </div>
}

const Articles = ({ articles, coinSymbol, onRemove, onClick, decimals, t }) => 
    articles.map((article, index) => 
        <Article 
            key={index}
            article={article} 
            coinSymbol={coinSymbol} 
            decimals={decimals} 
            onRemove={onRemove}
            onClick={onClick}
            t={t}
        />
    )


const Article = ({ article, coinSymbol, decimals, onRemove, onClick, t }) => {

    const [ dialog, setDialog ] = useState(null)

    const price = <>
        { article.snapshot.discount > 0 &&
            <div style={{display:'flex'}}>
                <p className={articleStyles.strike}><strike>{`${coinSymbol} ${(article.snapshot.price * article.quantity).toFixed(decimals)}`}</strike></p>
                <p className={articleStyles.discount}><b>{`-${article.snapshot.discount}%`}</b></p>
            </div>
        }
        <p className={articleStyles.price}>{`${coinSymbol} ${((article.snapshot.discount > 0 ? (article.snapshot.price - article.snapshot.price * article.snapshot.discount / 100) : article.snapshot.price) * article.quantity).toFixed(decimals)}`}</p>
        </>

    return <>
        <article className={articleStyles.article}>
            <div className={articleStyles.image_container} onClick={onClick}>
                <img 
                    className={articleStyles.image}
                    src={article.snapshot.image}
                />
            </div>
            <div>
                <p className={articleStyles.name}>{article.snapshot.name}</p>
                {price}

                {/* Atributos o Filtros */}
                <Attributes attributes={article.snapshot.attributes}/>

                {/* Cantidad */}
                <div className={articleStyles.quantity}>
                    <p>{t('cart:quantity')}</p>
                    <p>{article.quantity}</p>
                </div>
                <p className={articleStyles.remove} onClick={() => onRemove(article)}>{t('cart:remove')}</p>
            </div>
        </article>
        <hr/>
        { dialog }
    </>

}

const Attributes = ({ attributes }) => { // Example: [{attributeId: 2, attributeName: 'Color', valueId: 2, valueName: 'Azul'}]

    return attributes ? <div className={articleStyles.attributes}>
        { 
            attributes.map((attribute, key) => 
                <p key={key}>{`${attribute.attributeName}`}: <span>{`${attribute.valueName}`}</span></p>
            )
        }
    </div> : null

}