const nodemailer = require('nodemailer')
const mailhelper =  async(option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
const message={
  from: 'charan@gmail.com', // sender address
  to: option.email, // list of receivers
  subject: option.subject, // Subject line
  text: option.text, // plain text body
}
    
    await transporter.sendMail(message);
  }

module.exports = mailhelper