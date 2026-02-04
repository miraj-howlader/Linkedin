import React, { useContext } from 'react'
import { useState } from 'react'
import {Eye,EyeOffIcon, Loader} from 'lucide-react'
import axios from 'axios'
import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'



const SignUp = () => {
    const [firstName,setFirstName]=useState('')
    const [lastName,setLastName]=useState('')
    const [userName,setUserName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [show,setShow]=useState(false)
    const [isSpinning,setIsSpinning]=useState(false)
    const [error,setError]=useState('')
    const {serverUrl,setUserData,navigate}=useContext(authDataContext)


    const handleSignUp = async (e)=>{
      e.preventDefault()
       setIsSpinning(true)
      try {
        const result = await axios.post(serverUrl+'/api/auth/register',{firstName,lastName,userName,email,password},{withCredentials:true})
        setUserData(result.data)
        navigate('/')
        setIsSpinning(false)
        setLastName('')
        setFirstName('')
        setEmail("")
        setPassword('')
        setUserName('')
        setError(null)
      } catch (error) {
        setIsSpinning(false)
        setError(error.response?.data.message)
        
        
      }

    }



  return (
    <div className='w-full h-screen bg-white flex flex-col items-center justify-start gap-2.5'>
      <div className='lg:p-8 p-10 w-full items-center'>
        <img src={Logo} alt="" className='w-30'/>
      </div>

      <form onSubmit={handleSignUp} className='w-[90%] max-w-100 h-150 md:shadow-xl flex flex-col justify-center items-center gap-5 p-4 rounded-2xl'>
         <h1 className='text-gray-800 font-semibold text-3xl'>Sign Up</h1>
         <input type="text" placeholder='firstName' required 
         className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md'
         value={firstName}
         onChange={(e)=>setFirstName(e.target.value)}
         
         />
         <input type="text" placeholder='lastName' required 
         className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md'
         value={lastName}
         onChange={(e)=>setLastName(e.target.value)}
         
         />
         <input type="text" placeholder='userName' required 
         className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md'
         value={userName}
         onChange={(e)=>setUserName(e.target.value)}
         
         />
         <input type="email" placeholder='email' required 
         className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md'
         value={email}
         onChange={(e)=>setEmail(e.target.value)}
         
         />
        <div className=' w-full relative'>
        <input type={show ?"text":"password"} placeholder='password' required 
         className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md'
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
         
         />
         {show ? <EyeOffIcon className=' absolute right-3  top-2' onClick={()=>setShow(!show)}/>:<Eye className=' absolute right-3  top-2 ' onClick={()=>setShow(!show)}/>}
        </div>

        {error && <p className='text-red-500'>{error}</p>}

        <button className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md bg-blue-400 text-white cursor-pointer'>{isSpinning ? " Loading...":"Sign Up"}</button>

        <Link to={'/login'}>
        <p>Already have an account? <span className='text-green-700 font-bold hover:underline'>Login</span></p></Link>
      </form>
    </div>
  )
}

export default SignUp