import { Camera, PlusCircle, X } from 'lucide-react'
import React, { useContext, useRef, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import dp from '../assets/profile.png'
import axios from 'axios'


const EditProfile = () => {
   const {userData,setUserData,edit,setEdit,serverUrl}=useContext(authDataContext)
   const [firstName,setFirstName]=useState(userData.firstName || '')
   const [lastName,setLastName]=useState(userData.lastName || '')
   const [userName,setUserName]=useState(userData.userName || '')
   const [headline,setHeadline]=useState(userData.headline || '')
   const [location,setLocation]=useState(userData.location || '')
   const [gender,setGender]=useState(userData.gender || '')
   const [loading,setLoading]=useState(false)
   const profileImage=useRef()
   const coverImage=useRef()

   const [skills,setSkills]=useState(userData.skills || [])
   const [newSkills,setNewSkills]=useState([])


   const [experience,setExperience]=useState(userData.experience || [])
   const [newExperience,setNewExperience]=useState({title:"",company:"",description:""})
   
   const [education,setEducation]=useState(userData.education || [])
   const [newEducation,setNewEducation]=useState({college:"",degree:"",fieldOfStudy:""})

   const [frontEndProfileImage,setFrontEndProfileImage]=useState(userData.profileImage || dp)
   const [backEndProfileImage,setBackEndProfileImage]=useState(null)

   const [frontEndCoverImage,setFrontEndCoverImage]=useState(userData.coverImage || null)
   const [backEndCoverImage,setBackEndCoverImage]=useState(null)

   const handleAddSkills  = (e)=>{
    e.preventDefault()
    if(newSkills && !skills.includes(newSkills)){
      setSkills([...skills,newSkills])
    }
    setNewSkills('')

   }

   const handleRemove = (skill)=>{
     if(skills.includes(skill)){
      setSkills(skills.filter(s=>s!==skill))
     }
   }

   const handleNewEducation = (e)=>{
    e.preventDefault()
    if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy ){
      setEducation([...education,newEducation])
    }
    setNewEducation({college:'',degree:'',fieldOfStudy:''})
   }

   const handleRemoveEducation = (edu)=>{
     if(education.includes(edu)){
      setEducation(education.filter(e=>e!==edu))
     }
   }

   const handleAddExperience = (e)=>{
    e.preventDefault()
    if(newExperience.title && newExperience.company && newExperience.description){
      setExperience([...experience,newExperience])
    }
    setNewExperience({title:'',company:'',description:''})
   }

   const handleRemoveExperience = (exp)=>{
    if(experience.includes(exp)){
      setExperience(experience.filter(ex=> ex !==exp))
    }
   }

   const handleProfileImage = (e)=>{
    
    const file = e.target.files[0]
    setBackEndProfileImage(file)
    setFrontEndProfileImage(URL.createObjectURL(file))
   }
   const handleCoverImage = (e)=>{
    const file = e.target.files[0]
    setBackEndCoverImage(file)
    setFrontEndCoverImage(URL.createObjectURL(file))
   }

   const handleSaveProfile = async ()=>{
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('firstName',firstName)
      formData.append('lastName',lastName)
      formData.append('userName',userName)
      formData.append('headline',headline)
      formData.append('location',location)
      formData.append('skills',JSON.stringify(skills))
      formData.append('education',JSON.stringify(education))
      formData.append('experience',JSON.stringify(experience))
      if(backEndProfileImage){
        formData.append('profileImage',backEndProfileImage)
      }
      if(backEndCoverImage){
        formData.append('coverImage',backEndCoverImage)
      }

      const result = await axios.put(serverUrl+'/api/user/saveprofile',formData,{withCredentials:true})
      setUserData(result.data)
      setEdit(false)
      setLoading(false)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
   }

  return (
    <div className='w-full h-full fixed top-0 z-100 flex items-center justify-center'>
      
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>


     <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>
      <div className='w-[90%] max-w-125 h-160 bg-white absolute z-200 rounded-md shadow-lg p-2 overflow-auto'
       >
         <div><X className='absolute top-4 font-bold right-4 w-6 h-6 cursor-pointer' onClick={()=>setEdit(false)}/></div>
         <div className='w-full h-35 bg-gray-500 rounded-lg mt-10' onClick={()=>coverImage.current.click()}>
          <img src={frontEndCoverImage} alt=""  className='w-full h-full'/>
          <Camera className=' absolute right-5 top-14 w-8 h-8 text-white '/>
         </div>
          <div className='w-16 h-16 rounded-full overflow-hidden absolute top-36 ml-8' onClick={()=>profileImage.current.click()}>
          <img src={frontEndProfileImage} alt="" className='w-full h-full'/>
          </div>
           <div className='w-5 h-5 z-30 absolute top-43 left-22 bg-[#17c1ff] font-bolder cursor-pointer text-white rounded-3xl border-none '>
            <PlusCircle/>
          </div>

          <div className='w-full flex flex-col items-center justify-center gap-5 mt-20'>
            <input type="text" placeholder='firstName' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
            <input type="text" placeholder='lastName' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
            <input type="text" placeholder='userName' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={userName} onChange={(e)=>setUserName(e.target.value)}/>
            <input type="text" placeholder='headline' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
            <input type="text" placeholder='location' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={location} onChange={(e)=>setLocation(e.target.value)}/>
            <input type="text" placeholder='gender' className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xl border-2 rounded-lg'
            value={gender} onChange={(e)=>setGender(e.target.value)}/>

            {/* Skills  */}
            <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
              <h1 className='text-xl font-semibold'>Skills</h1>
              {skills && <div>
                {skills.map((skill,index)=>(
                  <div key={index} className='w-full h-10 border border-gray-600 bg-gray-200 p-4 flex items-center justify-between rounded-2xl mt-2'>{skill} <div className=' cursor-pointer '><X onClick={()=>handleRemove(skill)}/></div> </div>
                ))}
                </div>}
                <div className=''>
                  <input type="text" placeholder='Add new Skill' 
                  value={newSkills} onChange={(e)=>setNewSkills(e.target.value)}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg'/>
                  <button onClick={handleAddSkills} className='w-full h-10 rounded-full border-2 border-[#2dc0ff] cursor-pointer mt-5'>Add Skill</button>
                </div>
            </div>

             {/* Education  */}
            <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
              <h1 className='text-xl font-semibold'>Education</h1>
              {education && <div>
                {education.map((edu,index)=>(
                  <div key={index} className='w-full  border border-gray-600 bg-gray-200 p-4 flex items-center justify-between rounded-2xl mt-2'>
                    <div>
                      <div>College: {edu.college}</div>
                      <div>Degree: {edu.degree}</div>
                      <div>FieldOfStudy: {edu.fieldOfStudy}</div>
                    </div> <div className=' cursor-pointer '><X onClick={()=>handleRemoveEducation(edu)}/></div> </div>
                ))}
                </div>}
                <div className=' mt-4'>

                  <input type="text" placeholder='College' 
                  value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <input type="text" placeholder='degree' 
                  value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <input type="text" placeholder='fieldOfStudy' 
                  value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <button onClick={handleNewEducation} className='w-full h-10 rounded-full border-2 border-[#2dc0ff] cursor-pointer mt-5'>Add </button>
                </div>
            </div>

             {/* Experience  */}
            <div className='w-full p-2.5 border-2 border-gray-600 flex flex-col gap-2.5 rounded-lg'>
              <h1 className='text-xl font-semibold'>Experience</h1>
              {experience && <div>
                {experience.map((exp,index)=>(
                  <div key={index} className='w-full  border border-gray-600 bg-gray-200 p-4 flex items-center justify-between rounded-2xl mt-2'>
                    <div>
                      <div>Title: {exp.title}</div>
                      <div>Company {exp.company}</div>
                      <div>Description: {exp.description}</div>
                    </div> <div className=' cursor-pointer '><X onClick={()=>handleRemoveExperience(exp)}/></div> </div>
                ))}
                </div>}
                <div className=' mt-4'>

                  <input type="text" placeholder='title' 
                  value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <input type="text" placeholder='company' 
                  value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <input type="text" placeholder='description' 
                  value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})}
                  className='w-full h-10 outline-none border-gray-400 px-4 py-3 text-xs border-2 rounded-lg mt-2'/>

                  <button onClick={handleAddExperience} className='w-full h-10 rounded-full border-2 border-[#2dc0ff] cursor-pointer mt-5'>Add </button>
                </div>
            </div>

            <button onClick={handleSaveProfile} disabled={loading} className='w-full h-10 rounded-full bg-[#24b2ff] mt-5 text-white cursor-pointer'>
             {loading ? "Saving...":" Save Profile"}
            </button>
          </div>
      </div>
    </div>
  )
}

export default EditProfile