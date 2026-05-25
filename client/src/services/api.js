import axios from "axios"; // HTTP Request Maker

const BASE_URL = "http://localhost:3000/api";
// const BASE_URL = "http://localhost:3000/";

// User Login

export const userLogin = async(data) => {
    try{
        const response = await axios.post(
            `${BASE_URL}/login`,
            data
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
            `${BASE_URL}/register`,
            data
        );

        return response.data
    }
    catch(error){
        console.error(`Error in calling User Registration API ${error}`)
        throw error;
    }
}

