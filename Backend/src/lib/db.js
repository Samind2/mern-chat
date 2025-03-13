import mongoose from 'mongoose';

// Connect to the database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {}); 
        console.log("MongoDB connected:" + conn.connection.host);  
    } catch (error) {
        console.log("MongoDB connection failed", error);
        
        
    }
}