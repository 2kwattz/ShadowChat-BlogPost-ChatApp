import React, { useEffect, useState } from "react";
import { getIndividualCommunity } from '../../services/api';
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import sampleCover from "../../assets/sampleCover.jpg"
import communityIcon from "../../assets/communityIcon.png"

const CreateCommunity = () => {

    return (
        <section className="communityPage">
            <Navbar></Navbar>

            

        </section>
    )
}

export default CreateCommunity;