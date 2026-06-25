import networkClient from "./networkClient"; // Axios Instance

// const BASE_URL = "http://192.168.0.195:3000";
const BASE_URL = "http://localhost:3000/";

// Verify Login

export const userVerification = async() => {
    try{
        console.log("[*] Verifying User Frontend")
        const response = await networkClient.get(
            `/auth/me`,
        );

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Verification API ${error}`)
        return error.response.data;
    }
}

// User Login

export const userLogin = async(data) => {
    try{
        console.log("data", data)
        const response = await networkClient.post(
            `/auth/login`,
            data,
        );

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Login API ${error}`)
        return error.response.data;
    }
}

// User Registration

export const userRegistration = async(data) => {
    try{
        const response = await networkClient.post(
            `/auth/register`,
            data);

        console.log("/Auth/Reg data ",response)
        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error.response.data}`)
        return error.response.data
    }
}

// User Profile

export const fetchUserProfile = async(data) => {
    try{

        const response = await networkClient.get(`/auth/myprofile`);
        console.log("MyProfile API Response ",response);
        return response.data
    }
    catch(error){
        console.error("Error fetching User Profile ",error.response.data)
        return error.response.data;
    }
}

// Get User Devices

export const fetchUserDevices = async(data) => {
    try{

        const response = await networkClient.get(`/auth/mydevices`);
        console.log("My Devices API Response ",response);
        return response.data
    }
    catch(error){
        console.error("Error fetching User Profile ",error.response.data)
        return error.response.data;
    }
}

// All Chatrooms

export const getChatrooms = async(data) => {
    try{
        const response = await networkClient.get(
            `/room/all`);

            console.log("GET ROOMS FRONTEND")

        return response.data
    }
    catch(error){
        console.error(`Error in calling Get Chatroom API ${error}`)
        return error.response.data;
    }
}

// Fetch All Communities

export const getCommunities = async(data)=>{
    try{
        const response = await networkClient.get(`/community/all`);

        console.log("Get List Communities Data ",response.data)
        return response.data;

    }

    catch(error){
        console.error(`Error calling Get Communities API ${error?.message || error}`)
        return error.response.data;
    }
}

export const getIndividualCommunity = async(data) => {
    try{
        const response = await networkClient.get(`/community/${data.communitySlug}`,data);
        return response.data;
        console.log(`[*] Calling the Specific Community API ${response?.data || response}`)

    }
    catch(error){
        console.error(`Error calling Get Specific Community API ${error?.message || error}`);
        return error.response.data;
    }
}



