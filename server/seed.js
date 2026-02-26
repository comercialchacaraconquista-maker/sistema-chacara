const { run, initializeDatabase } = require('./db');

async function seed() {
    await initializeDatabase();

    console.log('Limpando dados antigos...');
    await run('DELETE FROM clients');
    await run('DELETE FROM events');
    await run('DELETE FROM services');
    await run('DELETE FROM inventory');
    await run('DELETE FROM partners');
    await run('DELETE FROM contracts');
    await run('DELETE FROM checklists');
    await run('DELETE FROM transactions');

    console.log('Semeando Clientes...');
    await run(`INSERT INTO clients (name, type, document, phone, email, city, totalSpent, lastEvent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Ana Carolina Pereira', 'PF', '123.456.789-00', '(11) 98765-4321', 'ana.carol@email.com', 'São Paulo', 12500, 'Casamento - 15/03']);
    await run(`INSERT INTO clients (name, type, document, phone, email, city, totalSpent, lastEvent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['Eventos Tech S.A.', 'PJ', '12.345.678/0001-99', '(11) 3344-5566', 'contato@techcorp.com', 'Campinas', 45000, 'Workshop - 10/02']);

    console.log('Semeando Serviços...');
    await run(`INSERT INTO services (name, category, price, type, description) VALUES (?, ?, ?, ?, ?)`,
        ['Aluguel do Salão (Diária)', 'Aluguel', 2500, 'Fixo', 'Uso completo do espaço']);
    await run(`INSERT INTO services (name, category, price, type, description) VALUES (?, ?, ?, ?, ?)`,
        ['Buffet Churrasco Completo', 'Catering', 85, 'Por Pessoa', 'Buffet completo']);
    await run(`INSERT INTO services (name, category, price, type, description) VALUES (?, ?, ?, ?, ?)`,
        ['Decoração Rústica', 'Decoração', 1200, 'Fixo', 'Arranjos e iluminação']);

    console.log('Semeando Inventário...');
    await run(`INSERT INTO inventory (name, category, quantity, status, location) VALUES (?, ?, ?, ?, ?)`,
        ['Mesa Redonda 1,20m', 'Mobiliário', 45, 'Disponível', 'Depósito A']);
    await run(`INSERT INTO inventory (name, category, quantity, status, location) VALUES (?, ?, ?, ?, ?)`,
        ['Cadeira Tiffany Branca', 'Mobiliário', 250, 'Disponível', 'Depósito A']);

    console.log('Semeando Parceiros...');
    await run(`INSERT INTO partners (name, category, rating, phone, email, website, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Buffet Gourmet Premium', 'Catering', 4.9, '(11) 9999-0001', 'contato@buffetpremium.com', 'www.buffetpremium.com', 'Ativo']);
    await run(`INSERT INTO partners (name, category, rating, phone, email, website, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['DJ Sound & Light', 'Música/Som', 4.8, '(11) 9999-0002', 'dj@soundlight.com', 'www.soundlight.com', 'Ativo']);

    console.log('Semeando Contratos...');
    await run(`INSERT INTO contracts (id, client, type, date, total, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['C-2026-001', 'Aline Souza', 'Locação Social', '15/03/2026', 19000, 'Assinado']);

    console.log('Semeando Checklists...');
    await run(`INSERT INTO checklists (title, date, total, completed, priority) VALUES (?, ?, ?, ?, ?)`,
        ['Pré-Evento: Casamento Aline', '15/03/2026', 12, 8, 'Alta']);

    console.log('Banco de dados semeado com sucesso!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Erro ao semear banco de dados:', err);
    process.exit(1);
});
