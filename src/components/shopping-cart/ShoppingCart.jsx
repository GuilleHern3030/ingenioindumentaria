import { Link } from "react-router-dom";
import useTable from "../../hooks/useTables";
import styles from "./ShoppingCart.module.css"
import cart from "./shoppingcart.webp"

export default function ShoppingCart(
        {
            onClicked=(...params)=>{},
            to
        }) {
    
    const { selections } = useTable();

    return (
        <Link className={styles.shoppingcart} to={to}>
            <div className={styles.counter}>
                <p>{selections > 99 ? "99+" : selections}</p>
            </div>
            <div className={styles.img}>
                <img src={cart}/>
            </div>
        </Link>
    )
}

const iconPosition = (x, y) => {
    if (x >= 0) x = { left: `${x}%` }
    else if (x < 0) x = { right: `${-x}%` }
    if (y >= 0) y = { top: `${y}%` }
    else if (y < 0) y = { bottom: `${-y}%` }
    return { ...x, ...y }
}