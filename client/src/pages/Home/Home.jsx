import React, { useState, useEffect } from "react";


// Styles
import styles from "./home.module.css"
import "../../styles/main.css"

// Components
import Navbar from '../../components/Navbar/navbar';

// Apis
import { getCommunities } from "../../services/api";

function Home() {

  const [communityList, setCommunityList] = useState([])

  async function fetchCommunities(){
    let response;
    try{
      response = await getCommunities();
      setCommunityList(Array.isArray(response?.data) ? response.data : [])
      console.log("API RESPONSE", response?.data)
      return response;

    }
    catch(error){
      console.log("Error in calling Fetch communities ",error?.response?.data || error?.response)
    }
  }
  useEffect(() => {
fetchCommunities()
  },[])


useEffect(()=>{
console.log("COMMUNITY LIST ",communityList)
},[communityList])
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
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              Explore the feed</button>

            <button className="greyButton">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Join a Chatroom
            </button>

          </div>

          {/* Stats */}

          <div className={styles.statsContainer}>

            {/*  */}
            <div className={styles.statsItem}>

              <div className={styles.statsItemTitle}>
                <h4>04</h4>
              </div>

              <div className={styles.statsItemDescription}>
                PLATFORMS
              </div>

            </div>
            {/*  */}

            <div className={styles.statsItem}>

              <div className={styles.statsItemTitle}>
                <h4>24x7</h4>
              </div>

              <div className={styles.statsItemDescription}>
                <p>LIVE ACCESS</p>
              </div>

            </div>

            <div className={styles.statsItem}>

              <div className={styles.statsItemTitle}>
                <h4>100%</h4>
              </div>

              <div className={styles.statsItemDescription}>
                <p>PRIVACY FOCUSED</p>
              </div>

            </div>

            <div className={styles.statsItem}>
              <div className={styles.statsItemTitle}>
                <h4>∞</h4>
              </div>

              <div className={styles.statsItemDescription}>
                <p>CONVERSATIONS</p>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Trending Bar */}

      <div className={styles.trendingBar}>
        <p>🔥 Trending</p><div className={styles.trendingTags}>
          <p>#ArtificialIntelligence</p>
          <p>#Gaming</p>
          <p>#SpaceExploration</p>
          <p>#WebDev</p>
          <p>#IndianGeopolitics</p>
          <p>#OpSindoor</p>
          <p>#Photography</p>
        </div>
      </div>

      {/* Main Section */}

      <section className="mainFeed">

        <section className="feedLeft">

          <aside className="leftAbout">
            <h3 className="heading4">MENU</h3>

            <div className="leftSidebar">
              <ul>
                <li>Home</li>
                <li>Discover</li>
                <li>Communities</li>
                <li>Chatroom</li>
                <li>Popular</li>
              </ul>
            </div>

            <hr style={{ marginTop: 15,border: "1px solid rgba(255,255,255,0.06)"}}></hr>

             <h3 style={{marginTop: 15}} className="heading4">INFO</h3>

              <ul>
                <li>About</li>
                <li>Contact</li>
                <li>Guidelines</li>
                <li>Chatroom</li>
                <li>Popular</li>
              </ul>
          </aside>
          
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Delectus accusantium odit cum ullam quisquam saepe suscipit molestias maiores, nisi animi natus tempora deserunt ipsum nam incidunt, nobis autem alias dicta similique eius! Eos nulla aperiam explicabo, quia unde accusamus odio.
        </section>
        <main className="feedCenter">

          
          <section className={styles.chatroomSection}>

            <div className={styles.subheading}>

          <h4 className="heading4">Live Chatrooms</h4>

          <h5 className="textColorWhite3">View More</h5>
            </div>

          <div className={styles.chatroomCards}>

            {communityList?.length > 0 ? (
              communityList?.map((item,index)=>{

                return(

                <div className={styles.chatroomCard} key={item?.community_id ?? item?.id ?? index}>
                  <p className={styles.chatroomName}>{item?.community_name}</p>
                  <p style={{color:"white"}}>{item?.community_description}</p>
                  <p style={{color:"white"}}>{item?.member_count}</p>
                  <p style={{color:"white"}}>{item?.community_rules}</p>

                  <button className="cyanButton">Join Now</button>
                  </div>
                )
              })
            ): (<p style={{color:"white"}}>No Communities Found</p>)}

          </div>

          </section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ipsam possimus iusto id at culpa aliquam! Error cum tenetur pariatur quidem, eligendi recusandae repellendus accusantium, quos repellat illo, eum deleniti?
          
          </main>
        <aside className="feedRight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus aliquid modi omnis. Esse dolores velit, harum dolore ipsa saepe totam.</aside>

      </section>

    </React.Fragment>
  );
}

export default Home;
