const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api';

export const api = {
    // Clients
    getClients: async () => {
        const res = await fetch(`${API_BASE_URL}/clients`);
        if (!res.ok) throw new Error('Falha ao carregar clientes');
        return res.json();
    },
    createClient: async (client: any) => {
        const res = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        return res.json();
    },

    // Events
    getEvents: async () => {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error('Falha ao carregar eventos');
        return res.json();
    },
    createEvent: async (event: any) => {
        const res = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Falha ao salvar evento');
        }
        return res.json();
    },
    updateEvent: async (id: number | string, event: any) => {
        const res = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Falha ao atualizar evento');
        }
        return res.json();
    },

    // Services (Catalog)
    getServices: async () => {
        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) throw new Error('Falha ao carregar catálogo');
        return res.json();
    },

    // Inventory
    getInventory: async () => {
        const res = await fetch(`${API_BASE_URL}/inventory`);
        if (!res.ok) throw new Error('Falha ao carregar inventário');
        return res.json();
    },

    // Partners
    getPartners: async () => {
        const res = await fetch(`${API_BASE_URL}/partners`);
        if (!res.ok) throw new Error('Falha ao carregar parceiros');
        return res.json();
    },

    // Transactions
    getTransactions: async () => {
        const res = await fetch(`${API_BASE_URL}/transactions`);
        if (!res.ok) throw new Error('Falha ao carregar transações');
        return res.json();
    },
    createTransaction: async (transaction: any) => {
        const res = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Falha ao salvar transação');
        }
        return res.json();
    },

    // Contracts
    getContracts: async () => {
        const res = await fetch(`${API_BASE_URL}/contracts`);
        if (!res.ok) throw new Error('Falha ao carregar contratos');
        return res.json();
    },

    // Checklists
    getChecklists: async () => {
        const res = await fetch(`${API_BASE_URL}/checklists`);
        if (!res.ok) throw new Error('Falha ao carregar checklists');
        return res.json();
    },
    createChecklist: async (checklist: any) => {
        const res = await fetch(`${API_BASE_URL}/checklists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checklist),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Falha ao salvar checklist');
        }
        return res.json();
    },
    updateChecklist: async (id: number | string, checklist: any) => {
        const res = await fetch(`${API_BASE_URL}/checklists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checklist),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Falha ao atualizar checklist');
        }
        return res.json();
    },
};
