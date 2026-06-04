const axios = require("axios");

async function geoLocationTracker(ipAddress) {
    try {

        // Use only in Development Mode to fetch Public IP
        // const fetchPublicIp = await fetch("https://api.ipify.org?format=json");
        // const publicIp = await fetchPublicIp.json();
        // console.log(publicIp);

        const locationFetchUrl = `https://ipinfo.io/${ipAddress}/json`
        console.log("[*] Fetching User Location from IP Address ");
        const response = await axios.get(locationFetchUrl);

        console.log(`[*] GeoIP Details for ${ipAddress} are \n `)
        console.log(response.data);

        return response.data;
    }
    catch (error) {
        console.error(
            "[*] Error fetching GeoIP Details:",
            error.response?.data || error.message
        );
        return error?.response?.data || error?.message;
    }

}

module.exports = geoLocationTracker;