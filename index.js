// index.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

const baseURL = 'https://live2d.nekochan.eu.org';

// API route to fetch and return the model.json
app.get('/api/:modelName', async (req, res) => {
    const modelName = req.params.modelName;
    const modelUrl = `${baseURL}/${modelName}/model.json`;

    try {
        const response = await axios.get(modelUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch model.json' });
    }
});

// API route to fetch and return the list of models
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(baseURL);
        const $ = cheerio.load(response.data);
        const models = [];

        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.endsWith('/')) {
                models.push(href.replace(/\//g, ''));
            }
        });

        res.json(models);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch model list' });
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

