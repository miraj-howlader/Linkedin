import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { acceptConnection, getConnectedStatus, getConnectionRequest, getUserConnections, rejectedConnection, removeConnection, sendConnectionRequest } from '../controllers/connection.controller.js'


const connectionRouter = express.Router()

connectionRouter.post('/send/:id',isAuth,sendConnectionRequest)
connectionRouter.put('/accept/:connectionId',isAuth,acceptConnection)
connectionRouter.put('/reject/:connectionId',isAuth,rejectedConnection)
connectionRouter.get('/status/:userId',isAuth,getConnectedStatus)
connectionRouter.delete('/remove/:userId',isAuth,removeConnection)
connectionRouter.get('/requests',isAuth,getConnectionRequest)
connectionRouter.get('/userconnection',isAuth,getUserConnections)

export default connectionRouter