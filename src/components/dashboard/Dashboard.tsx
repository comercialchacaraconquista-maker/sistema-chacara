import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    Calendar as CalendarIcon,
    TrendingUp,
    DollarSign,
    Clock,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
    <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default function Dashboard() {
    const [clients, setClients] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        api.getClients().then(setClients).catch(console.error);
        api.getTransactions().then(setTransactions).catch(console.error);
        api.getEvents().then(setEvents).catch(console.error);
    }, []);

    const totalRevenue = transactions.reduce((acc: number, t: any) => t.type === 'Receita' ? acc + t.amount : acc, 0);
    const pendingRevenue = transactions.reduce((acc: number, t: any) => t.status === 'Pendente' ? acc + t.amount : acc, 0);
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Próximo Evento"
                    value={events.length > 0 ? `Em breve` : 'Nenhum'}
                    icon={Clock}
                    trend="up"
                    trendValue="12"
                    color="primary"
                />
                <StatCard
                    title="Clientes Cadastrados"
                    value={clients.length.toString()}
                    icon={CalendarIcon}
                    trend="up"
                    trendValue="8"
                    color="indigo"
                />
                <StatCard
                    title="Faturamento Total"
                    value={`R$ ${totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="15"
                    color="emerald"
                />
                <StatCard
                    title="Receita Pendente"
                    value={`R$ ${pendingRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="down"
                    trendValue="4"
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Faturamento Mensal</h3>
                            <p className="text-sm text-slate-500">Acompanhamento de entradas líquidas</p>
                        </div>
                        <select aria-label="Período de faturamento" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                            <option>Últimos 6 meses</option>
                            <option>Ano atual</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(value) => `R$ ${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Next Events List */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Próximos Eventos</h3>
                        <button className="text-primary-600 text-sm font-semibold hover:underline">Ver todos</button>
                    </div>
                    <div className="space-y-4">
                        {events.length > 0 ? events.slice(0, 5).map((event: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex flex-col items-center justify-center font-bold">
                                    <span className="text-xs font-medium uppercase tracking-tighter">Event</span>
                                    <span className="text-lg leading-none">{i + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{event.title}</h4>
                                    <p className="text-xs text-slate-500">{event.start} - {event.end} • {event.guests} convidados</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-all" />
                            </div>
                        )) : (
                            <p className="text-sm text-slate-400 text-center py-4">Nenhum evento agendado</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
