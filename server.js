const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.get('/list', (req, res) => {
    const dir = req.query.dir ? path.resolve(__dirname, req.query.dir) : __dirname;
    if (!dir.startsWith(__dirname)) {
        return res.status(400).json({ error: 'Invalid directory.' });
    }
    fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory.' });
        }   
        const result = entries.map(entry => ({
            name: entry.name,
            isDirectory: entry.isDirectory()
        }));
        res.json({ path: path.relative(__dirname, dir), entries: result });
    });
}); 

function recursiveSearch(dir, keyword, results = [], base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const relPath = path.join(base, entry.name);
        if (entry.name.toLowerCase().includes(keyword.toLowerCase())) {
            results.push(relPath);
        }
        if (entry.isDirectory()) {
            recursiveSearch(path.join(dir, entry.name), keyword, results, relPath);
        }
    }
    return results;
}

app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter is required.' });
    }
   
    try {
        const results = recursiveSearch(__dirname, keyword);
        res.json({ results });
    } catch (err) {
        res.status(500).json({ error: 'Search failed.' });
    }
});

app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});