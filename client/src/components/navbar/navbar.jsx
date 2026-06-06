import { useState,useEffect } from "react";
import styles from "./navbar.module.css";
import '../../styles/main.css';

// Images
import Logo from '../../assets/logos/logo.png'


function Navbar(){
    return (
            <div className={styles.navbarWrapper}>
                <div className={styles.logoWrapper}>
                    <img src={Logo} style={{height:"60px",width:"170px"}}/>
                </div>

                <div className={styles.searchbar}></div>
            </div>
    )
}

export default Navbar;