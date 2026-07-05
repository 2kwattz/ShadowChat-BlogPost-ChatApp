import React, { useEffect, useState } from "react";
import { getIndividualCommunity } from '../../services/api';
import { useParams } from "react-router-dom";
import sampleCover from "../../assets/sampleCover.jpg"
import communityIcon from "../../assets/communityIcon.png"
import './CreateCommunity.css'
import Navbar from '../../components/Navbar/navbar';

const CreateCommunity = () => {

    return (
        <React.Fragment>

            <Navbar></Navbar>
            <section className='header'>
                <div className='backButton'>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg>
                    <p>Back to communities</p>
                </div>
            </section>
            <section className='two-col-container'>
                <div className='two-col-left'>
                    test
                </div>

                <div className='two-col-right'>
                    test
                </div>
            </section>
        </React.Fragment>
    )
}


export default CreateCommunity;