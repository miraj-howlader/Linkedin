import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { clearAllNotification, deleteNotification, getNotification } from '../controllers/notification.controller.js'


const notificationRouter = express.Router()

notificationRouter.get('/get',isAuth,getNotification)
notificationRouter.delete('/deleteone/:id',isAuth,deleteNotification)
notificationRouter.delete('/clearall',isAuth,clearAllNotification)

export default  notificationRouter