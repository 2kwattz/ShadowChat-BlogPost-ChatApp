import { useState,useEffect } from "react";
import styles from "./navbar.module.css";
import '../../styles/main.css';
import { useNavigate } from "react-router-dom";

// Images
import Logo from '../../assets/logos/logo.png'

function Navbar(){

    // Navigation
    const navigate = useNavigate();
    
    return (
            <div className={styles.navbarWrapper}>
                <div className={styles.leftWrapper}>

                <div className={styles.logoWrapper}>
                    <img src={Logo} style={{height:"55px",width:"135px"}}/>
                </div>

                <div className={styles.searchbar}>
                    <input className={styles.navbarSearch} id="navbarSearch" type="text" placeholder="Search Posts, Communities, People"></input>
                </div>
                </div>

                <div className={styles.rightWrapper}>
                    <ul className={styles.navlinksList}>
                        <li className={styles.navlinks}>Home</li>
                        <li className={styles.navlinks}>Communities</li>
                        <li className={styles.navlinks}>Chatroom</li>
                        <li className={styles.navlinks}>About</li>
                    </ul>

                    <div className={styles.buttonsWrapper}>
                        <button className="transparentButton" onClick={() => navigate("/login")}>Log In</button>
                         <button className="purpleGradientButton">Sign Up</button>
                    </div>
                </div>
            </div>
    )
}

export default Navbar;