import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Camera, Pen, PlusCircle } from 'lucide-react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import EditProfile from '../components/EditProfile'
import Post from '../components/Post'
import dp from '../assets/profile.png'
import ConnectionButton from '../components/ConnectionButton'

const Profile = () => {
    const {userData,setEdit,edit,postData,profileData}=useContext(authDataContext)
    
    const [profilePost,setProfilePost]=useState([])

    useEffect(()=>{
        setProfilePost(postData.filter((post)=>post.author._id==profileData._id))
    },[profileData])


  return (
    <div className='w-full min-h-screen bg-[#f0efe7] flex flex-col items-center mt-40 pb-40'>
        <Navbar/>
        {edit && <EditProfile/>}
        <div className='w-full  max-w-225 min-h-screen flex flex-col gap-2.5'>

       <div className=' relative bg-white pb-6 rounded-lg shadow-lg'>
         <div className='w-full h-25 bg-gray-300 rounded overflow-hidden  flex items-center justify-center cursor-pointer'>
        <img src={profileData.coverImage || ""} alt="" className='w-full h-full' />
        <Camera className=' absolute right-5 top-5 w-8 h-8 text-white '/>
       </div>
       
        <div className='w-16 h-16 rounded-full overflow-hidden -mt-10 ml-6 items-center justify-center absolute cursor-pointer'>
          <img src={profileData.profileImage || dp} alt="" className='h-full'/>
         
          </div>
           <div className='w-5 h-5 z-30 absolute top-23 left-18 bg-[#17c1ff] font-bolder cursor-pointer text-white rounded-3xl border-none '>
            <PlusCircle/>
          </div>
          <div  className=' mt-6 ml-6 text-gray-500 font-semibold text-lg'>
            <div>{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div>{`${profileData.headline || ""}`}</div>
            <div className='text-xs'>{`${profileData.location}`}</div>
            <div className='text-xs'>{`${profileData.connection?.length} connection`}</div>
          </div>
          {profileData._id==userData._id && <button className='min-w-38 h-10 mx-4 mt-4 rounded-full border-2 border-[#2dc0ff] cursor-pointer  items-center justify-center flex' onClick={()=>setEdit(true)}>
            Edit Profile <Pen className='inline-block ml-2'/>
          </button>}
          {profileData._id!=userData._id && <div className='mt-2 ml-3'><ConnectionButton userId={profileData._id}/></div>}
      </div>

      <div className='w-full h-25 flex items-center p-5 text-xl text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
        {`Post (${profilePost.length})`}
      </div>
        {profilePost.map((post,index)=>(
            <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
        ))}

       {profileData.skills.length> 0 && <div className='w-full min-h-25 flex p-5  font-semibold bg-white shadow-lg rounded-lg flex-col '>
        <div className='text-xl text-gray-600 gap-3'>
         Skills
        </div>
        <div className='flex flex-wrap justify-start items-center gap-6 text-gray-600'>
          {profileData.skills.map((skill)=>(
          <div>{skill}</div>
        ))}
         {profileData._id==userData._id && <button className='min-w-38 h-10 mx-4  rounded-full border-2 border-[#2dc0ff] cursor-pointer  items-center justify-center flex' onClick={()=>setEdit(true)}>
            Add Skills <PlusCircle className='inline-block ml-2'/>
          </button>}
        </div>
        </div>}

        {profileData.education.length> 0 && <div className='w-full min-h-25 flex p-5  font-semibold bg-white shadow-lg rounded-lg flex-col '>
        <div className='text-xl text-gray-600 gap-3'>
         Education
        </div>
        <div className='flex flex-col justify-start items-start text-gray-600'>
          {profileData.education.map((edu)=>(
          <>
            <div>College: {edu.college}</div>
          <div>Degree: {edu.degree}</div>
          <div>FieldOfStudy: {edu.fieldOfStudy}</div>
          </>
        ))}
       {profileData._id==userData._id && <button className='min-w-38 h-10 mx-4 mt-4 p-4  rounded-full border-2 border-[#2dc0ff] cursor-pointer  items-center justify-center flex' onClick={()=>setEdit(true)}>
            Add Education <PlusCircle className='inline-block ml-2'/>
          </button>}
        </div>
        </div>}

         {profileData.experience.length> 0 && <div className='w-full min-h-25 flex p-5  font-semibold bg-white shadow-lg rounded-lg flex-col '>
        <div className='text-xl text-gray-600 gap-3'>
         Experience
        </div>
        <div className='flex flex-col justify-start items-start text-gray-600'>
          {profileData.experience.map((exp)=>(
          <>
            <div>Title: {exp.title}</div>
          <div>Company: {exp.company}</div>
          <div>Description: {exp.description}</div>
          </>
        ))}
       {profileData._id==userData._id && <button className='min-w-38 h-10 mx-4 mt-4 p-4  rounded-full border-2 border-[#2dc0ff] cursor-pointer  items-center justify-center flex' onClick={()=>setEdit(true)}>
            Add Experience <PlusCircle className='inline-block ml-2'/>
          </button>}
        </div>
        </div>}
      </div>
        </div>
    
  )
}

export default Profile