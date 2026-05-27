import axios from "axios"; // HTTP Request Maker

const BASE_URL = "http://192.168.0.195:3000";
// const BASE_URL = "http://localhost:3000/";

// User Login

export const userLogin = async(data) => {
    try{
        console.log("data", data)
        const response = await axios.post(
            `${BASE_URL}/auth/login`,
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
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            data
        );

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error}`)
        throw error;
    }
}

// All Chatrooms

export const listChatrooms = async(data) => {
    try{
        const response = await axios.get(
            `${BASE_URL}/room/all`);

            console.log("GET ROOMS FRONTEND")

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error}`)
        throw error;
    }
}



