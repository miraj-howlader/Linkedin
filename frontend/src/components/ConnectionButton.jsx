import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'

import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useState } from 'react'
const socket = io('https://linkedin-backend-lny3.onrender.com')

const ConnectionButton = ({userId}) => {
     const {serverUrl,userData,navigate}=useContext(authDataContext)
     const [status,setStatus]=useState()

    const handleSendConnection = async ()=>{
        try {
            const result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,{},{withCredentials:true})
            console.log(result.data)
        } catch (error) {
         console.log(error)   
        }
    }
     const handleRemoveConnection = async ()=>{
        try {
            const result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{withCredentials:true})
            console.log(result.data)
        } catch (error) {
         console.log(error)   
        }
    }

     const handleGetConnection = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/connection/status/${userId}`,{withCredentials:true})
            setStatus(result.data.status)
            console.log(result.data)
        } catch (error) {
         console.log(error)   
        }
    }

    useEffect(()=>{
      socket.emit('register',userData._id)
      handleGetConnection()

      socket.on('statusUpdate',({updatedUserId,newStatus})=>{
        if(updatedUserId===userId){
            setStatus(newStatus)
        }
      })
    },[userId])

    

    const hanldeClick = async ()=>{
        if(status=='disconnect'){
            await handleRemoveConnection()
        }else if(status=='received'){
         navigate('/network')
        }else{
         await handleSendConnection()
        }
    }



  return (
    <button onClick={hanldeClick} className='w-35 h-8 px-6 cursor-pointer rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' disabled={status=='pending'}>
       {status}
    </button>
  )
}

export default ConnectionButton
