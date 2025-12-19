// server/src/utils/email.js
const nodemailer = require('nodemailer');
const { vars } = require('../config');

const transporter = nodemailer.createTransport({
    host: vars.mailHost,
    port: vars.mailPort,
    secure: false,
    auth: {
        user: vars.mailUser,
        pass: vars.mailPass
    }
});

async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
        from: vars.mailFrom,
        to,
        subject,
        html
    });
}

module.exports = { sendEmail };
