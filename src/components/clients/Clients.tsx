import {
    Search,
    Plus,
    User,
    Phone,
    Mail,
    Calendar,
    ChevronRight,
    Filter
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';


export default function Clients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<any[]>([]);

    const fetchClients = () => {
        api.getClients().then(setClients).catch(console.error);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async () => {
        const name = prompt('Nome do Cliente:');
        if (!name) return;

        try {
            await api.createClient({
                name,
                email: `${name.toLowerCase().replace(/\s/g, '.')}@email.com`,
                phone: '(11) 99999-0000',
                document: '000.000.000-00',
                type: 'PF',
                status: 'Ativo'
            });
            alert('Cliente cadastrado com sucesso!');
            fetchClients();
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar cliente.');
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h2 className="text-2xl font-bold text-slate-800">Clientes</h2><p className="text-slate-500">Gerencie sua base de clientes</p></div>
                <button
                    className="btn-primary"
                    onClick={handleAddClient}
                >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Cliente</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" placeholder="Buscar..." aria-label="Buscar clientes" className="input-field pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => alert('Filtragem avançada de clientes em breve!')}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                    <div
                        key={client.id}
                        className="glass-card p-6 hover:shadow-2xl transition-all cursor-pointer group hover:border-primary-100"
                        onClick={() => alert(`Visualizando Perfil de: ${client.name}`)}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all"><User className="w-6 h-6" /></div>
                            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${client.status === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{client.status}</div>
                        </div>
                        <div className="mb-6"><h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-all">{client.name}</h3><p className="text-xs text-slate-400 font-medium">{client.document}</p></div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Phone className="w-4 h-4 text-slate-400" />{client.phone}</div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium"><Mail className="w-4 h-4 text-slate-400" /><span className="truncate">{client.email}</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div><p className="text-[10px] uppercase font-bold text-slate-400">Total Gasto</p><p className="text-sm font-bold text-slate-800">R$ {(client.totalSpent || 0).toLocaleString()}</p></div>
                            <div><p className="text-[10px] uppercase font-bold text-slate-400">Eventos</p><p className="text-sm font-bold text-slate-800">{client.eventsCount || 0}</p></div>
                        </div>
                        <div className="mt-6 flex items-center justify-between"><div className="flex items-center gap-1 text-[10px] font-medium text-slate-400"><Calendar className="w-3 h-3" />Último: {client.lastEvent ? new Date(client.lastEvent).toLocaleDateString('pt-BR') : 'Sem eventos'}</div><ChevronRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
