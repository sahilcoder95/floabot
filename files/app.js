const express = require('express'); 
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter  is required.' });
    }

    fs.readdir(__dirname, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory.' });
        }
        const matchedFiles = files.filter(file => file.toLowerCase().includes(keyword.toLowerCase()));
        res.json({ files: matchedFiles });
    });
});

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});

//http://localhost:3000/search?keyword=yourKeyword



