import React, { useEffect, useState } from "react";
import "../../styles/main.css";
import styles from "../CommunityPost/communityPosts.module.css"


const CommunityPosts = ({title,description,label,postTime,slug}) => {

    return (
        <div className="communityPostWrapper">
            <div className="communityPostContent">
                <div className="communityTitles">

                    {/* Post Label */}

                    <div className="label">
                        u/ArtificialIntelligence
                    </div>

                    {/* Post Author */}

                    <div className="postAuthor">
                        by u/DeepMind
                    </div>

                    {/* Hype Category */}

                    <div className="postHype">
                        Hot
                    </div>

                    <div className="postTime">
                        9H ago
                    </div>

                </div>

                <h2>What will AGI actually look like when it arrives? Is anyone really prepared for it?</h2>

                <div className="communityDescription">
                    Most discussions obsess over timeline, but nobody talks about what changes first. I think transportation and logistics collapse within 18 months of any true AGI milestone — before the economic disruption even registers.

                </div>

                <div className="communityPostMedia">

                </div>
            </div>

            <div className="communityPostInteraction">
                <div className="voteSection">

                </div>

                <div className="commentSection">

                </div>

                <div className="shareSection">

                </div>

            </div>
        </div>
    )


}

module.exports = CommunityPosts