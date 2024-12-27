const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// In-memory database for keys
let keys = [];

// Generate a new key
app.get('/generate-key', (req, res) => {
    const newKey = {
        id: uuidv4(),
        key: uuidv4().slice(0, 8), // Short random key
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 1 week
        used: false
    };
    keys.push(newKey);
    res.json({ key: newKey.key, expiresAt: newKey.expiresAt });
});

// Validate a key
app.post('/validate-key', (req, res) => {
    const { key } = req.body;
    const foundKey = keys.find(k => k.key === key);

    if (!foundKey) {
        return res.status(400).json({ error: 'Key not found' });
    }
    if (foundKey.used) {
        return res.status(400).json({ error: 'Key already used' });
    }
    if (Date.now() > foundKey.expiresAt) {
        return res.status(400).json({ error: 'Key expired' });
    }

    foundKey.used = true;
    res.json({ success: true, message: 'Key validated!' });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});