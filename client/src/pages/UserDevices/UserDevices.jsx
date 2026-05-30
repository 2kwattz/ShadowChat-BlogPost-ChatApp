import React, {useState,useEffect} from "react"
import { fetchUserDevices } from "../../services/api"

const UserDevices = () => {

    const [userDevices,setUserDevices] = useState("")

    useEffect(()=>{
    const fetchUserDevicesData = async () => {

        try{
            const response = await fetchUserDevices();
            console.log("User Devices API Response from page ",response)
            setUserDevices(response)


        }

        catch(error){
            console.log(`Error in fetching user profile ${error || error.response.data}`)
            return  error.response.data
        }


    }
        fetchUserDevicesData()
        
    },[])


    useEffect(()=>{
        console.log("USER Devices Details ",userDevices)
    },[userDevices])

    return(
        <h1> User Devices </h1>
    )
}

export default UserDevices