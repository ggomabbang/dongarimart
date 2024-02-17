import nodemailer from "nodemailer";

// 이메일 전송 객체 생성
export default nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_ADDRESS, 
        pass: process.env.EMAIL_PASSWORD 
    },
});