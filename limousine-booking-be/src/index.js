require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
require('./models/index'); // Import associations

const app = express();
const apiRouter = require('./routes/index');
const redisClient = require('./config/redis');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    console.log('[App] Health check endpoint accessed');
    res.json({ message: 'Welcome to the API' });
});

app.use('/api', apiRouter);


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('[App] Database connection has been established successfully.');

        await sequelize.sync(); // Use { force: true } to drop and recreate tables (for testing)
        console.log('[App] Database synced successfully.');

        console.log('[App] Redis flushed successfully.');

        app.listen(PORT, () => {
            console.log(`[App] Server is running on port ${PORT}...`);
        });
    } catch (error) {
        console.error(`[App] Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer(); 