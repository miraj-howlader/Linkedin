import mongoose from "mongoose"

const connectToDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected Successfully')
    } catch (error) {
        process.exit(1)
    }
}

export default connectToDB