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
        throw error;
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
        throw error;
    }
}

// User Registration

export const userRegistration = async(data) => {
    try{
        const response = await networkClient.post(
            `/auth/register`,
            data
        );

        console.log("/Auth/Reg data ",response)

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error.response.data}`)
        return error.response.data
    }
}

// All Chatrooms

export const listChatrooms = async(data) => {
    try{
        const response = await networkClient.get(
            `/room/all`);

            console.log("GET ROOMS FRONTEND")

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error}`)
        throw error;
    }
}



