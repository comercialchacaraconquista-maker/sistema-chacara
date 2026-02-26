import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    Plus,
    Search,
    Filter,
    Star,
    Phone,
    Mail,
    Globe,
    MoreVertical,
    Briefcase,
    Utensils,
    Music,
    ShieldCheck
} from 'lucide-react';

export default function Partners() {
    const [searchTerm, setSearchTerm] = useState('');
    const [partners, setPartners] = useState<any[]>([]);

    useEffect(() => {
        api.getPartners().then(setPartners).catch(console.error);
    }, []);

    const handleAddPartner = () => {
        const name = prompt('Nome do Parceiro:');
        if (!name) return;

        const category = prompt('Categoria:');

        const newPartner = {
            id: Math.random(),
            name,
            category: category || 'Geral',
            rating: 5.0,
            status: 'Ativo',
            phone: '(11) 99999-9999',
            email: 'contato@parceiro.com',
            services: ['Serviço Simulado']
        };

        setPartners([...partners, newPartner]);
        alert(`Parceiro "${name}" cadastrado com sucesso!`);
    };

    const filteredPartners = partners.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Catering': return <Utensils className="w-5 h-5" />;
            case 'Música/Som': return <Music className="w-5 h-5" />;
            case 'Segurança': return <ShieldCheck className="w-5 h-5" />;
            default: return <Briefcase className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Parceiros e Fornecedores</h2>
                    <p className="text-slate-500">Gerencie prestadores de serviços para locação</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleAddPartner}
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Parceiro</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar parceiros ou serviços..."
                        aria-label="Buscar parceiros"
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="btn-secondary"
                    onClick={() => alert('Abrindo opções de filtragem...')}
                >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPartners.map((partner) => (
                    <div key={partner.id} className="glass-card p-6 hover:shadow-2xl transition-all group border-l-4 border-l-transparent hover:border-l-primary-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                    {getCategoryIcon(partner.category)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-all">{partner.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-slate-600">{partner.rating}</span>
                                        <span className="text-xs text-slate-400 font-medium ml-2">• {partner.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${partner.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                {partner.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 my-6">
                            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-tight">
                                <Phone className="w-3.5 h-3.5 text-slate-300" />
                                {partner.phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-tight">
                                <Mail className="w-3.5 h-3.5 text-slate-300" />
                                <span className="truncate">{partner.email}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Serviços Extras Disponíveis</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(partner.services) ? partner.services.map((service: string, i: number) => (
                                    <span key={i} className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                                        {service}
                                    </span>
                                )) : (
                                    <span className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                                        {partner.services}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <button className="text-primary-600 text-xs font-bold hover:underline flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Visitar site
                            </button>
                            <div className="flex gap-2">
                                <button aria-label="Opções" className="p-1.5 text-slate-400 hover:text-slate-600">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                                <button className="btn-primary py-1 px-3 text-xs bg-slate-800 hover:bg-slate-900 shadow-none">
                                    Vincular à Locação
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
