import { useEffect, useState } from "react";
import styles from './MenuHamburger.module.css'

export default function MenuButton({barsColor="#000", onClick, deploy}) {
  const [ deployed, setDeployed ] = useState(undefined);
  const handleNavAnimation = () => { 
    const newDeployment = (deployed === undefined) ? true : !deployed
    setDeployed(newDeployment) 
    onClick(newDeployment)
  }

  useEffect(() => { setDeployed(deploy) }, [deploy])

  return (
    <div className={styles.navDeployed}>
        <div className={styles.navMenu} onClick={handleNavAnimation}>
            <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanTop__active : styles.headerRNSpanTop__inactive}></span>
            <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanCenter__active : styles.headerRNSpanCenter__inactive}></span>
            <span style={{backgroundColor:barsColor}} className={ deployed === undefined ? "" : deployed ? styles.headerRNSpanBottom__active : styles.headerRNSpanBottom__inactive}></span>
        </div>
    </div>
  );
}