import React, { useContext, useEffect } from 'react'
import dp from '../assets/profile.png'
import moment from 'moment'
import { useState } from 'react'
import { AiOutlineLike,AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";





import { authDataContext, socket } from '../context/AuthContext';
import axios from 'axios';
import ConnectionButton from './ConnectionButton';

const Post = ({id,author,like,comment,description,image,createdAt}) => {
    const [more,setMore]=useState(false)
    const {serverUrl,getPost,userData,profileData,setProfileData,handleGetProfile}=useContext(authDataContext)
    const [likes,setLikes]=useState([])
    const [commentContext,setCommentContext]=useState('')
    const [comments,setComments]=useState( [])
    const [showComments,setShowComments]=useState(false)

    const likePost = async ()=>{
      try {
        const result =await axios.get(serverUrl+`/api/post/like/${id}`,{withCredentials:true})
        console.log(result.data)
        setLikes(result.data.like)
      } catch (error) {
        console.log(error)
      }
    }

    const commentPost = async (e)=>{
      e.preventDefault()
      try {
        const result = await axios.post(serverUrl+`/api/post/comment/${id}`,{content:commentContext},{withCredentials:true})
        console.log(result.data)
        setComments(result.data.comment)
        setCommentContext('')
        
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
     socket.on('likeUpdated',({postId,likes})=>{
      if(postId==id){
        setLikes(likes)
      }
     })

     socket.on('commentAdded',({postId,comm})=>{
      if(postId==id){
        setComments(comm)
      }
     })

     return ()=>{
      socket.off('likeUpdated')
      socket.off('commentAdded')
     }

    },[id])

    useEffect(()=>{
      setLikes(like)
      setComments(comment)
    },[like,comment])
   

   
  return (
    <div className='w-full min-h-50 bg-white rounded-md shadow-lg p-5 flex flex-col gap-2.5'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-center items-start gap-2.5' onClick={()=>handleGetProfile(author.userName)}>
        <div className='w-17 h-17 rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
            <img src={author.profileImage || dp} alt="" className='h-full' />

        </div>
        <div>
           <div className='font-bold'>{author.firstName} {author.lastName}</div>
           <div>{author.headline} </div>
           <div>{moment(createdAt).fromNow()} </div>
        </div>
      </div>

      {/* ConnectionButton  */}
      <div>
       {userData._id!==author._id && <ConnectionButton userId={author._id}/>}
      </div>



      </div>
      <div className={`w-full ${!more ? "max-h-25 overflow-hidden" : ""} pl-16`}>{description}</div>
      <div className=' pl-14 cursor-pointer' onClick={()=>setMore(!more)}>{!more ? "read more..." : "read less..."}</div>
      {image && <div  className='w-full overflow-hidden flex justify-center'>
        <img src={image} alt=""  className=' rounded-md h-full'/></div>}

        <div>
          <div className='w-full flex justify-between items-center p-5 border-b-2 border-gray-500'>
            
            <div  className='flex items-center justify-center gap-2 text-xl cursor-pointer'><AiOutlineLike className="w-5 h-5" /> <span>{likes.length}</span></div>

            <div className='flex items-center justify-center gap-2 text-xl cursor-pointer'> <span>{comment.length}</span><span>Comment</span></div>

          </div>
          <div className='w-full flex justify-start items-center p-5 gap-5'>
           {!likes.includes(userData._id) &&  <div onClick={likePost} className='flex items-center justify-center gap-2 text-xl cursor-pointer'>
              <AiOutlineLike className="w-5 h-5" />
              <span>Like</span>
            </div>}

           {likes.includes(userData._id) &&  <div onClick={likePost} className='flex items-center justify-center gap-2 text-xl cursor-pointer text-blue-500 font-bold'>
              <AiFillLike className="w-5 h-5" />
              <span className=''>Liked</span>
            </div>}
            <div onClick={()=>setShowComments(!showComments)} className='flex items-center justify-center gap-2 text-xl cursor-pointer'>
              <FaRegCommentDots className="w-5 h-5" />
              <span>Comment</span>
            </div>
            
          </div>

          {/* comment  */}
          {showComments && <div>
              <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-2.5'>
                <input type="text" placeholder='leave a comment' className=' outline-none border-none' 
                value={commentContext} onChange={(e)=>setCommentContext(e.target.value)}/>
                <button type='submit' onClick={commentPost}>
                  <IoIosSend className='w-8 h-8 cursor-pointer text-blue-400 font-bold'/>
                </button>
              </form>

              <div className='flex flex-col gap-2.5'>
                {comments.map((comm)=>(
                  <div key={comm._id}>
                    <div className='w-full flex justify-start items-center'>
                      <div className='w-14 mt-2 h-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                        <img src={comm.user.profileImage || dp} alt="" className='h-full' />
                      </div>
                      <div>
                        <div className='ml-3 font-bold'>{comm.user.firstName} {comm.user.lastName}</div>
                        <div className='ml-3'>{moment(comm.createdAt).fromNow()}</div>
                      </div>
                    </div>
                    <div className='ml-16 mb-5'>{comm.content}</div>
                  </div>
                ))}
              </div>
            </div>}
        </div>


    </div>
  )
}

export default Post