const express = require("express");
const router = express.Router();
const {
  castVote,
  checkVoted,
  checkVoteLocation,
  checkVoteToken,
} = require("../controllers/voteController");

/**
 * @swagger
 * /api/vote/cast:
 *   post:
 *     summary: Cast a vote in an election
 *     tags: [Vote]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - electionId
 *               - candidateId
 *               - otp
 *             properties:
 *               electionId:
 *                 type: integer
 *                 description: ID of the election
 *               candidateId:
 *                 type: integer
 *                 description: ID of the candidate
 *               otp:
 *                 type: string
 *                 description: One-time password for verification
 *     responses:
 *       201:
 *         description: Vote successfully cast, returns token
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad request - invalid OTP
 *       401:
 *         description: Unauthorized - user not logged in
 *       403:
 *         description: Forbidden - user cannot vote in this election due to location
 *       409:
 *         description: Conflict - user has already voted or is trying to vote for themselves
 *       500:
 *         description: Server error
 */
router.post("/cast", castVote);

/**
 * @swagger
 * /api/vote/status/{electionId}:
 *   get:
 *     summary: Check if user has already voted in a specific election
 *     tags: [Vote]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election
 *     responses:
 *       200:
 *         description: Vote status check successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     election_id:
 *                       type: integer
 *                 - type: string
 *                   example: ""
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/status/:electionId", checkVoted);

/**
 * @swagger
 * /api/vote/location/{electionId}:
 *   get:
 *     summary: Check if user can vote in a specific election based on location
 *     tags: [Vote]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election
 *     responses:
 *       200:
 *         description: Location check successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     election_id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     start_date:
 *                       type: string
 *                       format: date
 *                     end_date:
 *                       type: string
 *                       format: date
 *                     region_id:
 *                       type: integer
 *                     city_id:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                 - type: string
 *                   example: ""
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/location/:electionId", checkVoteLocation);

/**
 * @swagger
 * /api/vote/token:
 *   post:
 *     summary: Verify a vote token and get vote information
 *     tags: [Vote]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Vote token to verify
 *     responses:
 *       200:
 *         description: Token verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vote_id:
 *                   type: integer
 *                 election_id:
 *                   type: integer
 *                 candidate_id:
 *                   type: integer
 *                 token:
 *                   type: string
 *                 voted_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 *       500:
 *         description: Server error
 */
router.post("/token", checkVoteToken);

module.exports = router;
