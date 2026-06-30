import React, { useEffect, useState } from "react";
import { getIndividualCommunity } from '../../services/api';
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import sampleCover from "../../assets/sampleCover.jpg"
import communityIcon from "../../assets/communityIcon.png"

const CommunityPage = () => {

    const [communityDetails, setCommunityDetails] = useState(null);

    const [communityName, setCommunityName] = useState(null);
    const [communityUsername,setCommunityUsername] = useState(null)
    const [communityDescription,setCommunityDescription] = useState(null);
    const [communityMembers,setCommunityMembers] = useState(null);
    const [communityCreatedAt,setCommunityCreatedAt] = useState(null);

    const { communitySlug } = useParams();

    console.log(`Slug in frontend ${communitySlug}`);

    async function fetchCommunity() {
        const response = await getIndividualCommunity({ communitySlug });

        console.log("Community Details", response);
        console.log("Community Details",response)

        setCommunityDetails(response);
        setCommunityName(response.communityName);
        setCommunityUsername(response.communitySlug);
        setCommunityDescription(response.communityDescription);
        setCommunityMembers(response.memberCount);
        setCommunityCreatedAt(response.setCommunityCreatedAt);

        console.log("COM MEMBER COUNT ",communityMembers)

        return response;
    }

    useEffect(() => {
        fetchCommunity()
    }, [])

    return (
        <section className="communityPage">
            <Navbar></Navbar>

            {!communityDetails?.status && 
            <div style={{ color: "white", textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",height:"80vh" }}>
                <p>Community Not Found</p> 
            </div>
            }

            {
                communityDetails?.status &&

                <>
                    <div className="communityWrapper">
                        <p>test</p>
                    </div>

                    <div className="communityHeader">
                        <div className="communityHeaderLeft">
                            <div className="communityIconWrapper">
                                <img src={communityIcon} id="communityHeaderIcon" height={100} width={100}></img>
                            </div>
                            <span id="communityName">{communityName}</span>
                            <span id="communitySlug">r/{communityUsername}</span>
                            <p id="communityDescription">
                               {communityDescription}
                            </p>

                            <div className="headerBottom">
                                <span className="headerBottomItem">
                                    {communityMembers == 1?`${communityMembers} member`:`${communityMembers} members`}
                                    </span><br></br>

                                       <span className="headerBottomItem">
                                    Founded: {communityCreatedAt} 
                                    </span>
                            </div>

                        </div>
                    </div>

                </>


            }

        </section>
    )
}

export default CommunityPage;