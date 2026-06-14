import React,{ useState,useEffect } from "react";


// Styles
import styles from "../Home/home.module.css"

// Components
import Navbar from '../../components/navbar/navbar';

// Apis
import { getCommunities } from "../../services/api";

function Home() {

  useEffect(()=>{
    const response = getCommunities();
    console.log("API RESPONSE")
  })



  return (
    <React.Fragment>
      <Navbar/>
      {/* <div>
      <h1>Home Page</h1>
    </div> */}
<section>
  <svg class="hero-cover" viewBox="0 0 1440 580" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>

      <radialGradient id="gCyan" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.22"></stop>
        <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"></stop>
      </radialGradient>
      <radialGradient id="gViolet" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.18"></stop>
        <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"></stop>
      </radialGradient>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#07090f"></stop>
        <stop offset="100%" stop-color="#0b0e1a"></stop>
      </linearGradient>
      <linearGradient id="buildingGradC" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.25"></stop>
        <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.04"></stop>
      </linearGradient>
      <linearGradient id="buildingGradV" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.22"></stop>
        <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.04"></stop>
      </linearGradient>
      <linearGradient id="buildingGradN" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.07"></stop>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"></stop>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"></feGaussianBlur>
        <feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
      </filter>
    </defs>

    <rect width="1440" height="580" fill="url(#skyGrad)"></rect>


    <ellipse cx="980" cy="260" rx="340" ry="260" fill="url(#gCyan)"></ellipse>
    <ellipse cx="1200" cy="200" rx="280" ry="220" fill="url(#gViolet)"></ellipse>
    <ellipse cx="760" cy="320" rx="200" ry="160" fill="url(#gViolet)" opacity="0.5"></ellipse>

  
    <rect x="580" y="340" width="28" height="140" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="614" y="310" width="20" height="170" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="640" y="295" width="36" height="185" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="682" y="320" width="22" height="160" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="710" y="350" width="30" height="130" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="748" y="300" width="18" height="180" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="772" y="330" width="26" height="150" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="804" y="280" width="40" height="200" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="850" y="310" width="22" height="170" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="878" y="360" width="28" height="120" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="914" y="290" width="32" height="190" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="952" y="340" width="18" height="140" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="976" y="305" width="24" height="175" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="1006" y="330" width="34" height="150" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="1046" y="280" width="20" height="200" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="1072" y="315" width="28" height="165" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="1106" y="350" width="22" height="130" fill="url(#buildingGradN)" rx="1"></rect>
    <rect x="1134" y="290" width="36" height="190" fill="url(#buildingGradN)" rx="1"></rect>

  
    <rect x="820" y="240" width="50" height="240" fill="url(#buildingGradC)" rx="2"></rect>
    <rect x="876" y="260" width="38" height="220" fill="url(#buildingGradC)" rx="2"></rect>
    <rect x="1020" y="220" width="55" height="260" fill="url(#buildingGradC)" rx="2"></rect>
    <rect x="1100" y="250" width="42" height="230" fill="url(#buildingGradC)" rx="2"></rect>
    <rect x="1148" y="200" width="60" height="280" fill="url(#buildingGradC)" rx="2"></rect>

   
    <rect x="940" y="180" width="70" height="300" fill="url(#buildingGradV)" rx="2"></rect>
    <rect x="1016" y="160" width="55" height="320" fill="url(#buildingGradV)" rx="2"></rect>
    <rect x="1210" y="190" width="75" height="290" fill="url(#buildingGradV)" rx="2"></rect>
    <rect x="1290" y="210" width="50" height="270" fill="url(#buildingGradV)" rx="2"></rect>
    <rect x="1346" y="170" width="95" height="310" fill="url(#buildingGradV)" rx="2"></rect>


    <rect x="1074" y="100" width="64" height="380" fill="url(#buildingGradC)" rx="2"></rect>
  
    <line x1="1106" y1="100" x2="1106" y2="60" stroke="#22d3ee" stroke-width="1.5" stroke-opacity="0.6"></line>
    <circle cx="1106" cy="58" r="3" fill="#22d3ee" opacity="0.8" filter="url(#glow)"></circle>

  
    <g opacity="0.30">
      <rect x="1080" y="115" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1090" y="115" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1100" y="115" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1110" y="115" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1080" y="126" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1100" y="126" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1110" y="126" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1080" y="137" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1090" y="137" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1110" y="137" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1080" y="148" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="1090" y="148" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1100" y="148" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="1080" y="159" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="1110" y="159" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
    </g>
  
    <g opacity="0.25">
      <rect x="946" y="195" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="956" y="195" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="966" y="195" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="976" y="195" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="946" y="207" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="966" y="207" width="5" height="4" fill="#22d3ee" rx="0.5"></rect>
      <rect x="976" y="207" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="946" y="219" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="956" y="219" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
      <rect x="976" y="219" width="5" height="4" fill="#a78bfa" rx="0.5"></rect>
    </g>

 
    <circle cx="1106" cy="360" r="6" fill="#22d3ee" opacity="0.9" filter="url(#glow)"></circle>
    <circle cx="1106" cy="360" r="14" fill="#22d3ee" opacity="0.07"></circle>

  
    <circle cx="970" cy="430" r="4" fill="#a78bfa" opacity="0.8" filter="url(#glow)"></circle>
    <circle cx="1240" cy="390" r="4" fill="#22d3ee" opacity="0.75" filter="url(#glow)"></circle>
    <circle cx="1050" cy="290" r="3.5" fill="#a78bfa" opacity="0.7" filter="url(#glow)"></circle>
    <circle cx="1180" cy="310" r="3" fill="#22d3ee" opacity="0.65" filter="url(#glow)"></circle>
    <circle cx="880" cy="460" r="3" fill="#22d3ee" opacity="0.6"></circle>
    <circle cx="1320" cy="440" r="3.5" fill="#a78bfa" opacity="0.7" filter="url(#glow)"></circle>
    <circle cx="1140" cy="440" r="2.5" fill="#a78bfa" opacity="0.6"></circle>
    <circle cx="1000" cy="350" r="2.5" fill="#22d3ee" opacity="0.55"></circle>
    <circle cx="1290" cy="330" r="2.5" fill="#22d3ee" opacity="0.5"></circle>


    <line x1="1106" y1="360" x2="970" y2="430" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.25"></line>
    <line x1="1106" y1="360" x2="1240" y2="390" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.25"></line>
    <line x1="1106" y1="360" x2="1050" y2="290" stroke="#a78bfa" stroke-width="0.6" stroke-opacity="0.22"></line>
    <line x1="1106" y1="360" x2="1180" y2="310" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.20"></line>
    <line x1="1106" y1="360" x2="1140" y2="440" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.20"></line>
    <line x1="970" y1="430" x2="880" y2="460" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.18"></line>
    <line x1="970" y1="430" x2="1000" y2="350" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.15"></line>
    <line x1="1240" y1="390" x2="1320" y2="440" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.18"></line>
    <line x1="1240" y1="390" x2="1290" y2="330" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.15"></line>
    <line x1="1050" y1="290" x2="1180" y2="310" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.15"></line>

    <circle cx="1280" cy="200" r="18" fill="#0d1121" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.4"></circle>
    <text x="1280" y="205" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="10" font-weight="600" fill="#22d3ee" opacity="0.8">AK</text>

    <circle cx="1350" cy="290" r="16" fill="#0d1121" stroke="#a78bfa" stroke-width="1" stroke-opacity="0.4"></circle>
    <text x="1350" y="295" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="10" font-weight="600" fill="#a78bfa" opacity="0.8">MR</text>

    <circle cx="1400" cy="170" r="14" fill="#0d1121" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.35"></circle>
    <text x="1400" y="175" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="9" font-weight="600" fill="#22d3ee" opacity="0.75">JP</text>

    <circle cx="1190" cy="130" r="14" fill="#0d1121" stroke="#a78bfa" stroke-width="1" stroke-opacity="0.35"></circle>
    <text x="1190" y="135" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="9" font-weight="600" fill="#a78bfa" opacity="0.75">SL</text>


    <line x1="1280" y1="200" x2="1240" y2="390" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.12" stroke-dasharray="4 4"></line>
    <line x1="1350" y1="290" x2="1320" y2="440" stroke="#a78bfa" stroke-width="0.5" stroke-opacity="0.12" stroke-dasharray="4 4"></line>

    <rect x="1240" y="130" width="120" height="34" rx="10" fill="#0d1121" stroke="#22d3ee" stroke-width="0.8" stroke-opacity="0.25" opacity="0.85"></rect>
    <rect x="1248" y="140" width="50" height="4" rx="2" fill="#22d3ee" opacity="0.25"></rect>
    <rect x="1248" y="150" width="36" height="3" rx="1.5" fill="#22d3ee" opacity="0.15"></rect>

    <rect x="1310" y="370" width="110" height="30" rx="9" fill="#0d1121" stroke="#a78bfa" stroke-width="0.8" stroke-opacity="0.22" opacity="0.85"></rect>
    <rect x="1318" y="379" width="44" height="3.5" rx="1.5" fill="#a78bfa" opacity="0.22"></rect>
    <rect x="1318" y="388" width="32" height="3" rx="1.5" fill="#a78bfa" opacity="0.13"></rect>

  
    <rect x="580" y="0" width="860" height="1" fill="#22d3ee" opacity="0.04"></rect>
    <rect x="580" y="580" width="860" height="1" fill="#22d3ee" opacity="0.04"></rect>


    <rect x="580" y="470" width="860" height="110" fill="url(#skyGrad)" opacity="0.7"></rect>
    <ellipse cx="1060" cy="480" rx="420" ry="30" fill="#22d3ee" opacity="0.04"></ellipse>

    <line x1="580" y1="480" x2="1440" y2="480" stroke="#22d3ee" stroke-width="0.5" stroke-opacity="0.12"></line>
  </svg>

  <div className={styles.heroCover}></div>
</section>

    </React.Fragment>
  );
}

export default Home;