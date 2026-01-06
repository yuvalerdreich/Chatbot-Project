const express = require('express');
const path = require('path');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-ms-client-principal']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
