import express from 'express';
import cors from 'cors';
import db from './database.js'; // Note the .js extension for local imports in ESM
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Auth Routes ---

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, password, secretCode } = req.body;
    const code = secretCode || '1234='; // Default to 1234= if not provided

    // In a real app, hash password here!
    const sql = 'INSERT INTO users (username, password, secret_code) VALUES (?, ?, ?)';
    db.run(sql, [username, password, code], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, username, message: 'User created successfully' });
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ message: 'Login successful', user: row });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// --- Feature Routes ---

// Get Cycles
app.get('/api/cycles/:userId', (req, res) => {
    const sql = 'SELECT * FROM cycles WHERE user_id = ? ORDER BY start_date DESC';
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ cycles: rows });
    });
});

// Add Cycle
app.post('/api/cycles', (req, res) => {
    const { userId, startDate } = req.body;
    const sql = 'INSERT INTO cycles (user_id, start_date) VALUES (?, ?)';
    db.run(sql, [userId, startDate], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Cycle added' });
    });
});

// --- Pad Request Routes ---

// Create a pad request
app.post('/api/pad-request', (req, res) => {
    const { userId, username, location } = req.body;

    if (!location || location.lat === 0 || !location.lng) {
        return res.status(400).json({ error: 'Valid location is required for pad requests' });
    }

    const sql = 'INSERT INTO pad_requests (user_id, username, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, username, location.lat, location.lng, 'active'], function (err) {
        if (err) {
            console.error('Error creating pad request:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Pad request created by ${username} (User ${userId}) at location: ${location.lat}, ${location.lng}`);
        res.json({
            id: this.lastID,
            message: 'Pad request sent! Nearby users will be notified.',
            requestId: this.lastID
        });
    });
});

// Get nearby pad requests (active requests from other users)
app.get('/api/pad-requests/nearby/:userId', (req, res) => {
    const userId = req.params.userId;

    // Get all active requests except from the current user
    const sql = `SELECT id, user_id, username, latitude, longitude, created_at 
                 FROM pad_requests 
                 WHERE status = 'active' AND user_id != ? 
                 ORDER BY created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching pad requests:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ requests: rows });
    });
});

// Get user's own pad requests
app.get('/api/pad-requests/my/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT id, latitude, longitude, status, created_at 
                 FROM pad_requests 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user pad requests:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ requests: rows });
    });
});

// Mark a pad request as fulfilled
app.post('/api/pad-request/fulfill', (req, res) => {
    const { requestId, fulfilledBy } = req.body;

    const sql = 'UPDATE pad_requests SET status = ?, fulfilled_by = ? WHERE id = ?';
    db.run(sql, ['fulfilled', fulfilledBy, requestId], function (err) {
        if (err) {
            console.error('Error fulfilling pad request:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Pad request ${requestId} fulfilled by user ${fulfilledBy}`);
        res.json({ message: 'Request marked as fulfilled!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
