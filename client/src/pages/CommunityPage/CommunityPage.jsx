import React, {useEffect,useState} from "react";
import {getIndividualCommunity} from '../../services/api';
import { useParams } from "react-router-dom";


const CommunityPage = () =>{

    const [communityDetails,setCommunityDetails] = useState(null);

    const { communitySlug } = useParams();

  console.log(`Slug in frontend ${communitySlug}`);

    async function fetchCommunity(){
        const response = await getIndividualCommunity({communitySlug});
        return response;

        console.log("Community Details")
    }

    useEffect(()=>{
fetchCommunity()
    },[])

    return(
        <section className="communityPage">

            {!communityDetails && <div style={{color:"white"}}> Error Fetching Community Details</div>}


        </section>
    )
}

export default CommunityPage;