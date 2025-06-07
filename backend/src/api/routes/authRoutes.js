const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  passwordReset,
} = require("../controllers/authController");
const {
  preventLoggedIn,
  verifyToken,
} = require("../middlewares/authMiddleware");
const checkCitizenCorrect = require("../middlewares/citizenMiddleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iin
 *               - first_name
 *               - last_name
 *               - date_of_birth
 *               - city_id
 *               - phone_number
 *               - email
 *               - password
 *               - otp
 *             properties:
 *               iin:
 *                 type: string
 *                 description: Individual identification number (12 digits)
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *               patronymic:
 *                 type: string
 *                 description: User's patronymic (optional)
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth (YYYY-MM-DD)
 *               city_id:
 *                 type: integer
 *                 description: ID of the city where the user lives
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               otp:
 *                 type: string
 *                 description: One-time password sent to the user's email
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 iin:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 patronymic:
 *                   type: string
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 city_id:
 *                   type: integer
 *                 phone_number:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin, manager]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - validation error or missing fields
 *       403:
 *         description: Forbidden - already logged in
 *       409:
 *         description: Conflict - user already exists
 *       500:
 *         description: Server error
 *       502:
 *         description: Bad Gateway - unable to verify eGov citizen
 */
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
  router.post("/register", preventLoggedIn, register);
} else {
  router.post("/register", preventLoggedIn, checkCitizenCorrect, register);
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iin
 *               - password
 *             properties:
 *               iin:
 *                 type: string
 *                 description: Individual identification number (12 digits)
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Authentication token set as a cookie
 *       400:
 *         description: Bad request - missing credentials
 *       401:
 *         description: Unauthorized - invalid credentials
 *       403:
 *         description: Forbidden - already logged in
 *       500:
 *         description: Server error
 */
router.post("/login", preventLoggedIn, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out from the system
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/password-reset:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iin
 *               - newPassword
 *               - otp
 *             properties:
 *               iin:
 *                 type: string
 *                 description: Individual identification number (12 digits)
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (must be at least 9 characters with at least one letter, one number, and one special character)
 *               otp:
 *                 type: string
 *                 description: One-time password sent to the user's email
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad request - validation error or missing fields
 *       403:
 *         description: Forbidden - already logged in
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.post("/password-reset", preventLoggedIn, passwordReset);

module.exports = router;
