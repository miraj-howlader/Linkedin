import Notification from "../models/notification.js"

export const getNotification = async (req,res)=>{
    try {
        const notification = await Notification.find({receiver:req.userId})
        .populate('relatedUser','firstName lastName profileImage')
        .populate('relatedPost','image description')

        return res.status(200).json(notification)
    } catch (error) {
        return res.status(500).json({message:`getNotification error ${error}`})
    }
}
export const deleteNotification = async (req,res)=>{
    try {
        const {id}=req.params;
         await Notification.findOneAndDelete({
            _id:id,
            receiver:req.userId
         })

        return res.status(200).json({message:'Notification Deleted successfully'})
    } catch (error) {
        return res.status(500).json({message:`DeletedNotification error ${error}`})
    }
}

export const clearAllNotification = async (req,res)=>{
    try {
    
         await Notification.deleteMany({
            receiver:req.userId
         })
        return res.status(200).json({message:'clearAllNotification Deleted successfully'})
    } catch (error) {
        return res.status(500).json({message:`clearAllNotification error ${error}`})
    }
}