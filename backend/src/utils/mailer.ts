import nodemailer from 'nodemailer'

const sendMail = (email: string, message: string)=> {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.MAIL}`,
          pass: `${process.env.MAIL_PASS}`
        }
      });
      
      var mailOptions = {
        from: `${process.env.MAIL}`,
        to: `${email}`,
        subject: 'OTP for Cloud IDE',
        text: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}

export default sendMail