const express = require("express");
const router = express.Router();
const {
  getAll,
  getAvailable,
  getById,
  getReport,
  getCandidates,
} = require("../controllers/electionsController");
const { verifyToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/elections:
 *   get:
 *     summary: Get all elections
 *     tags: [Elections]
 *     responses:
 *       200:
 *         description: List of all elections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   election_id:
 *                     type: integer
 *                     description: Unique identifier for the election
 *                   title:
 *                     type: string
 *                     description: Title of the election
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                     description: Start date of the election
 *                   end_date:
 *                     type: string
 *                     format: date-time
 *                     description: End date of the election
 *                   region_id:
 *                     type: integer
 *                     description: ID of the region where the election takes place
 *                   city_id:
 *                     type: integer
 *                     description: ID of the city where the election takes place
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the election was created
 *       500:
 *         description: Server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/elections/available:
 *   get:
 *     summary: Get elections available for the current user
 *     description: Returns elections available for the user based on their location and current date
 *     tags: [Elections]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of available elections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   election_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                   end_date:
 *                     type: string
 *                     format: date-time
 *                   region_id:
 *                     type: integer
 *                   city_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/available", verifyToken, getAvailable);

/**
 * @swagger
 * /api/elections/{id}/report:
 *   get:
 *     summary: Get daily vote report for an election
 *     description: Returns a report showing the number of votes per day for each candidate in the election
 *     tags: [Elections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election
 *     responses:
 *       200:
 *         description: Daily vote report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   candidate_id:
 *                     type: integer
 *                     description: ID of the candidate
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user who is the candidate
 *                   bio:
 *                     type: string
 *                     description: Candidate's biography
 *                   party:
 *                     type: string
 *                     description: Candidate's political party
 *                   voted_day:
 *                     type: string
 *                     format: date
 *                     description: Date of votes
 *                   vote_count:
 *                     type: integer
 *                     description: Number of votes received on that day
 *       500:
 *         description: Server error
 */
router.get("/:id/report", getReport);

/**
 * @swagger
 * /api/elections/{id}/candidates:
 *   get:
 *     summary: Get all candidates for an election
 *     tags: [Elections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election
 *     responses:
 *       200:
 *         description: List of candidates for the election
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   candidate_id:
 *                     type: integer
 *                     description: ID of the candidate
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user who is the candidate
 *                   election_id:
 *                     type: integer
 *                     description: ID of the election
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
 *                   first_name:
 *                     type: string
 *                     description: Candidate's first name
 *                   last_name:
 *                     type: string
 *                     description: Candidate's last name
 *                   patronymic:
 *                     type: string
 *                     description: Candidate's patronymic
 *       500:
 *         description: Server error
 */
router.get("/:id/candidates", getCandidates);

/**
 * @swagger
 * /api/elections/{id}:
 *   get:
 *     summary: Get election by ID
 *     tags: [Elections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election to retrieve
 *     responses:
 *       200:
 *         description: Election details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 election_id:
 *                   type: integer
 *                   description: Unique identifier for the election
 *                 title:
 *                   type: string
 *                   description: Title of the election
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                   description: Start date of the election
 *                 end_date:
 *                   type: string
 *                   format: date-time
 *                   description: End date of the election
 *                 region_id:
 *                   type: integer
 *                   description: ID of the region where the election takes place
 *                 city_id:
 *                   type: integer
 *                   description: ID of the city where the election takes place
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the election was created
 *       500:
 *         description: Server error
 */
router.get("/:id", getById);

module.exports = router;
