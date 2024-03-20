import nodemailer from 'nodemailer'

const resetPasswordTemplate = (verificationLink) => `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      
      h1 {
        color: #007bff;
      }
      
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        text-decoration: none;
      }
      
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <h1>Reset Password</h1>
    <p>Please click the button  to reset your password:</p>
    <a href="${verificationLink}" class="button">Reset Password</a>
  </body>
</html>
`;
const emailVerificationTemplate = (verificationLink) => `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        
        h1 {
          color: #007bff;
        }
        
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #FF0034;
          color: #FFF !important;
          border-radius: 4px;
          text-decoration: none;
        }
        .ii a {
          color : '#FFF'
        }
        
        .button:hover {
          background-color: #FF0034;
        }
      </style>
    </head>
    <body>
      <h1>Verify your email address</h1>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verificationLink}" class="button">Verify Email Address</a>
    </body>
  </html>
`;

export const UserEmail = async (email, subject, text, reset) => {
  try {
    console.log('text =>', text)
    const transporter = nodemailer.createTransport({
      host: ' smtp.gmail.com',
      service: 'gmail',
      post: '587',
      secure: true,
      auth: {
        user: 'parasjuneja8699@gmail.com',
        pass: 'sgppeygepvkzcych',
      },
    });
    await transporter.sendMail({
      from: 'parasjuneja0001@gmail.com',
      to: email,
      subject: subject,
      text: text,
      html: reset ? resetPasswordTemplate(text) : emailVerificationTemplate(text),
    });
    return true

  } catch (err) {
    console.log('err ->', err)
    return err
  }
}