import express from 'express'
import { getCurrentUser, getProfile, getSuggestedUser, saveProfile, search } from '../controllers/user.controller.js'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.put("/saveprofile",isAuth,upload.fields([
    {name:'profileImage',maxCount:1},
    {name:'coverImage',maxCount:1}
]),saveProfile)
userRouter.get('/profile/:userName',isAuth,getProfile)
userRouter.get('/search',isAuth,search)
userRouter.get('/suggested',isAuth,getSuggestedUser)

export default userRouter;