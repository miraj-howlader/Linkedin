import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'

export const register = async (req,res)=>{
    try {
        const {firstName,lastName,userName,email,password} = req.body
        if(!firstName || !lastName || !userName || !email || !password){
            return res.status(400).json({message:"All field are required!"})
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User all ready exists!"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 8 character"})
        }
        const hassedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            firstName,lastName,userName,email,password:hassedPassword
        })
        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`Register error ${error}`})
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body
        if( !email || !password){
            return res.status(400).json({message:"All field are required!"})
        }
        const user= await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

       
        const matchPassword = await bcrypt.compare(password,user.password)

         if(!matchPassword){
            return res.status(400).json({message:"Invalid Credentials"})
         }
        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Logout error ${error}`})
    }
}