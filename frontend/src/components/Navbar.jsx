import React from 'react'
import Logo from '../assets/linkedin2.png'
import { Bell, Home, Network, Search } from 'lucide-react'
import dp from '../assets/profile.png'
import { useState } from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useEffect } from 'react'

const Navbar = () => {
  const [activeSearch,setActiveSearch]=useState(false)
  const {userData,serverUrl,navigate,setUserData,handleGetProfile}=useContext(authDataContext)
  const [showPopup,setShowPopup]=useState(false)
  const [searchInput,setSearchInput]=useState('')
  const [searchData,setSearchData]=useState([])

  const handleLogout = async ()=>{
    try {
      const resutl = await axios.get(serverUrl+'/api/auth/logout',{withCredentials:true})
      setUserData(null)
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async ()=>{
     if (!searchInput.trim()) {
    setSearchData([]);
    return;
  }
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
      console.log(result.data)
      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error)
    }
  }

  useEffect(()=>{
   
     
        handleSearch()
    
    
  },[searchInput])


  return (
    <div className='w-full h-20 bg-white z-80 fixed shadow-md left-0 top-0 flex md:justify-around items-center justify-between p-5'>
      {/* left side  */}
      <div className='flex justify-center items-center gap-2.5 cursor-pointer' onClick={()=>navigate('/')}>
         <div onClick={()=>setActiveSearch(false)}>

        <img src={Logo} alt="" className='w-13'/>
       </div>

       {!activeSearch && <div><Search className='w-6 h-6 text-gray-600 lg:hidden' onClick={()=>setActiveSearch(true)}/></div>}

       <form className={` w-50px lg:w-78 h-10 bg-[#eeece2] lg:flex items-center gap-2.5 px-4 py-2 rounded-md ${!activeSearch ? "hidden":"flex"}`}>

       {searchData.length > 0 && <div className=' absolute top-22 overflow-auto min-h-25 left-0 lg:left-40 shadow-lg w-full lg:w-175 bg-white flex flex-col gap-5'>
          {searchData.map((search,index)=>(
            <div key={index} className=' flex gap-5 items-center border-b-2 border-gray-200 p-2.5
             hover:bg-gray-100 cursor-pointer rounded-lg' onClick={()=>handleGetProfile(search.userName)}>
                <div className='w-16 h-16 rounded-full overflow-hidden'>
            <img src={search.profileImage || dp} alt="" className='w-full h-full'/>
        </div>
        <div className='text-xl font-semibold'>{`${search.firstName} ${search.lastName}`}</div>
        <div className='text-xl font-semibold'>{` ${search.headline}`}</div>
            </div>
          ))}
        </div>}
         
        <div><Search className='w-6 h-6 text-gray-600'/></div>
        <input type="text" className='w-[80%] h-full bg-transparent outline-none border-0'
        placeholder='Search users...'
        value={searchInput}
        onChange={(e)=>setSearchInput(e.target.value)}
        />
       </form>
      </div>

      {/* Right side  */}
     <div className='flex justify-center gap-5 items-center cursor-pointer'>
      {/* POpup start  */}

     {showPopup &&  <div className='w-75 min-h-80 bg-white shadow-lg mt-5 absolute top-18 right-0 lg:right-14  rounded-md flex flex-col items-center p-5 gap-5'>
         <div className='w-16 h-16 rounded-full overflow-hidden'>
        <img src={userData.profileImage || dp} alt="" className='w-full h-full'/>
        </div>
        <div className='text-xl font-semibold'>{`${userData.firstName} ${userData.lastName}`}</div>
        <button className='w-full h-10 rounded-full border-2 border-[#2dc0ff] cursor-pointer' onClick={()=>handleGetProfile(userData.userName)}>View Profile</button>
        <div className='w-full h-0.5 bg-gray-200'></div>
         <div className='flex  items-center justify-start w-full gap-2.5' onClick={()=>navigate('/network')}><Network/>My Network</div>
         <button onClick={handleLogout} className='w-full h-10 rounded-full border-2 border-red-400 cursor-pointer'>Logout</button>
      </div>}
     {/* POpup end  */}

       <div className='lg:flex flex-col items-center justify-center hidden' onClick={()=>navigate('/')}><Home/>Home</div>
      <div className='lg:flex flex-col items-center justify-center hidden' onClick={()=>navigate('/network')}><Network/>My Network</div>
      <div className='flex flex-col items-center justify-center'><Bell/> <div className=' hidden md:block' onClick={()=>navigate('/notification')}>Notification</div></div>
      <div className='w-12 h-12 rounded-full overflow-hidden' onClick={()=>setShowPopup(!showPopup)}>
        <img src={userData.profileImage || dp} alt="" className='w-full h-full'/>
      </div>
     </div>
      
    </div>
  )
}

export default Navbar