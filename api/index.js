const express = require('express');
const cors = require('cors');
const { supabase } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// --- Clients Endpoints ---
app.get('/api/clients', async (req, res) => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/clients', async (req, res) => {
    const { data, error } = await supabase.from('clients').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// --- Events Endpoints ---
app.get('/api/events', async (req, res) => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/events', async (req, res) => {
    const event = { ...req.body };
    // Handle JSON serialization for Supabase if needed, or send as object (Supabase handles JSON)
    const { data, error } = await supabase.from('events').insert([event]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('events').update(req.body).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// --- Services Endpoints ---
app.get('/api/services', async (req, res) => {
    const { data, error } = await supabase.from('services').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- Inventory Endpoints ---
app.get('/api/inventory', async (req, res) => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- Partners Endpoints ---
app.get('/api/partners', async (req, res) => {
    const { data, error } = await supabase.from('partners').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- Transactions Endpoints ---
app.get('/api/transactions', async (req, res) => {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/transactions', async (req, res) => {
    const { data, error } = await supabase.from('transactions').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// --- Contracts Endpoints ---
app.get('/api/contracts', async (req, res) => {
    const { data, error } = await supabase.from('contracts').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- Checklists Endpoints ---
app.get('/api/checklists', async (req, res) => {
    const { data, error } = await supabase.from('checklists').select('*');
    if (error) return res.status(500).json({ error: error.message });

    const parsedData = data.map(row => ({
        ...row,
        items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || [])
    }));
    res.json(parsedData);
});

app.post('/api/checklists', async (req, res) => {
    const checklist = { ...req.body };
    if (checklist.items) checklist.items = JSON.stringify(checklist.items);

    const { data, error } = await supabase.from('checklists').insert([checklist]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/checklists/:id', async (req, res) => {
    const { id } = req.params;
    const checklist = { ...req.body };
    if (checklist.items) checklist.items = JSON.stringify(checklist.items);

    const { data, error } = await supabase.from('checklists').update(checklist).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

module.exports = app;
