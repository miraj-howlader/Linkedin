import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

const Notificaton = () => {
    const {serverUrl}=useContext(authDataContext)
    const [notificationData,setNotificationData]=useState([])

    const handlegetNotification = async ()=>{
        try {
            const result = await axios.get(serverUrl+'/api/notification/get',{withCredentials:true})
            console.log(result.data)
            setNotificationData(result.data)
            
        } catch (error) {
            console.log(error)
        }
    }

      const handleDeleteNotification = async (deleteId)=>{
        try {
            const result = await axios.delete(serverUrl+`/api/notification/deleteone/${deleteId}`,{withCredentials:true})
            console.log(result.data)
            await handlegetNotification()
            
        } catch (error) {
            console.log(error)
        }
    }

      const handleClearAllNotification = async ()=>{
        try {
            const result = await axios.delete(serverUrl+`/api/notification/clearall`,{withCredentials:true})
            
            setNotificationData(result.data)
            
        } catch (error) {
            console.log(error)
        }
    }

  function handleMessage(type){
        if(type==='like'){
            return 'like your post'
        }else if(type==='comment'){
            return 'commented your post'
        }else{
            return 'Accepted your connection'
        }
    }

    useEffect(()=>{
        handlegetNotification()
    },[])


  return (
    <div className='w-screen h-screen  pt-23 flex flex-col p-5 items-center'>
        <Navbar/>
        <div className='w-full h-25 bg-gray-400 text-white   rounded-lg flex items-center p-2.5 text-xl '>
            Notification {notificationData.length}
        </div>
       <div>
        {notificationData.length > 0 && <button className='bg-red-600 text-white px-4 py-2 mt-6 font-semibold rounded-lg cursor-pointer' onClick={handleClearAllNotification}>
            Clear all
        </button>}

       </div>
        {notificationData.length > 0 && <div className='w-full max-w-[80%] rounded-lg flex flex-col gap-5 h-full overflow-auto'>
                    {notificationData.map((notification,index)=>(
                        <div key={index} className=' shadow-lg text-gray-400 mt-5 '>
                            <div >
                            <div className='w-full min-h-25 flex justify-start gap-4 items-center cursor-pointer  mt-5'>
                                 <div className='w-12 h-12 rounded-full overflow-hidden ml-4'>
                                        <img src={notification.relatedUser.profileImage || dp} alt="" className='w-full h-full'/>
                                      
                                    </div>
                                   
                             <div className='flex justify-start font-semibold'>{notification.relatedUser.firstName} {notification.relatedUser.lastName} {handleMessage(notification.type)}</div>
                              
                            </div>

                           {notification.relatedPost && <div className='flex items-center justify-between   ml-5'>
                                <div className='w-40 h-20 overflow-hidden p-4'>
                                    <img src={notification.relatedPost.image} alt="" className='h-full' />
                                </div>
                                <div className='text-start -ml-14'>{notification.relatedPost.description}</div>
                                <div className=' flex justify-end items-center  cursor-pointer pb-20 mr-4' onClick={()=>handleDeleteNotification(notification._id)}>
                                <X className='text-5xl'/>
                            </div>
                            </div>}
                            

                           </div>
                           
                           
                        </div>
                        
                    ))}
                </div>}
                 
    </div>
  )
}

export default Notificaton