const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Buyer Backend API',
      version: '1.0.0',
      description: 'REST API cho buyer flow trong e-commerce: Auth, Products, Cart, Orders',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://buyer-be.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
  ], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

// Debug: Log số lượng paths được scan (cả production)
const pathsCount = Object.keys(swaggerSpec.paths || {}).length;
console.log('Swagger paths found:', pathsCount);
if (pathsCount === 0) {
  console.error('WARNING: No Swagger paths found! Check apis paths in swagger.js');
}

module.exports = swaggerSpec;

