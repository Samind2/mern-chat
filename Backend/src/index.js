import express from "express"; // นำเข้า Express.js ซึ่งเป็น Web Framework สำหรับ Node.js
import dotenv from "dotenv"; // นำเข้า dotenv เพื่อใช้ไฟล์ .env
import cors from "cors"; // นำเข้า CORS (Cross-Origin Resource Sharing) เพื่อจัดการสิทธิ์การเข้าถึง API
import cookieParser from "cookie-parser"; // นำเข้า cookie-parser เพื่อช่วยให้ Express สามารถอ่านค่าจาก Cookie ได้
import { connectDB } from "./lib/db.js"; // นำเข้าฟังก์ชัน connectDB ซึ่งใช้สำหรับเชื่อมต่อฐานข้อมูล
import authRouter from "./routes/auth.router.js"; // นำเข้า authRouter ซึ่งเป็น Route ที่เกี่ยวข้องกับ Authentication

dotenv.config(); // โหลดค่าตัวแปรจากไฟล์ .env 

const PORT = process.env.PORT; // กำหนดPORT จาก .env

const app = express(); // สร้าง instance ของ Express.js

app.use(express.json()); // เปิดใช้งาน middleware ที่ช่วยให้ Express สามารถรับ JSON request ได้
app.use(cookieParser()); // เปิดใช้งาน cookie-parser เพื่อให้สามารถจัดการ Cookie ได้
app.use(cors({ // อนุญาตให้เรียก API จากโดเมนที่กำหนดไว้ใน BASE_URL ในไฟล์ .env
    origin: process.env.BASE_URL, 
    credentials: true  // อนุญาตให้ส่ง cookie ไปกับ request
}));

// สร้างเส้นทาง (route) เริ่มต้นของเซิร์ฟเวอร์
app.get("/", (req, res) => {
  res.send("h1>Restfull Service for Mern chat Project</h1>");
});

// ใช้งาน authRouter สำหรับจัดการ API ที่เกี่ยวข้องกับการยืนยันตัวตน (Authentication)
app.use("/api/v1/auth", authRouter);

// เริ่มต้นเซิร์ฟเวอร์ และเชื่อมต่อกับฐานข้อมูล
app.listen(PORT, () => {
  console.log("Server is running on port HTTP://localhost:" + PORT);
  connectDB();
});


