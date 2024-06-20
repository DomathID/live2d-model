const axios = require('axios');

const githubRepoURL = 'https://api.github.com/repos/DomathID/live2d-model/contents/';

async function getModelList(req, res) {
    try {
        const response = await axios.get(githubRepoURL);
        const models = response.data.filter(item => item.type === 'dir').map(item => item.name);

        res.json(models);
    } catch (error) {
        console.error('Error fetching model list:', error.message);
        res.status(500).json({ error: 'Failed to fetch model list' });
    }
}

module.exports = { getModelList };

