const express = require("express");
const router = express.Router();
const {
  getCityById,
  getRegionById,
  getAllCities,
  getAllRegions,
} = require("../controllers/locationsController");

/**
 * @swagger
 * /api/locations/cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Locations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city_id:
 *                     type: integer
 *                     description: Unique identifier for the city
 *                   name:
 *                     type: string
 *                     description: Name of the city
 *                   region_id:
 *                     type: integer
 *                     description: ID of the region this city belongs to
 *       500:
 *         description: Server error
 */
router.get("/cities", getAllCities);

/**
 * @swagger
 * /api/locations/regions:
 *   get:
 *     summary: Get all regions
 *     tags: [Locations]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all regions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   region_id:
 *                     type: integer
 *                     description: Unique identifier for the region
 *                   name:
 *                     type: string
 *                     description: Name of the region
 *       500:
 *         description: Server error
 */
router.get("/regions", getAllRegions);

/**
 * @swagger
 * /api/locations/cities/{id}:
 *   get:
 *     summary: Get city by ID
 *     tags: [Locations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the city to retrieve
 *     responses:
 *       200:
 *         description: City information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city_id:
 *                   type: integer
 *                   description: Unique identifier for the city
 *                 name:
 *                   type: string
 *                   description: Name of the city
 *                 region_id:
 *                   type: integer
 *                   description: ID of the region this city belongs to
 *       500:
 *         description: Server error
 */
router.get("/cities/:id", getCityById);

/**
 * @swagger
 * /api/locations/regions/{id}:
 *   get:
 *     summary: Get region by ID
 *     tags: [Locations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the region to retrieve
 *     responses:
 *       200:
 *         description: Region information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 region_id:
 *                   type: integer
 *                   description: Unique identifier for the region
 *                 name:
 *                   type: string
 *                   description: Name of the region
 *       500:
 *         description: Server error
 */
router.get("/regions/:id", getRegionById);

module.exports = router;
