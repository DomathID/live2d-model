const express = require('express');
const { getModel } = require('./controllers/modelController');
const { getModelList } = require('./controllers/modelListController');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Rute API untuk mengambil model.json
app.get('/api/:modelName/', getModel);

// Rute API untuk mengambil daftar model
app.get('/api/models', getModelList);

// Menyajikan halaman HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
