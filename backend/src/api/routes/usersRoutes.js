const express = require("express");
const router = express.Router();
const {
  getProfileInfo,
  requestChange,
  getUserRequests,
} = require("../controllers/usersController");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         iin:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         patronymic:
 *           type: string
 *           nullable: true
 *         city_id:
 *           type: integer
 *         phone_number:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         date_of_birth:
 *           type: string
 *           format: date
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     ProfileChangeRequest:
 *       type: object
 *       properties:
 *         request_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         field_name:
 *           type: string
 *         old_value:
 *           type: string
 *           nullable: true
 *         new_value:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile information
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me", getProfileInfo);

/**
 * @swagger
 * /api/users/me/request-change:
 *   post:
 *     summary: Request a change to user profile field
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field_name
 *               - new_value
 *             properties:
 *               field_name:
 *                 type: string
 *                 enum: [phone_number, email, city_id, first_name, last_name, patronymic]
 *               new_value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Change request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 request:
 *                   $ref: '#/components/schemas/ProfileChangeRequest'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Field cannot be changed
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/me/request-change", requestChange);

/**
 * @swagger
 * /api/users/me/requests:
 *   get:
 *     summary: Get all profile change requests for the current user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's change requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfileChangeRequest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me/requests", getUserRequests);

module.exports = router;
