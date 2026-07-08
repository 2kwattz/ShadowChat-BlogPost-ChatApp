import React, { useEffect, useState } from "react";
import { getIndividualCommunity } from '../../services/api';
import { useParams } from "react-router-dom";
import sampleCover from "../../assets/sampleCover.jpg"
import communityIcon from "../../assets/communityIcon.png"
import './CreateCommunity.css'
import Navbar from '../../components/Navbar/navbar';

const CreateCommunity = () => {

    const [imageSelected,setImageSelected] = useState(false)

    return (
        <React.Fragment>

            <Navbar></Navbar>
            <section className='header'>
                <div className='backButton'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg>
                    <p>Back to communities</p>
                </div>

                <div>
                    <h1 style={{ color: "white" }}>
                        Create your Community
                    </h1>
                </div>

                <h2>
                    Build a home base for your people. Add a cover, set the ground rules, and give it an identity worth joining.
                </h2>
            </section>
            <section className='two-col-container'>
                <div className='two-col-left'>
                    
                    {/* Create Community Card */}

                    <div className="createCommunityCard">
                        <h3 style={{color:"white"}}>1. Branding </h3>
                        <p style={{color:"white"}} >Cover Image (Optional)</p>

                         <>
      <input
        type="file"
        id="cover-upload"
        accept="image/png,image/jpeg"
        onChange={()=>{console.log("Test Handle Image")}}
        hidden
      />

      <label htmlFor="cover-upload">
        {imageSelected ? (
          <img src={sampleCover} alt="Cover" height="70px" width="70px" />
        ) : (
          <div >
            <div>🖼️</div>

            <h3 style={{color:"white"}}>Click to upload a cover image</h3>

            <p style={{color:"white"}}>Recommended 1200×300px, JPG or PNG</p>
          </div>
        )}
      </label>
    </>

                    </div>
                </div>

                <div className='two-col-right'>
                    test
                </div>
            </section>
        </React.Fragment>
    )
}


export default CreateCommunity;