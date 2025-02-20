require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class SendEmail {

    constructor() {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            }
        });

        this.transporter = transporter;
    }

    async sendAccountCreation(to, fullName, confirmToken) {
        const emailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'accountCreationTemplate.html'), 'utf8');
        const confirmationLink = `https://finance-pro-alpha.vercel.app/confirm-email?token=${confirmToken}`;
        const htmlContent = emailTemplate.replace('[Nome do Usuário]', fullName).replace('[Link de Confirmação]', confirmationLink).replace(/\[Nome da Empresa\]/g, 'Finance Pro');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Bem-vindo à FinancePro - Confirme seu email',
            html: htmlContent
        };

        await new Promise((resolve, reject) => {
            this.transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info.response);
                    resolve(info);
                }
            });
        });
    }

    async sendForgotPassword(to, forgotPasswordToken) {
        const emailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'forgotPassword.html'), 'utf8');
        const forgotPasswordLink = `https://finance-pro-alpha.vercel.app/reset-password?token=${forgotPasswordToken}`;
        const htmlContent = emailTemplate.replace('[Email do Usuário]', to).replace('[Link de Recuperação]', forgotPasswordLink).replace(/\[Nome da Empresa\]/g, 'Finance Pro');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Recuperação de senha',
            html: htmlContent
        };

        await new Promise((resolve, reject) => {
            this.transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info.response);
                    resolve(info);
                }
            });
        });
    }
}

module.exports = SendEmail;