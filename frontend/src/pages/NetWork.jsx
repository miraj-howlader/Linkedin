import React from 'react'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import dp from '../assets/profile.png'
import { LuCircleCheck } from "react-icons/lu";
import { GoXCircle } from "react-icons/go";
import { X } from 'lucide-react'

const NetWork = () => {
    const {serverUrl}=useContext(authDataContext)
    const [connections,setConnections]=useState([])

    const handleGetRequests = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
            setConnections(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptConnection = async (requestId)=>{
        try {
            const result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true})
            setConnections(connections.filter((con)=>con._id==requestId))
        } catch (error) {
            console.log(error)
        }
    }

     const handleRejectConnection = async (requestId)=>{
        try {
            const result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true})
            setConnections(connections.filter((con)=>con._id==requestId))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        handleGetRequests()
    },[])


  return (
    <div className='w-screen h-screen bg-[#f0efe7] pt-23 flex flex-col p-5 items-center'>
        <Navbar/>
        <div className='w-full h-25 bg-white  shadow-lg rounded-lg flex items-center p-2.5 text-xl text-gray-600'>
            Invitations {connections.length}
        </div>

        {connections.length > 0 && <div className='w-full max-w-[80%] shadow-lg rounded-lg flex flex-col gap-5 min-h-25'>
            {connections.map((connection,index)=>(
                <div key={index}>
                    <div className='w-full min-h-25 flex justify-between gap-4 items-center cursor-pointer'>
                         <div className='w-12 h-12 rounded-full overflow-hidden ml-4'>
                                <img src={connection.sender.profileImage || dp} alt="" className='w-full h-full'/>
                              
                            </div>
                           
                     <div className='flex justify-start'>{connection.sender.firstName} {connection.sender.lastName}</div>
                      <div className=' flex justify-between text-2xl mr-8 gap-5 '>
                        <button onClick={()=>handleAcceptConnection(connection._id)} className='text-blue-500 text-2xl cursor-pointer'><LuCircleCheck/></button>
                        <button onClick={()=>handleRejectConnection(connection._id)} className='text-red-600 text-2xl cursor-pointer'><GoXCircle/></button>
                        
                    </div>
                    </div>
                   
                    <div>
                    </div>
                </div>
            ))}
        </div>}
    </div>
  )
}

export default NetWork