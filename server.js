import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.join(__dirname, '.env') });

import fs from 'fs';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

const app = express();
app.use(express.json());
app.use(cors());

// Function to send email
function sendMail(name, email, message) {
    const emailID = process?.env?.EMAILID;
const password = process?.env?.PASSWORD;

console.log(emailID, password);


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAILID,
            pass: process.env.PASSWORD
        }
    });

    // Read Handlebars template
    const templatePath = path.join(__dirname, 'template', 'feedback.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const html = template({ name, email, message });

    const mailOptions = {
        from:process.env.EMAILID,
        to:process.env.EMAILID, // Send feedback to yourself
        subject: 'New Feedback from Portfolio',
        html,
        // attachments: [
        //     {
        //            filename: 'mailimage.jpg',
        // path: path.join(__dirname, 'template', 'img', 'mailimage.jpg'),
        // cid: 'mailimage' // same as used in your HBS template
        //     }
        // ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending mail:', error);
        } else {
            console.log('Mail sent:', info.response);
        }
    });
}

// API route
app.post('/', (req, res) => {
    const { name, email, message } = req.body;
    sendMail(name, email, message);
    res.json({ status: "success" });
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
