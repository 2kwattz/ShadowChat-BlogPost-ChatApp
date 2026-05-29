import React, {useState,useEffect} from "react"
import { fetchUserProfile } from "../../services/api"

const MyProfile = () => {

    const [userDetails,setUserDetails] = useState("")

    useEffect(()=>{
    const fetchMyProfileData = async () => {

        try{
            const response = await fetchUserProfile();
            console.log("MyProfile API Response from page ",response.data)
            setUserDetails(response?.data)


        }

        catch(error){
            console.log(`Error in fetching user profile ${error || error.response.data}`)
            return  error.response.data
        }


    }
        fetchMyProfileData()
        
    },[])


    useEffect(()=>{
        console.log("USER Details ",userDetails)
    },[userDetails])

    return(
        <h1> My Profile </h1>
    )
}

export default MyProfile