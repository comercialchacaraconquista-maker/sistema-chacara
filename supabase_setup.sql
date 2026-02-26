-- SQL Script to set up the database in Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    document TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    totalSpent DECIMAL DEFAULT 0,
    lastEvent TEXT,
    status TEXT DEFAULT 'Ativo'
);

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price DECIMAL,
    type TEXT,
    description TEXT
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    "start" TEXT,
    "end" TEXT,
    startDate TEXT,
    endDate TEXT,
    guests INTEGER,
    type TEXT,
    status TEXT,
    client_id INTEGER REFERENCES clients(id),
    basePrice DECIMAL,
    paymentMethod TEXT,
    isProposal BOOLEAN DEFAULT FALSE,
    extras TEXT
);

-- 4. Event Services (Join Table)
CREATE TABLE IF NOT EXISTS event_services (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER,
    final_price DECIMAL
);

-- 5. Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    rating DECIMAL,
    phone TEXT,
    email TEXT,
    website TEXT,
    status TEXT,
    services TEXT
);

-- 6. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER,
    status TEXT,
    location TEXT
);

-- 7. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    description TEXT,
    amount DECIMAL,
    date TEXT,
    category TEXT,
    type TEXT,
    status TEXT,
    client TEXT,
    method TEXT,
    event_id INTEGER REFERENCES events(id)
);

-- 8. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    client TEXT,
    type TEXT,
    date TEXT,
    total DECIMAL,
    status TEXT
);

-- 9. Checklists Table
CREATE TABLE IF NOT EXISTS checklists (
    id SERIAL PRIMARY KEY,
    title TEXT,
    date TEXT,
    total INTEGER,
    completed INTEGER,
    priority TEXT,
    items TEXT
);
