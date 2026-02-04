import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { authDataContext } from './context/AuthContext'
import NetWork from './pages/NetWork'
import Profile from './pages/Profile'
import Notificaton from './pages/Notificaton'

const App = () => {
  const {userData}=useContext(authDataContext)

  return (
    <div>
      <Routes>
        <Route path='/' element={userData ? <Home/>: <Navigate to={'/login'}/>}/>
        <Route path='/signup' element={userData ? <Navigate to={'/'}/>:<SignUp/>}/>
        <Route path='/login' element={userData ? <Navigate to={'/'}/>:<Login/>}/>
        <Route path='/network' element={userData ? <NetWork/>: <Navigate to={'/login'}/>}/>
        <Route path='/profile' element={userData ? <Profile/>: <Navigate to={'/login'}/>}/>
        <Route path='/notification' element={userData ? <Notificaton/>: <Navigate to={'/login'}/>}/>
      </Routes>
    </div>
  )
}

export default App