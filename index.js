const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

const baseURL = 'https://live2d.nekochan.eu.org';
const githubRepoURL = 'https://api.github.com/repos/DomathID/live2d-model/contents/';

app.get('/api/:modelName', async (req, res) => {
    const modelName = req.params.modelName;
    const modelUrl = `${baseURL}/${modelName}/model.json`;

    try {
        const response = await axios.get(modelUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching model.json:', error.message);
        res.status(500).json({ error: 'Failed to fetch model.json' });
    }
});

app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(githubRepoURL);
        const models = response.data.filter(item => item.type === 'dir').map(item => item.name);

        res.json(models);
    } catch (error) {
        console.error('Error fetching model list:', error.message);
        res.status(500).json({ error: 'Failed to fetch model list' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

