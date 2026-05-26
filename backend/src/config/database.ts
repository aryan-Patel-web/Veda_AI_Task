import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})

export const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.DB_URL as string)
        console.log("Connected to DB Successfully", connectionInstance.connection.host)

    }catch(err){
        console.log("Db connection failed")
        console.log(err)
        process.exit(1);
    }
}