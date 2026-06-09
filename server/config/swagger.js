const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DailyBrain API',
            version: '1.0.0',
            description: 'API per la gestione delle attività giornaliere con AI',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Server locale'
            },
            {
                url: 'https://dailybrain-api.onrender.com/api',
                description: 'Server produzione'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);