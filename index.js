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

app.post('/send-email', upload.array('files'), async (req, res) => {
    try {
        const { title, message, contact, email } = req.body;
        const files = req.files; // 여러 개의 파일 처리

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: title,
            text: `내용: ${message}\n연락처: ${contact}\n이메일: ${email}`,
            attachments: files.length > 0 ? files.map(file => ({
                filename: iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8'),
                content: file.buffer,
                contentDisposition: 'attachment' // 파일 첨부 형식 지정
            })) : undefined
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));