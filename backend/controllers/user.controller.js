import uploadToCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser = async (req,res)=>{
    try {
        const id= req.userId
        const user = await User.findById(id).select('-password')
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return  res.status(500).json({message:`Current User ${error}`})
    }
}

export const saveProfile = async (req,res)=>{
    try {
        const {firstName,lastName,userName,headline,location,gender}=req.body
        let education = req.body.education?JSON.parse(req.body.education):[]
        let skills = req.body.skills?JSON.parse(req.body.skills):[]
        let experience = req.body.experience?JSON.parse(req.body.experience):[]
        let profileImage;
        let coverImage
        if(req.files.profileImage){
            profileImage = await uploadToCloudinary(req.files.profileImage[0].path)
        }
        if(req.files.coverImage){
            coverImage=await uploadToCloudinary(req.files.coverImage[0].path)
        }
        const user = await User.findByIdAndUpdate(req.userId,{
            firstName,lastName,userName,headline,location,gender,skills,education,experience,profileImage,coverImage
        },{new:true}).select('-password')
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return  res.status(500).json({message:`Save profile ${error}`})
    }
}

export const getProfile = async (req,res)=>{
    try {
        let {userName} = req.params
        let user = await User.findOne({userName}).select('-password')
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(`getProfle error ${error}`)
    }
}

export const search = async (req,res)=>{
    try {
        const {query}=req.query
        if(!query){
            return res.status(404).json({message:"query is required"})
        }
        const user = await User.find({
            $or:[
                {firstName:{$regex:query,$options:'i'}},
                {lastName:{$regex:query,$options:'i'}},
                {userName:{$regex:query,$options:'i'}},
                {skills:{$in:[query]}},
            ]
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`search error ${error}`})
    }
}


export const getSuggestedUser = async (req,res)=>{
    try {
        const currentUser = await User.findById(req.userId).select('connection')
        const suggestedUsers = await User.find({
            _id:{

                $ne:currentUser,$nin:currentUser.connection
            }
        }).select('-password')
        return res.status(200).json(suggestedUsers)
    } catch (error) {
        return res.status(500).json({message:`getSuggestedUser error ${error}`})
    }
}