const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const login = require('../../model/loginData')
const register = require('../../model/registerData')
const nodemailer = require('nodemailer')
const LoginRouter = express.Router()



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emailtester167@gmail.com',
    pass: 'tester@123.'
  }
});

LoginRouter.post('/send-email', (req, res) => {
  // const { recipient, subject, text } = req.body;

  const mailOptions = {
    from: 'emailtester167@gmail.com',
    to: 'maneeshchandran28@gmail.com',
    subject: 'subject',
    text: 'text'
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});



































LoginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username && password) {
            const oldUser = await login.findOne({ username })
            if (!oldUser) return res.status(404).json({ success: false, error: true, message: "User doesn't Exist" })
            const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
            if (!isPasswordCorrect) return res.status(400).json({ success: false, error: true, message: "Incorrect password" })
            const token = jwt.sign(
                { userId: oldUser._id, userRole: oldUser.role },
                "secret_this_should_be_longer",
                { expiresIn: "1h" }
            )
            console.log("token", token);
            return res.status(200).json({ success: true, error: false, token: token, expiresIn: 3600, loginId: oldUser._id, userRole: oldUser.role })
        }
        else {
            return res.status(400).json({ success: false, error: true, message: "All fields are required!" })
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

module.exports = LoginRouter