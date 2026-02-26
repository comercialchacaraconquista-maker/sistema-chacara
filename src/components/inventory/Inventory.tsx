import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertCircle,
    ArrowRightLeft,
    Filter
} from 'lucide-react';

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState<any[]>([]);

    useEffect(() => {
        api.getInventory().then(setInventory).catch(console.error);
    }, []);

    const handleAddItem = () => {
        const name = prompt('Nome do Item:');
        if (!name) return;

        const category = prompt('Categoria:');
        const quantityStr = prompt('Quantidade:');
        const quantity = parseInt(quantityStr || '0');

        const newItem = {
            id: Math.random(),
            name,
            category: category || 'Geral',
            quantity,
            status: 'Disponível',
            location: 'Depósito Geral'
        };

        setInventory([...inventory, newItem]);
        alert(`Item "${name}" adicionado ao inventário com sucesso!`);
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Inventário de Ativos</h2>
                    <p className="text-slate-500">Controle de materiais, móveis e equipamentos</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleAddItem}
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Item</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar item no estoque..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => alert('Filtrar itens do inventário...')}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filtrar</span>
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4 text-center">Quantidade</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Localização</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                                <td className="px-6 py-4 text-center font-semibold">{item.quantity}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.status === 'Disponível' ? 'bg-emerald-50 text-emerald-600' :
                                        item.status === 'Em Manutenção' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{item.location}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-1.5 text-slate-400 hover:text-primary-600"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-black text-slate-800">420</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total de Itens</p></div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-black text-slate-800">12</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Atenção / Reposição</p></div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl"><ArrowRightLeft className="w-6 h-6" /></div>
                    <div><p className="text-2xl font-black text-slate-800">8</p><p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Movimentações Hoje</p></div>
                </div>
            </div>
        </div>
    );
}
