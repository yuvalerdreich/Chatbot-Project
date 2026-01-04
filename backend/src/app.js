const express = require('express');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes');
const botService = require('./services/botService');
const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/chat', chatRoutes);

const authConfig = new ConfigurationBotFrameworkAuthentication(process.env);
const adapter = new CloudAdapter(authConfig);

app.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => botService.run(context));
});

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
