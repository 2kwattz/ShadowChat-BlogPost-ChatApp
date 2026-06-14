import React,{ useState,useEffect } from "react";


// Styles
import styles from "../Home/home.module.css"
import "../../styles/main.css"

// Components
import Navbar from '../../components/navbar/navbar';

// Apis
import { getCommunities } from "../../services/api";

function Home() {

  const [communityList,setCommunityList] = useState([])

  useEffect(()=>{
    const response = await getCommunities();
    setCommunityList(response);

    console.log("API RESPONSE", response)
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

    {/* Chatroom and Communities Button Wrapper */}

    <div className="buttonsWrapper"></div>
  </div>
 
</section>

{/* Chatroom List Test */}

<section>

</section>

    </React.Fragment>
  );
}

export default Home;