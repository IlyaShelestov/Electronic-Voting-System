const express = require("express");
const router = express.Router();
const { getById, getAll } = require("../controllers/candidatesController");

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   candidate_id:
 *                     type: integer
 *                     description: Unique identifier for the candidate
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user who is the candidate
 *                   election_id:
 *                     type: integer
 *                     description: ID of the election this candidate is participating in
 *                   bio:
 *                     type: string
 *                     description: Candidate's biography
 *                   party:
 *                     type: string
 *                     description: Candidate's political party
 *                   avatar_url:
 *                     type: string
 *                     description: URL to candidate's avatar image
 *                   additional_url_1:
 *                     type: string
 *                     description: Additional URL for candidate materials
 *                   additional_url_2:
 *                     type: string
 *                     description: Additional URL for candidate materials
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Record creation timestamp
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Record last update timestamp
 *                   first_name:
 *                     type: string
 *                     description: Candidate's first name
 *                   last_name:
 *                     type: string
 *                     description: Candidate's last name
 *                   patronymic:
 *                     type: string
 *                     description: Candidate's patronymic
 *                   city_id:
 *                     type: integer
 *                     description: Candidate's city ID
 *                   phone_number:
 *                     type: string
 *                     description: Candidate's phone number
 *                   email:
 *                     type: string
 *                     description: Candidate's email address
 *                   role:
 *                     type: string
 *                     description: User role
 *       500:
 *         description: Server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the candidate to retrieve
 *     responses:
 *       200:
 *         description: Candidate details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate_id:
 *                   type: integer
 *                   description: Unique identifier for the candidate
 *                 user_id:
 *                   type: integer
 *                   description: ID of the user who is the candidate
 *                 election_id:
 *                   type: integer
 *                   description: ID of the election this candidate is participating in
 *                 bio:
 *                   type: string
 *                   description: Candidate's biography
 *                 party:
 *                   type: string
 *                   description: Candidate's political party
 *                 avatar_url:
 *                   type: string
 *                   description: URL to candidate's avatar image
 *                 additional_url_1:
 *                   type: string
 *                   description: Additional URL for candidate materials
 *                 additional_url_2:
 *                   type: string
 *                   description: Additional URL for candidate materials
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Record creation timestamp
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Record last update timestamp
 *                 first_name:
 *                   type: string
 *                   description: Candidate's first name
 *                 last_name:
 *                   type: string
 *                   description: Candidate's last name
 *                 patronymic:
 *                   type: string
 *                   description: Candidate's patronymic
 *                 city_id:
 *                   type: integer
 *                   description: Candidate's city ID
 *                 phone_number:
 *                   type: string
 *                   description: Candidate's phone number
 *                 email:
 *                   type: string
 *                   description: Candidate's email address
 *                 role:
 *                   type: string
 *                   description: User role
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getById);

module.exports = router;
