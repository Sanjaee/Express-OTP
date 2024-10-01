const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
} = require("../utils/nodemailer");
const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({ message: "User not verified" });
      } else {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await userModel.createUser(username, email, hashedPassword, verificationToken);

    await sendVerificationEmail(email, username, verificationToken);
    res.status(201).json({ message: "User registered, verification email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user || user.verificationToken !== otp) {
      return res.status(400).json({ message: "Invalid OTP or user not found" });
    }

    await userModel.verifyUser(email);
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const resendVerificationToken = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const newVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.updateVerificationToken(email, newVerificationToken);

    await sendVerificationEmail(email, user.username, newVerificationToken);
    res.status(200).json({ message: "Verification token resent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "User not verified or not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendWelcomeEmail(email, user.username);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.updateVerificationToken(email, resetToken);

    await sendResetPasswordEmail(email, resetToken);
    res.status(200).json({ message: "Reset password OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;

  try {
    const user = await userModel.findByOTP(otp);

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or user not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.id, hashedPassword);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyOTPAndResetPassword = async (req, res) => {
    const { otp } = req.params; 
    const { newPassword } = req.body; 
  
    try {
   
      const user = await userModel.findByOTP(otp);
  
      if (!user) {
        return res.status(400).json({ message: "Invalid OTP or user not found" });
      }
  
     
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await userModel.updatePassword(user.id, hashedPassword);
  
      res.status(200).json({ message: "Password reset successful", user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  register,
  verifyOTP,
  resendVerificationToken,
  login,
  sendPasswordResetOTP,
  resetPassword,
  verifyOTPAndResetPassword
};
