import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Layers,
    ShoppingBag,
    Info
} from 'lucide-react';

export default function ServiceCatalog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        api.getServices().then(setServices).catch(console.error);
    }, []);

    const handleAddService = () => {
        const name = prompt('Nome do Serviço/Item:');
        if (!name) return;

        const category = prompt('Categoria (ex: Buffet, Aluguel, Som):');
        const priceStr = prompt('Preço (somente números):');
        const price = parseFloat(priceStr || '0');

        const newService = {
            id: Math.random(),
            name,
            category: category || 'Outros',
            price,
            type: 'Fixo',
            description: 'Item adicionado via simulação'
        };

        setServices([...services, newService]);
        alert(`Serviço "${name}" cadastrado com sucesso!`);
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Catálogo de Serviços e Preços</h2>
                    <p className="text-slate-500">Defina os valores de locação e serviços adicionais</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleAddService}
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Item</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar no catálogo..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="glass-card p-2 flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
                    <Layers className="w-4 h-4" />
                    <span>Categorias: 5</span>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 truncate">Item / Serviço</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Tipo de Cobrança</th>
                            <th className="px-6 py-4">Preço Base</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredServices.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                        <span className="text-[10px] text-slate-400">{item.description}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${item.category === 'Aluguel' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-600 font-medium">{item.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-800">
                                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg border border-transparent hover:border-slate-200">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg border border-transparent hover:border-slate-200">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-amber-500 flex items-start gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Info className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">Dica de Precificação</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Serviços "Por Pessoa" (como Buffets) são calculados automaticamente com base na quantidade de convidados informada na agenda do evento.
                        </p>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-primary-500 flex items-start gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">Vendas Casadas</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Você pode criar pacotes promocionais que incluem Aluguel + Buffet para aumentar o ticket médio das suas locações.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
