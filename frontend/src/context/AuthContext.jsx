import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const authDataContext = createContext()
import {io} from 'socket.io-client'

export let socket = io('https://linkedin-backend-lny3.onrender.com')


const AuthContext = ({children}) => {
    const serverUrl = 'https://linkedin-backend-lny3.onrender.com'
    const [userData,setUserData]=useState(null)
    const [edit,setEdit]=useState(false)
    const [postData,setPostData]=useState([])
    const navigate = useNavigate()
    const [profileData,setProfileData]=useState([])


    const getCurrentuUser = async ()=>{
        try {
            const result = await axios.get(serverUrl+'/api/user/currentuser',{withCredentials:true})
            setUserData(result.data)
        } catch (error) {
            console.log('Get current user error')
        }
    }

    const getPost = async ()=>{
        try {
            const result = await axios.get(serverUrl+'/api/post/all',{withCredentials:true})
            setPostData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

const handleGetProfile = async (userName) => {
  try {
   
    const result = await axios.get(serverUrl+`/api/user/profile/${userName}`,{withCredentials:true})
    
    setProfileData(result.data);

    
    navigate('/profile');

  } catch (error) {
    console.log(error)
  }
};



    useEffect(()=>{
        getPost()
        getCurrentuUser()
    },[])
    
    const value = {
        serverUrl,userData,setUserData,navigate,edit,setEdit,postData,setPostData,getPost,profileData,setProfileData,handleGetProfile
    }


  return (
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
