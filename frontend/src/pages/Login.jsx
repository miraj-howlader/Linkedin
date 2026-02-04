import React, { useContext } from 'react'
import { useState } from 'react'
import {Eye,EyeOffIcon, Loader} from 'lucide-react'
import axios from 'axios'
import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'



const Login = () => {
   
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [show,setShow]=useState(false)
    const [isSpinning,setIsSpinning]=useState(false)
    const [error,setError]=useState('')
    const {serverUrl,navigate,setUserData}=useContext(authDataContext)


    const handleLogin = async (e)=>{
      e.preventDefault()
       setIsSpinning(true)
      try {
        const result = await axios.post(serverUrl+'/api/auth/login',{email,password},{withCredentials:true})
        setUserData(result.data)
        navigate('/')
        setIsSpinning(false)
        setEmail("")
        setPassword('')
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

      <form onSubmit={handleLogin} className='w-[90%] max-w-100 h-150 md:shadow-xl flex flex-col justify-center items-center gap-5 p-4 rounded-2xl'>
         <h1 className='text-gray-800 font-semibold text-3xl'>Welcome to Login</h1>
         
        
         
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

        <button className='w-full px-4 py-2 border border-gray-500 outline-none rounded-md bg-blue-400 text-white cursor-pointer'>{isSpinning ? " Loading...":"Login"}</button>

        <Link to={'/signup'}>
        <p>Don't have an account? <span className='text-green-700 font-bold hover:underline'>Signup</span></p></Link>
      </form>
    </div>
  )
}

export default Login