const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "eVote.kz API",
      version: "1.0.0",
      description: "API documentation for eVote.kz backend",
    },
    servers: [
      {
        url: "http://localhost:" + process.env.PORT || "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    },
  },
  apis: ["./src/api/routes/*.js", "./src/api/models/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
