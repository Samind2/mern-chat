import jwt from "jsonwebtoken"; // Importing jwt to generate token
import dotenv from "dotenv";
dotenv.config(); // Importing dotenv to use .env
const secret = process.env.JWT_SECRET; // Getting secret key from .env
const node_mode = process.env.NODE_ENV; // Getting node mode from .env

// ความสำคัญของLID นี้
// ใช้ สร้าง Token สำหรับยืนยันตัวตนของผู้ใช้
// ใช้ เก็บ Token ลงใน Cookie เพื่อให้ผู้ใช้สามารถล็อกอินได้โดยไม่ต้องใส่รหัสผ่านซ้ำ
// ใช้ เพิ่มความปลอดภัย โดยป้องกัน XSS และ CSRF Attacks
// ใช้ กำหนดอายุของ Token ให้หมดอายุอัตโนมัติหลังจาก 1 วัน

// Function to generate token
export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, secret,{
        expiresIn:"1d"
    }) // Using jwt.sign() to generate token
    console.log("Generated Token:", token); // ดูค่าของ token

    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000, // Setting cookie expiry time to 1 day in milliseconds
        httpOnly: true, // Setting cookie to be HTTP only XSS Attacks กำหนดให้ Cookie สามารถเข้าถึงได้ผ่าน HTTP เท่านั้น (ป้องกัน XSS Attacks)
        sameSite: "strict", // CSRF Attacks กำหนดให้ Cookie ถูกส่งไปเฉพาะกับ request ที่มาจากต้นทางเดียวกัน (ป้องกัน CSRF Attacks)
        secure: node_mode !== "development", // Setting cookie to be sent only over HTTPS ถ้าขึ้นออนไลน์ให้เป็น true หรือ Production  //Cookie จะถูกส่งผ่าน HTTPS เท่านั้นเมื่อระบบอยู่ในโหมด Production
    }) // Setting token in cookie

    console.log("Token generated and set in cookie"); 
    return token; // Returning token
    
};