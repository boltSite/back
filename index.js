require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const iconv = require('iconv-lite');
const app = express();

// CORS 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 파일 저장을 위한 multer 설정
const upload = multer({ storage: multer.memoryStorage() });

app.post('/send-email', upload.single('file'), async (req, res) => {
    try {
        const { title, message, contact, email } = req.body;
        const file = req.file;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, //"dongsanbolt@daum.net"
            subject: title,
            text: `내용: ${message}\n연락처: ${contact}\n이메일: ${email}`,
        };

        // 파일이 있을 경우 첨부파일 추가
        if (file) {
            mailOptions.attachments = [{
                filename: `=?UTF-8?B?${Buffer.from(file.originalname).toString('base64')}?=`,
                content: file.buffer
            }];
        }

        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));