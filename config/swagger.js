const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShadowChat API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./routes/*.js"], // location of route files
};

module.exports = swaggerJsdoc(options);