import React from 'react';
import {
    BarChart3,
    Calendar,
    Users,
    Wallet,
    FileText,
    CheckSquare,
    Package,
    LogOut,
    Menu,
    X,
    Plus,
    Handshake,
    Tag
} from 'lucide-react';

// Types
export type NavItem = {
    label: string;
    icon: React.ReactNode;
    id: string;
};

const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, id: 'dashboard' },
    { label: 'Agenda', icon: <Calendar className="w-5 h-5" />, id: 'agenda' },
    { label: 'Clientes', icon: <Users className="w-5 h-5" />, id: 'clients' },
    { label: 'Financeiro', icon: <Wallet className="w-5 h-5" />, id: 'finance' },
    { label: 'Contratos', icon: <FileText className="w-5 h-5" />, id: 'contracts' },
    { label: 'Checklist', icon: <CheckSquare className="w-5 h-5" />, id: 'checklist' },
    { label: 'Inventário', icon: <Package className="w-5 h-5" />, id: 'inventory' },
    { label: 'Parceiros', icon: <Handshake className="w-5 h-5" />, id: 'partners' },
    { label: 'Catálogo', icon: <Tag className="w-5 h-5" />, id: 'services' },
];

export default function Layout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (id: string) => void }) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Close sidebar on mobile when tab changes
    const handleTabChange = (id: string) => {
        setActiveTab(id);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0 transform transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64 lg:w-20'}
                bg-white border-r border-slate-200 flex flex-col
            `}>
                <div className="p-6 flex items-center justify-between">
                    {(isSidebarOpen || window.innerWidth >= 1024) ? (
                        <h1 className="text-xl font-bold text-primary-600 tracking-tight whitespace-nowrap">
                            CHÁCARA <span className="text-slate-400 font-light">PRO</span>
                        </h1>
                    ) : (
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className={activeTab === item.id ? 'text-primary-600' : 'text-slate-400'}>
                                {item.icon}
                            </div>
                            <span className={`${!isSidebarOpen && 'lg:hidden'}`}>{item.label}</span>
                            {activeTab === item.id && (isSidebarOpen || window.innerWidth < 1024) && <div className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <LogOut className="w-5 h-5 text-slate-400" />
                        <span className={`${!isSidebarOpen && 'lg:hidden'}`}>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-slate-50">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                            aria-label="Toggle Menu"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 capitalize truncate max-w-[120px] md:max-w-none">{activeTab}</h2>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <button
                            className="btn-primary px-3 lg:px-4"
                            onClick={() => {
                                const name = prompt('Título do Novo Evento:');
                                if (name) alert(`Evento "${name}" agendado para demonstração!`);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Novo Evento</span>
                        </button>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 shrink-0">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff" alt="User" />
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
