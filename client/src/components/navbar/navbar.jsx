import { useState,useEffect } from "react";
import styles from "./navbar.module.css";
import '../../styles/main.css';

// Images
import Logo from '../../assets/logos/logo.png'


function Navbar(){
    return (
            <div className={styles.navbarWrapper}>
                <div className={styles.leftWrapper}>

                <div className={styles.logoWrapper}>
                    <img src={Logo} style={{height:"60px",width:"140px"}}/>
                </div>

                <div className={styles.searchbar}>
                    <input className={styles.navbarSearch} type="text" placeholder="Search Posts, Communities, People"></input>
                </div>
                </div>

                <div className={styles.rightWrapper}>
                    <ul className={styles.navlinksList}>
                        <li className={styles.navlinks}>Communities</li>
                        <li className={styles.navlinks}>Chatroom</li>
                        <li className={styles.navlinks}>About</li>
                    </ul>

                    <div className={styles.buttonsWrapper}>
                        <button className={styles.transparentButton}>Log In</button>
                         <button className={styles.purpleGradientButton}>Sign Up</button>
                    </div>
                </div>
            </div>
    )
}

export default Navbar;