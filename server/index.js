const express = require('express');
const cors = require('cors');
const { run, all, initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Clients Endpoints ---
app.get('/api/clients', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM clients');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clients', async (req, res) => {
    const { name, type, document, phone, email, city } = req.body;
    try {
        const result = await run(`INSERT INTO clients (name, type, document, phone, email, city) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, type, document, phone, email, city]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Events Endpoints ---
app.get('/api/events', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM events');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { title, date, start, end, startDate, endDate, guests, type, status, client_id, basePrice, paymentMethod, isProposal, extras } = req.body;
    try {
        const result = await run(`INSERT INTO events (title, date, start, end, startDate, endDate, guests, type, status, client_id, basePrice, paymentMethod, isProposal, extras) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, date, start, end, startDate || date, endDate || date, guests, type, status, client_id, basePrice, paymentMethod, isProposal ? 1 : 0, JSON.stringify(extras || [])]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, date, start, end, startDate, endDate, guests, status, client_id, basePrice, paymentMethod, isProposal, extras } = req.body;
    try {
        await run(`UPDATE events SET title=?, date=?, start=?, end=?, startDate=?, endDate=?, guests=?, status=?, client_id=?, basePrice=?, paymentMethod=?, isProposal=?, extras=? WHERE id=?`,
            [title, date, start, end, startDate || date, endDate || date, guests, status, client_id, basePrice, paymentMethod, isProposal ? 1 : 0, JSON.stringify(extras || []), id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Services Endpoints ---
app.get('/api/services', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM services');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Inventory Endpoints ---
app.get('/api/inventory', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM inventory');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Partners Endpoints ---
app.get('/api/partners', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM partners');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Transactions Endpoints ---
app.get('/api/transactions', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM transactions');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    const { description, amount, date, category, type, status, client, method, event_id } = req.body;
    try {
        const result = await run(`INSERT INTO transactions (description, amount, date, category, type, status, client, method, event_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [description, amount, date, category, type, status, client, method, event_id]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Contracts Endpoints ---
app.get('/api/contracts', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM contracts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Checklists Endpoints ---
app.get('/api/checklists', async (req, res) => {
    try {
        const rows = await all('SELECT * FROM checklists');
        // Parse items JSON for each row
        const parsedRows = rows.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || [])
        }));
        res.json(parsedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/checklists', async (req, res) => {
    const { title, date, total, completed, priority, items } = req.body;
    try {
        const result = await run(`INSERT INTO checklists (title, date, total, completed, priority, items) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, date, total, completed, priority, JSON.stringify(items || [])]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/checklists/:id', async (req, res) => {
    const { id } = req.params;
    const { title, date, total, completed, priority, items } = req.body;
    try {
        await run(`UPDATE checklists SET title=?, date=?, total=?, completed=?, priority=?, items=? WHERE id=?`,
            [title, date, total, completed, priority, JSON.stringify(items || []), id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

async function startServer() {
    await initializeDatabase();
    const server = app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
    server.on('error', (err) => {
        console.error('Erro fatal no servidor:', err);
    });
}

process.on('exit', (code) => {
    console.log(`Processo finalizado com código: ${code}`);
});

process.on('beforeExit', (code) => {
    console.log(`Processo prestes a finalizar (beforeExit), código: ${code}`);
});

startServer().catch(err => {
    console.error('Erro ao iniciar servidor:', err);
});
