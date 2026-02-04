import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import dp from '../assets/profile.png'
import { Camera, Image, Pen, PlusCircle, X } from 'lucide-react'
import { authDataContext } from '../context/AuthContext'
import EditProfile from '../components/EditProfile'
import { useRef } from 'react'
import axios from 'axios'
import Post from '../components/Post'
import { useEffect } from 'react'

const Home = () => {
  const {userData,edit,serverUrl,setEdit,postData,handleGetProfile }=useContext(authDataContext)
  const [frontEndImage,setFrontEndImage]=useState('')
  const [backEndImage,setBackEndImage]=useState('')
  const [description,setDescription]=useState('')
  const [uploadPost,setUpLoadPost]=useState(false)
  const [loading,setLoading]=useState(false)
  const [suggestedUser,setSuggestedUser]=useState([])
  const postImage=useRef()

  const handlePostImage = (e)=>{
    const file = e.target.files[0]
    setBackEndImage(file)
    setFrontEndImage(URL.createObjectURL(file))
  }

  const handleUploadPost = async (req,res)=>{
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('description',description)
      if(backEndImage){
        formData.append('image',backEndImage)
      }
      const result = await axios.post(serverUrl+'/api/post/create',formData,{withCredentials:true})
      setDescription('')
      setFrontEndImage('')
      setUpLoadPost(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  const handleSuggestedUsers = async ()=>{
    try {
      const result = await axios.get(serverUrl+'/api/user/suggested',{withCredentials:true})
      console.log(result.data)
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    handleSuggestedUsers()
  },[])

  return (
    <div className='w-full min-h-screen bg-[#f3f2ec] pt-22 flex items-center lg:items-start justify-center gap-5 px-5  flex-col lg:flex-row relative'>
      
     {edit && <EditProfile/>}
      <Navbar/>
      {/* left side */}
      <div className='w-full lg:w-[25%] min-h-50 bg-white shadow-lg rounded-lg p-2.5 relative'>
       <div className='w-full h-25 bg-gray-300 rounded overflow-hidden  flex items-center justify-center cursor-pointer'>
        <img src={userData.coverImage || ""} alt="" className='w-full h-full' />
        <Camera className=' absolute right-5 top-5 w-8 h-8 text-white '/>
       </div>
        <div className='w-16 h-16 rounded-full overflow-hidden -mt-10 ml-6 items-center justify-center absolute cursor-pointer'>
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
         
          </div>
           <div className='w-5 h-5 z-30 absolute top-23 left-21 bg-[#17c1ff] font-bolder cursor-pointer text-white rounded-3xl border-none '>
            <PlusCircle/>
          </div>
          <div  className=' mt-6 ml-6 text-gray-500 font-semibold text-lg'>
            <div>{`${userData.firstName} ${userData.lastName}`}</div>
            <div>{`${userData.headline || ""}`}</div>
            <div className='text-xs'>{`${userData.location}`}</div>
          </div>
          <button className='w-full h-10 my-8 rounded-full border-2 border-[#2dc0ff] cursor-pointer  items-center justify-center flex' onClick={()=>setEdit(true)}>
            Edit Profile <Pen className='inline-block ml-2'/>
          </button>
      </div>

      {/* Popup div start  */}
    {uploadPost && <div className='w-full h-full bg-black fixed top-0 z-100 opacity-[0.5] left-0'>
       
      </div>}
     {uploadPost && <div className='w-[90%] max-w-125 top-22 h-175 bg-white shadow-lg rounded-lg fixed z-200 p-5 flex items-start justify-start flex-col gap-5'>
         <div className=' absolute top-5 right-5 cursor-pointer'>
          <X onClick={()=>setUpLoadPost(false)}/>
         </div>
        <div className='flex justify-start items-center gap-3 p-3'>
           <div className='w-16 h-16 rounded-full overflow-hidden flex items-center justify-center  cursor-pointer'>
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
          </div>
          <div className='font-bold'>{userData.firstName} {userData.lastName}</div>
        </div>
        <textarea className={`w-full ${frontEndImage ? "h-50":"h-110 "}  outline-none border-none p-2.5 resize-none   text-xl`} placeholder='what do you want to talk about...?'
        value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
         <input type="file" ref={postImage} hidden onChange={handlePostImage} />
          <div className='w-ful flex justify-center items-center'>
            <img src={frontEndImage} alt="" className='w-60' />
          </div>

        <div className='w-full h-50 flex flex-col'>
          <div onClick={()=> postImage.current.click()} className='p-5 flex items-center justify-start border-b-2'><Image className='h-10 w-10 cursor-pointer'/></div>
         
          <div className='flex justify-end'>
            <button disabled={loading} onClick={handleUploadPost} className='w-20 h-12 rounded-full bg-blue-600 mt-3 mr-3 cursor-pointer text-white'>{loading ? "Loading..." : "Post"}</button>
          </div>
        </div>
       </div>}
      {/* Popup div end */}


      {/* middle  */}
      <div className='w-full lg:w-[50%] min-h-50 bg-[#f0efe7] flex flex-col gap-5'>
        <div className='w-full  bg-white shadow-lg  flex gap-4 p-4 rounded-md'>
         <div className='w-16 h-16 rounded-full overflow-hidden flex items-center justify-center  cursor-pointer'>
          <img src={userData.profileImage || dp} alt="" className='h-full'/>
          </div>
          <button onClick={()=>setUpLoadPost(true)} className='w-[70%] h-16 border-2 border-gray-500 rounded-full justify-start flex items-center px-6 cursor-pointer hover:bg-gray-100'>Start a post</button>
        </div>
        {postData.map((post,index)=>(
          <Post key={index}
          id={post._id} 
          author={post.author} 
          description={post.description}
          image={post.image}
          like={post.like}
          comment={post.comment}
          createdAt={post.createdAt}
           />
        ))}
      </div>



      {/* right side  */}
      <div className='w-full lg:w-[25%] min-h-50 bg-white shadow-lg p-5'>
        <h1 className='text-xl text-gray-600 font-semibold'>Suggested Users</h1>
        {suggestedUser.length > 0 &&<div className='flex flex-col gap-2.5'>
          {suggestedUser.map((sugg,index)=>(
            <div key={index} className='flex items-center gap-2.5 mt-3 hover:bg-gray-200 rounded-md cursor-pointer p-2' onClick={()=>handleGetProfile(sugg.userName)}>
               <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center  cursor-pointer'>
          <img src={sugg.profileImage || dp} alt="" className='h-full'/>
          </div>
             <div>
              <div className='font-bold '>{sugg.firstName} {sugg.lastName}</div>
              <div className='font-bold text-sm'> {sugg.headline}</div>
             </div>
            </div>
          ))}
          </div>}
        {suggestedUser.length == 0 &&<div>
          No Suggested Users
          </div>}
      </div>
    </div>
  )
}

export default Home