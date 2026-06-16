import React, { useState, useEffect } from "react";


// Styles
import styles from "../Home/home.module.css"
import "../../styles/main.css"

// Components
import Navbar from '../../components/navbar/navbar';

// Apis
import { getCommunities } from "../../services/api";

function Home() {

  const [communityList, setCommunityList] = useState([])

  useEffect(() => {
    const response = getCommunities();
    console.log("API RESPONSE")
  })



  return (
    <React.Fragment>
      <Navbar />
      {/* <div>
      <h1>Home Page</h1>
    </div> */}
      <section className={styles.heroCover}>
        <div className={styles.heroLeft}>
          <h1 className="boldTitle">Where <span className="yellowPrimaryGradient">bold ideas</span> <br></br>find their <span className="purplePrimaryGradient">people</span> </h1>
          <p className={styles.description}>Ask anything. Spark debates. Join live chatrooms. Discover communities built around how you actually think</p>

          {/* Chatroom and Communities Button Wrapper */}

          <div className={styles.buttonsWrapper}>
            <button className="cyanButton">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              Explore the feed</button>

            <button className="greyButton">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Join a Chatroom
            </button>

          </div>

          {/* Stats */}

          <div className="statsContainer">

            <div className="statsItem">

              <div className="statsItemTitle">
                <h4>PLATFORMS</h4>
              </div>

              <div className="statsItemDescription">

              </div>

            </div>

            <div className="statsItem">

              <div className="statsItemTitle">
                <h4>PLATFORMS</h4>
              </div>

              <div className="statsItemDescription">
                <h4>LIVE ACCESS</h4>
              </div>

            </div>

            <div className="statsItem">

              <div className="statsItemTitle">

              </div>

              <div className="statsItemDescription">
                <h4>PRIVACY FOCUSED</h4>

              </div>

            </div>

            <div className="statsItem">
              <div className="statsItemTitle">

              </div>

              <div className="statsItemDescription">

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Chatroom List Test */}

      <section>

      </section>

    </React.Fragment>
  );
}

export default Home;