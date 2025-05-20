const express = require("express");
const router = express.Router();
const {
  createElection,
  deleteElection,
  createCandidate,
  deleteCandidate,
  updateCandidate,
  attachCandidate,
  createEvent,
  deleteEvent,
  updateEvent,
} = require("../controllers/managerController");

/**
 * @swagger
 * /api/manager/elections:
 *   post:
 *     summary: Create a new election
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the election
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the election (YYYY-MM-DD)
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the election (YYYY-MM-DD)
 *               region_id:
 *                 type: integer
 *                 description: ID of the region where the election takes place
 *               city_id:
 *                 type: integer
 *                 description: ID of the city where the election takes place
 *     responses:
 *       201:
 *         description: Election created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 election_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 end_date:
 *                   type: string
 *                   format: date
 *                 region_id:
 *                   type: integer
 *                 city_id:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       500:
 *         description: Server error
 */
router.post("/elections", createElection);

/**
 * @swagger
 * /api/manager/elections/{id}:
 *   delete:
 *     summary: Delete an election
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the election to delete
 *     responses:
 *       200:
 *         description: Election deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 election_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 end_date:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Election not found
 *       500:
 *         description: Server error
 */
router.delete("/elections/:id", deleteElection);

/**
 * @swagger
 * /api/manager/candidates:
 *   post:
 *     summary: Create a new candidate
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - bio
 *               - party
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user who will be a candidate
 *               election_id:
 *                 type: integer
 *                 description: ID of the election (optional)
 *               bio:
 *                 type: string
 *                 description: Candidate's biography
 *               party:
 *                 type: string
 *                 description: Candidate's political party
 *               avatar_url:
 *                 type: string
 *                 description: URL to candidate's avatar image
 *               additional_url_1:
 *                 type: string
 *                 description: Additional URL for candidate
 *               additional_url_2:
 *                 type: string
 *                 description: Additional URL for candidate
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 election_id:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 party:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                 additional_url_1:
 *                   type: string
 *                 additional_url_2:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       500:
 *         description: Server error
 */
router.post("/candidates", createCandidate);

/**
 * @swagger
 * /api/manager/candidates/attach:
 *   post:
 *     summary: Attach a candidate to an election
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidate_id
 *               - election_id
 *             properties:
 *               candidate_id:
 *                 type: integer
 *                 description: ID of the candidate
 *               election_id:
 *                 type: integer
 *                 description: ID of the election
 *     responses:
 *       200:
 *         description: Candidate attached to election successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 election_id:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 party:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Candidate or election not found
 *       500:
 *         description: Server error
 */
router.post("/candidates/attach", attachCandidate);

/**
 * @swagger
 * /api/manager/candidates/{id}:
 *   delete:
 *     summary: Delete a candidate
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the candidate to delete
 *     responses:
 *       200:
 *         description: Candidate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 election_id:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Server error
 */
router.delete("/candidates/:id", deleteCandidate);

/**
 * @swagger
 * /api/manager/candidates/{id}:
 *   put:
 *     summary: Update a candidate
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the candidate to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               election_id:
 *                 type: integer
 *                 description: ID of the election
 *               bio:
 *                 type: string
 *                 description: Updated biography
 *               party:
 *                 type: string
 *                 description: Updated political party
 *               avatar_url:
 *                 type: string
 *                 description: Updated URL to avatar image
 *               additional_url_1:
 *                 type: string
 *                 description: Updated additional URL
 *               additional_url_2:
 *                 type: string
 *                 description: Updated additional URL
 *     responses:
 *       200:
 *         description: Candidate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 candidate_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 election_id:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 party:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *                 additional_url_1:
 *                   type: string
 *                 additional_url_2:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Server error
 */
router.put("/candidates/:id", updateCandidate);

/**
 * @swagger
 * /api/manager/events/{id}:
 *   post:
 *     summary: Create a new event
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID parameter (appears unused in the implementation)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - event_date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the event
 *               description:
 *                 type: string
 *                 description: Description of the event
 *               event_date:
 *                 type: string
 *                 format: date
 *                 description: Date of the event (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 event_date:
 *                   type: string
 *                   format: date
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       500:
 *         description: Server error
 */
router.post("/events/:id", createEvent);

/**
 * @swagger
 * /api/manager/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 event_date:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete("/events/:id", deleteEvent);

/**
 * @swagger
 * /api/manager/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Manager]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title
 *               description:
 *                 type: string
 *                 description: Updated description
 *               event_date:
 *                 type: string
 *                 format: date
 *                 description: Updated event date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 event_date:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put("/events/:id", updateEvent);

module.exports = router;
