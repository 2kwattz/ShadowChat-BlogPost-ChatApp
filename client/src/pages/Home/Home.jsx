import React,{ useState,useEffect } from "react";

// Components
import Navbar from '../../components/navbar/navbar';

import { getCommunities } from "../../services/api";

function Home() {




  useEffect(()=>{
    const response = getCommunities();
    console.log("API RESPONSE")
  })



  return (
    <React.Fragment>
      <Navbar/>
      <div>
      <h1>Home Page</h1>
    </div>

    </React.Fragment>
  );
}

export default Home;