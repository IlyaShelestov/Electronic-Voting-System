const express = require("express");
const router = express.Router();
const { sendOtp } = require("../controllers/otpController");

/**
 * @swagger
 * /api/otp/send:
 *   post:
 *     summary: Send a one-time password to a user’s email
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User’s email address
 *           example:
 *             email: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Validation error or OTP already sent
 *       500:
 *         description: Server error – failed to send OTP
 */
router.post("/send", sendOtp);

module.exports = router;
