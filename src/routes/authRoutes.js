const express = require("express");
const  router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/resend-verify-token", authController.resendVerificationToken);
router.post("/send-reset-otp", authController.sendPasswordResetOTP);
router.post("/reset-password/:otp", authController.verifyOTPAndResetPassword);

module.exports = router;
