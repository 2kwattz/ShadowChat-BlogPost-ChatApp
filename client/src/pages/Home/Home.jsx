import React,{ useState,useEffect } from "react";


// Styles
import styles from "../Home/home.module.css"
import "../../styles/main.css"

// Components
import Navbar from '../../components/navbar/navbar';

// Apis
import { getCommunities } from "../../services/api";

function Home() {

  useEffect(()=>{
    const response = getCommunities();
    console.log("API RESPONSE")
  })



  return (
    <React.Fragment>
      <Navbar/>
      {/* <div>
      <h1>Home Page</h1>
    </div> */}
<section className={styles.heroCover}>
  <div className={styles.heroLeft}>
    <h1 className="boldTitle">Where <span className="yellowPrimaryGradient">bold ideas</span> <br></br>find their <span className="purplePrimaryGradient">people</span> </h1>
    <p className={styles.description}>Ask anything. Spark debates. Join live chatrooms. Discover communities built around how you actually think</p>
  </div>
 
</section>

    </React.Fragment>
  );
}

export default Home;