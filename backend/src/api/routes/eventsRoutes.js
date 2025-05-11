const express = require("express");
const router = express.Router();
const { getAll } = require("../controllers/eventsController");

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: integer
 *                     description: Unique identifier for the event
 *                   title:
 *                     type: string
 *                     description: Title of the event
 *                   description:
 *                     type: string
 *                     description: Description of the event
 *                   event_date:
 *                     type: string
 *                     format: date
 *                     description: Date of the event (YYYY-MM-DD)
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the event was created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", getAll);

module.exports = router;
