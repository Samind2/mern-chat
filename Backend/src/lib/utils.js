import jwt from "jsonwebtoken"; // Importing jwt to generate token
import dotenv from "dotenv";
dotenv.config(); // Importing dotenv to use environment variables
const secret = process.env.JWT_SECRET; // Getting secret key from environment variable
const node_mode = process.env.NODE_ENV; // Getting node mode from environment variable

// Function to generate token
export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, secret,{
        expiresIn:"1d"
    }) // Using jwt.sign() to generate token
    console.log("Generated Token:", token); // ดูค่าของ token

    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000, // Setting cookie expiry time to 1 day in milliseconds
        httpOnly: true, // Setting cookie to be HTTP only XSS Attacks
        sameSite: "strict", // CSRF Attacks
        secure: node_mode !== "development", // Setting cookie to be sent only over HTTPS ถ้าขึ้นออนไลน์ให้เป็น true หรือ Production
    }) // Setting token in cookie

    console.log("Token generated and set in cookie"); 
    return token; // Returning token
    
};