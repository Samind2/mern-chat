import mongoose from 'mongoose';

// Connect to the database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {}); // Connect to the database using the provided URL
        console.log("MongoDB connected:" + conn.connection.host);  // Log the connection host
        
    } catch (error) {
        console.log("MongoDB connection failed", error);
        
        
    }
}