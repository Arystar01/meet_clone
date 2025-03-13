import mongoose from "mongoose";


const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(process.env.MONGO_URL, {
           
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
