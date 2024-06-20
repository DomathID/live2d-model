const axios = require('axios');

const baseURL = 'https://live2d.nekochan.eu.org';

async function getModel(req, res) {
    const modelName = req.params.modelName;
    const modelUrl = `${baseURL}/${modelName}/model.json`;

    try {
        const response = await axios.get(modelUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching model.json:', error.message);
        res.status(500).json({ error: 'Failed to fetch model.json' });
    }
}

module.exports = { getModel };

