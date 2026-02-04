
import { io, userSocketMap } from "../index.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const {id}= req.params;
        const sender = req.userId;
        const user = await User.findById(sender);
        if(sender===id){
            return res.status(400).json({message:"You cannot send connection request to yourself"})
        }
        if(user.connection.includes(id)){
            return  res.status(400).json({message:"You are already connected"})
        }
        const existingConnection = await Connection.findOne({
            sender,
            receiver:id,
            status:'pending'
        })
        if(existingConnection){
            return res.status(400).json({message:"Connection request already sent"})
        }
        const newConnection = await Connection.create({
            sender,
            receiver:id
        })

        let receiverSocketId = userSocketMap.get(id)
        let senderSocketId = userSocketMap.get(sender)

        if(receiverSocketId){
            io.to(receiverSocketId).emit('statusUpdate',{updatedUserId:sender,newStatus:'received'})
        }

        if(senderSocketId){
            io.to(senderSocketId).emit('statusUpdate',{updatedUserId:id,newStatus:'pending'})
        }

        return res.status(200).json(newConnection)
    } catch (error) {
        return res.status(500).json({message:`SendConnectionRerror ${error}`})
    }
}

export const acceptConnection = async (req,res) => {
    try {
        const {connectionId}= req.params;
        const userId = req.userId
        const connection = await Connection.findById(connectionId);
        if(!connection){
            return res.status(404).json({message:"Connection request not found"})
        }
        if(connection.status !=='pending'){
            return res.status(400).json({message:"Connection request already responded"})
        }
        connection.status = 'accepted';
          let notification = await Notification.create({
                        receiver:connection.sender,
                        type:'connectionAccepted',
                        relatedUser:userId,
                    })
        await connection.save();
        await User.findByIdAndUpdate(req.userId,{
            $addToSet:{connection:connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id,{
            $addToSet:{connection:req.userId}
        })

         let receiverSocketId = userSocketMap.get(connection.receiver._id.toString())
        let senderSocketId = userSocketMap.get(connection.sender._id.toString())

        if(receiverSocketId){
            io.to(receiverSocketId).emit('statusUpdate',{updatedUserId:connection.sender._id,newStatus:'disconnect'})
        }

        if(senderSocketId){
            io.to(senderSocketId).emit('statusUpdate',{updatedUserId:req.userId,newStatus:'disconnect'})
        }

        return res.status(200).json(connection)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const rejectedConnection = async (req,res) => {
    try {
        const {connectionId}= req.params;
        const connection = await Connection.findById(connectionId);
        if(!connection){
            return res.status(404).json({message:"Connection request not found"})
        }
        if(connection.status !=='pending'){
            return res.status(400).json({message:"Connection request already responded"})
        }
        connection.status = 'rejected';
        await connection.save();
        
        return res.status(200).json({message:"Connection request rejected"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getConnectedStatus = async (req,res)=>{
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;
        const currentUser = await User.findById(currentUserId);
        if(currentUser.connection.includes(targetUserId)){
            return res.json({status:'disconnected' })
        }

        const pendingRequest = await Connection.findOne({
            $or:[
                {sender:currentUserId,receiver:targetUserId},
                {sender:targetUserId,receiver:currentUserId}],status:'pending'
        })

        if(pendingRequest){
            if(pendingRequest.sender.toString()===currentUserId.toString()){
                return res.json({status:'request' })
            }else{
                return res.json({status:'received',requestId:pendingRequest._id })
            }
        }

        return res.json({status:'connected' })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}


export const removeConnection = async (req,res)=>{
    try {
        const myId = req.userId;
        const otherUserId  = req.params.userId;

        await User.findByIdAndUpdate(myId,{$pull:{connection:otherUserId}})
        await User.findByIdAndUpdate(otherUserId,{$pull:{connection:myId}})


         let receiverSocketId = userSocketMap.get(otherUserId)
        let senderSocketId = userSocketMap.get(myId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit('statusUpdate',{updatedUserId:myId,newStatus:'connect'})
        }

        if(senderSocketId){
            io.to(senderSocketId).emit('statusUpdate',{updatedUserId:otherUserId,newStatus:'connect'})
        }
        return res.status(200).json({message:"Connection removed"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getConnectionRequest = async (req,res)=>{
    try {
        const userId = req.userId;
        const requests = await Connection.find({receiver:userId,status:'pending'})
        .populate('sender','firstName lastName email userName profileImage headline')
        return res.status(200).json(requests)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}


export const getUserConnections = async (req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById(userId)
        .populate('connection','firstName lastName email userName profileImage headline connection')
        return res.status(200).json(user.connection)
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}