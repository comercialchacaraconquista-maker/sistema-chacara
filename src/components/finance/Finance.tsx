import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

export default function Finance() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.getTransactions().then(setTransactions).catch(console.error);
    }, []);

    const totals = transactions.reduce((acc, t) => {
        if (t.type === 'Entrada') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
    }, { income: 0, expense: 0 });

    const filteredTransactions = transactions.filter(t =>
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
                    <p className="text-slate-500">Controle de entradas, saídas e fluxo de caixa</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </button>
                    <button className="btn-primary"
                        onClick={() => {
                            const desc = prompt('Descrição da Transação:');
                            if (desc) alert(`Transação "${desc}" registrada no fluxo de caixa!`);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nova Transação</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowUpCircle className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+12%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Recebido</h3>
                    <p className="text-2xl font-bold text-slate-800">R$ {totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-rose-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <ArrowDownCircle className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">-5%</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Total Saídas</h3>
                    <p className="text-2xl font-bold text-slate-800">R$ {totals.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-primary-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">SALDO</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Lucro Líquido</h3>
                    <p className="text-2xl font-bold text-slate-800">R$ {(totals.income - totals.expense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-slate-800 text-lg">Transações Recentes</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                aria-label="Buscar transações"
                                className="input-field pl-9 py-1.5 text-sm w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button aria-label="Filtrar transações"
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-500"
                            onClick={() => alert('Filtros avançados em breve!')}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Cliente/Descrição</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Método</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(t.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800">{t.client}</p>
                                        <p className="text-[10px] text-slate-400">{t.type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{t.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-bold ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'Entrada' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'Pago' ? 'bg-emerald-50 text-emerald-600' :
                                            t.status === 'Parcial' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {t.status === 'Pago' ? <CheckCircle2 className="w-3 h-3" /> :
                                                t.status === 'Parcial' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {t.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                        {t.method}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button aria-label="Opções" className="p-1.5 text-slate-400 hover:text-primary-600 transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100">
                    <button className="text-sm font-bold text-primary-600 hover:underline">Ver relatório completo</button>
                </div>
            </div>
        </div>
    );
}
