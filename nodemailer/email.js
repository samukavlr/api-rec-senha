module.exports = function sendMail(to,subject,html){
    const nodemailer = require('nodemailer');



   const smtpTransport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        // secure:true,
        auth: {
            user: process.env.SMTP_USERNAMEACCOUNT,
            pass: process.env.SMTP_PASSWORD
        }
    })



   const message = {
        from: 'samuel@gmail.com',
        to,
        subject,
        html
    }
    smtpTransport.sendMail(message, (err, res) =>{
        if(err){
            console.log(`Erro ao enviar email: ${err}`);
        } else {
            console.log('Email enviado com sucesso!')
        }
        smtpTransport.close();
    })
}