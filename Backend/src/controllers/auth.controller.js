import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from '../lib/cloudinary.js';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET; // ดึงค่าคีย์ลับของ JWT .env ที่กำหนดไว้

// สร้างฟังก์ชัน signup
export const signup = async (req, res) => {
    // รับข้อมูลจาก body ของ request ที่ส่งมา 
    const { fullName, email, password } = req.body;
    // ตรวจสอบว่ามีข้อมูลที่ส่งมาหรือไม่  ถ้าไม่มีให้ส่งข้อความว่า "All fields are required"
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        //create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        if(newUser) {
           
            const token = generateToken(newUser._id, res); //สร้าง token
            await newUser.save(); //save user to database
            console.log(token);
            
            
            res.status(201).json({ _id:newUser._id, fullName:newUser.fullName, email:newUser.email, profilePic:newUser.profilePic }); //ส่ง response กลับไปที่ client
        }else{
            res.status(400).json({ message: "Invalid user data}" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While registering a new user" });
        
    }
}

// สร้างฟังก์ชัน signin 
export const signin = async (req, res) => {
    const { email, password } = req.body;
    // ตรวจสอบว่า email และ password ถูกส่งมาหรือไม่
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password!" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // ตรวจสอบว่า password ที่ส่งมาตรงกับ password ในฐานข้อมูลหรือไม่
    const isValidPassword = await bcrypt.compare(password, user.password);
    // เช็คว่าถ้า password ไม่ตรงกัน 
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // สร้าง token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      accessToken: token, // ส่ง token ไปเมื่อLoginสำเร็จ
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error.message || "Something went wrong during login" });
  }
};

// สร้างฟังก์ชัน signout
export const signout = async (req, res) => {
    try {
        // ลบ token ออกจาก cookie
        res.clearCookie("jwt","" , {maxAge: 1});
        // ส่งข้อความว่า signout สำเร็จ
        res.status(200).json({ message: "Signout Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While signout" });
    }
}

// สร้างฟังก์ชัน updateProfile
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        //const userId = req.user._Id;
        // รับค่า id จาก params
        const {id: userId} = req.params;
        //check if profile picture is uploaded
        if(!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        //อัพโหลดรูปภาพไปยัง cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if(!uploadResponse) {
            return res.status(400).json({ message: "Error while uploading profile picture" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            {profilePic: uploadResponse.secure_url}, // อัพเดทรูปภาพใหม่
            {new: true} // อัพเดทข้อมูลใหม่
        )
        // ตรวจสอบว่าอัพเดทข้อมูลสำเร็จหรือไม่
        if(updatedUser){
            res.status(200).json({updatedUser});
        }else{ 
            res.status(400).json({ message: "Error while updating profile picture" });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While updating profile" });
        
    }
}