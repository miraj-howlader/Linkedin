import uploadToCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.js";
import Post from "../models/post.model.js";

export const createPost = async (req,res)=>{
    try {
        const {description}=req.body;
        let newPost
        if(req.file){
            let  image = await uploadToCloudinary(req.file.path)
              newPost= await Post.create({
                author:req.userId,
                description,
                image
            })
        }else{
           newPost = await Post.create({author:req.userId,description})
        }
        return res.status(201).json(newPost)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Post error ${error}`})
    }
}


export const getAllPosts = async (req,res)=>{
    try {
        const post = await Post.find()
        .populate('author','firstName lastName userName profileImage headline location')
        .populate('comment.user','firstName lastName profileImage headline location').sort({createdAt:-1})
        return res.status(200).json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`Error fetching posts ${error}`})
    }
}


export const likePost = async (req,res)=>{
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post  = await Post.findById(postId)
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        if(post.like.includes(userId)){
            post.like = post.like.filter((id)=>id!=userId)
        }else{
            post.like.push(userId)
           if(post.author !=userId){
             let notification = await Notification.create({
                receiver:post.author,
                type:'like',
                relatedUser:userId,
                relatedPost:postId
            })
           }
            
        }
        await post.save()

        io.emit('likeUpdated',{postId,likes:post.like})
        
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:`Error liking post ${error}`})
    }
}
export const commentPost = async (req,res)=>{
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const {content} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
          $push:{comment:{content,user:userId}}     
        },{new:true}).populate('comment.user','firstName lastName profileImage headline location')
          if(post.author !=userId){
            let notification = await Notification.create({
                receiver:post.author,
                type:'comment',
                relatedUser:userId,
                relatedPost:postId
            })
          }
        io.emit('commentAdded',{postId,comm:post.comment})
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:`Error commenting on post ${error}`})
    }
}