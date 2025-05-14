const express = require("express");
const router = express.Router();
const {
  getAll,
  createUser,
  updateUser,
  deleteUser,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
} = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     description: Unique identifier for the user
 *                   iin:
 *                     type: string
 *                     description: Individual identification number
 *                   first_name:
 *                     type: string
 *                     description: User's first name
 *                   last_name:
 *                     type: string
 *                     description: User's last name
 *                   patronymic:
 *                     type: string
 *                     description: User's patronymic (optional)
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                     description: User's date of birth
 *                   city_id:
 *                     type: integer
 *                     description: ID of the city where the user lives
 *                   phone_number:
 *                     type: string
 *                     description: User's phone number
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                   role:
 *                     type: string
 *                     enum: [user, admin, manager]
 *                     description: User's role in the system
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: When the user account was created
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: When the user account was last updated
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       500:
 *         description: Server error
 */
router.get("/users", getAll);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
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
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *                 default: user
 *                 description: User's role in the system
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - validation error or missing fields
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       409:
 *         description: Conflict - IIN, phone number, or email already exists
 *       500:
 *         description: Server error
 */
router.post("/users", createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               iin:
 *                 type: string
 *                 description: Individual identification number
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *               patronymic:
 *                 type: string
 *                 description: User's patronymic
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth
 *               city_id:
 *                 type: integer
 *                 description: ID of the city where the user lives
 *               phone_number:
 *                 type: string
 *                 description: User's phone number
 *               email:
 *                 type: string
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *                 description: User's role in the system
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - IIN, phone number, or email already exists
 *       500:
 *         description: Server error
 */
router.put("/users/:id", updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: User not found
 *       410:
 *         description: User already deleted
 *       500:
 *         description: Server error
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /api/admin/requests:
 *   get:
 *     summary: Get all profile change requests
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all profile change requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   request_id:
 *                     type: integer
 *                     description: Unique identifier for the request
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user who submitted the request
 *                   field_name:
 *                     type: string
 *                     description: Name of the field to be changed
 *                   old_value:
 *                     type: string
 *                     description: Current value of the field
 *                   new_value:
 *                     type: string
 *                     description: Requested new value for the field
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                     description: Status of the request
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: When the request was created
 *                   first_name:
 *                     type: string
 *                     description: User's first name
 *                   last_name:
 *                     type: string
 *                     description: User's last name
 *                   iin:
 *                     type: string
 *                     description: User's IIN
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       500:
 *         description: Server error
 */
router.get("/requests", getAllRequests);

/**
 * @swagger
 * /api/admin/requests/{id}:
 *   get:
 *     summary: Get a specific profile change request
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the request to retrieve
 *     responses:
 *       200:
 *         description: Profile change request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 request_id:
 *                   type: integer
 *                   description: Unique identifier for the request
 *                 user_id:
 *                   type: integer
 *                   description: ID of the user who submitted the request
 *                 field_name:
 *                   type: string
 *                   description: Name of the field to be changed
 *                 old_value:
 *                   type: string
 *                   description: Current value of the field
 *                 new_value:
 *                   type: string
 *                   description: Requested new value for the field
 *                 status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                   description: Status of the request
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: When the request was created
 *                 first_name:
 *                   type: string
 *                   description: User's first name
 *                 last_name:
 *                   type: string
 *                   description: User's last name
 *                 iin:
 *                   type: string
 *                   description: User's IIN
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.get("/requests/:id", getRequestById);

/**
 * @swagger
 * /api/admin/requests/{id}/approve:
 *   post:
 *     summary: Approve a profile change request
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the request to approve
 *     responses:
 *       200:
 *         description: Request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request approved successfully
 *                 request:
 *                   type: object
 *                   properties:
 *                     request_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     field_name:
 *                       type: string
 *                     old_value:
 *                       type: string
 *                     new_value:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [approved]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Request already processed
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post("/requests/:id/approve", approveRequest);

/**
 * @swagger
 * /api/admin/requests/{id}/reject:
 *   post:
 *     summary: Reject a profile change request
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the request to reject
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request rejected successfully
 *                 request:
 *                   type: object
 *                   properties:
 *                     request_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     field_name:
 *                       type: string
 *                     old_value:
 *                       type: string
 *                     new_value:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [rejected]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Request already processed
 *       401:
 *         description: Unauthorized - not logged in
 *       403:
 *         description: Forbidden - not an admin
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.post("/requests/:id/reject", rejectRequest);

module.exports = router;
