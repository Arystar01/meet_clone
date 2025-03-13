import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { InviteTemplate } from "./InviteTemplate.js"; // Ensure correct path

dotenv.config();

export default async function sendEmail(from, to, subject, content, attachments = null) { 
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'laura.tremblay22@ethereal.email',
        pass: 'H4BRDECUzTdJaJhtc4'
            },
        });

        const mailOptions = { 
            from, 
            to, 
            subject, 
            html: content, 
            attachments: attachments ? [attachments] : undefined,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
