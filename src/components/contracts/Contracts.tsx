import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    FileText,
    Plus,
    Search,
    Download,
    Eye,
    Mail,
    CheckCircle2,
    Clock,
    AlertTriangle
} from 'lucide-react';

export default function Contracts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [contracts, setContracts] = useState<any[]>([]);

    useEffect(() => {
        api.getContracts().then(setContracts).catch(console.error);
    }, []);

    const filteredContracts = contracts.filter(contract =>
        contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Contratos e Documentos</h2>
                    <p className="text-slate-500">Geração automática e controle de assinaturas</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => alert('Gerando novo contrato a partir do modelo...')}
                >
                    <Plus className="w-4 h-4" />
                    <span>Gerar Novo Contrato</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou ID do contrato..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => alert('Exportando lista de contratos (PDF/Excel)...')}
                >
                    <Download className="w-4 h-4" />
                    <span>Exportar Lista</span>
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID Contrato</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Data do Evento</th>
                                <th className="px-6 py-4">Valor Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredContracts.map((contract) => (
                                <tr key={contract.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-4 font-mono font-bold text-primary-600">{contract.id}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{contract.client}</td>
                                    <td className="px-6 py-4 text-slate-500">{contract.type}</td>
                                    <td className="px-6 py-4 text-slate-500">{contract.date}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">R$ {contract.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${contract.status === 'Assinado' ? 'bg-emerald-50 text-emerald-600' :
                                            contract.status === 'Pendente' ? 'bg-amber-50 text-amber-600' :
                                                contract.status === 'Cancelado' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {contract.status === 'Assinado' && <CheckCircle2 className="w-3 h-3" />}
                                            {contract.status === 'Pendente' && <Clock className="w-3 h-3" />}
                                            {contract.status === 'Cancelado' && <AlertTriangle className="w-3 h-3" />}
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button title="Visualizar" className="p-1.5 text-slate-400 hover:text-primary-600"><Eye className="w-4 h-4" /></button>
                                            <button title="Enviar por Email" className="p-1.5 text-slate-400 hover:text-primary-600"><Mail className="w-4 h-4" /></button>
                                            <button title="Baixar PDF" className="p-1.5 text-slate-400 hover:text-primary-600"><Download className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
