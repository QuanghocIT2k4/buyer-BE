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

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(options);
  const pathsCount = Object.keys(swaggerSpec.paths || {}).length;
  console.log('✅ Swagger spec generated successfully');
  console.log('📊 Swagger paths found:', pathsCount);
  console.log('📝 Swagger title:', swaggerSpec.info?.title);
  
  if (pathsCount === 0) {
    console.error('❌ WARNING: No Swagger paths found!');
    console.error('📁 Checking apis paths:', options.apis);
    console.error('📂 __dirname:', __dirname);
  } else {
    console.log('✅ Sample paths:', Object.keys(swaggerSpec.paths).slice(0, 5));
  }
} catch (error) {
  console.error('❌ ERROR generating Swagger spec:', error.message);
  console.error(error.stack);
  // Fallback: create empty spec to prevent crash
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Buyer Backend API',
      version: '1.0.0',
      description: 'Error loading Swagger spec',
    },
    paths: {},
  };
}

module.exports = swaggerSpec;

