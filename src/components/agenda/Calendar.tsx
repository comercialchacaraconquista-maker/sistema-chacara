import { useState, useMemo, useEffect } from 'react';
import { api } from '../../services/api';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isWithinInterval,
    startOfDay,
    endOfDay,
    parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Trash2,
    User,
    Package,
    Edit2
} from 'lucide-react';

// No mock events needed - fetching from API

export default function Calendar() {
    const [events, setEvents] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [catalog, setCatalog] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEventData, setNewEventData] = useState({
        title: '',
        guests: 0,
        start: '08:00',
        end: '18:00',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        basePrice: 2500,
        client_id: '',
        selectedServices: [] as any[],
        paymentMethod: 'PIX'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);

    const getSuggestedPrice = (date: Date) => {
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        return (day >= 1 && day <= 4) ? 1500 : 2500;
    };

    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        setNewEventData(prev => ({
            ...prev,
            startDate: formattedDate,
            endDate: formattedDate,
            basePrice: getSuggestedPrice(selectedDate)
        }));
    }, [selectedDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, clientsData, catalogData] = await Promise.all([
                    api.getEvents(),
                    api.getClients(),
                    api.getServices()
                ]);

                const parsedEvents = eventsData.map((ev: any) => ({
                    ...ev,
                    extras: typeof ev.extras === 'string' ? JSON.parse(ev.extras) : (ev.extras || [])
                }));

                setEvents(parsedEvents);
                setClients(clientsData);
                setCatalog(catalogData);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            }
        };
        fetchData();
    }, []);

    const handleUpdateEvent = async (statusOverride?: string) => {
        if (!editingEventId) return;

        const updatedEvent = {
            title: newEventData.title,
            date: newEventData.startDate,
            start: newEventData.start,
            end: newEventData.end,
            startDate: newEventData.startDate,
            endDate: newEventData.endDate,
            guests: newEventData.guests,
            type: 'Evento Simulado',
            status: statusOverride || 'Confirmado',
            basePrice: newEventData.basePrice,
            paymentMethod: newEventData.paymentMethod,
            client_id: newEventData.client_id || null,
            isProposal: statusOverride === 'Orçamento',
            extras: newEventData.selectedServices.map(s => ({
                id: s.id.toString(),
                name: s.name,
                price: s.price,
                type: s.type
            }))
        };

        try {
            await api.updateEvent(editingEventId, updatedEvent);

            if (updatedEvent.status === 'Confirmado') {
                await createFinancialEntry({ ...updatedEvent, id: editingEventId });
            }

            setEvents(prev => prev.map(ev => ev.id === editingEventId ? { ...updatedEvent, id: editingEventId } : ev));
            setIsModalOpen(false);
            setIsEditing(false);
            setEditingEventId(null);
            setNewEventData({
                title: '',
                guests: 0,
                start: '08:00',
                end: '18:00',
                startDate: format(selectedDate, 'yyyy-MM-dd'),
                endDate: format(selectedDate, 'yyyy-MM-dd'),
                basePrice: getSuggestedPrice(selectedDate),
                client_id: '',
                selectedServices: [],
                paymentMethod: 'PIX'
            });
            alert(`Evento atualizado com sucesso como ${updatedEvent.status}!`);
        } catch (error: any) {
            console.error('Erro ao atualizar:', error);
            alert(`Erro ao atualizar: ${error.message}`);
        }
    };

    const handleAddEvent = async (statusOverride?: string) => {
        if (!newEventData.title) return;

        if (isEditing && editingEventId) {
            handleUpdateEvent(statusOverride);
            return;
        }

        const newEvent = {
            title: newEventData.title,
            date: newEventData.startDate,
            start: newEventData.start,
            end: newEventData.end,
            startDate: newEventData.startDate,
            endDate: newEventData.endDate,
            guests: newEventData.guests,
            type: 'Evento Simulado',
            status: statusOverride || 'Confirmado',
            basePrice: newEventData.basePrice,
            paymentMethod: newEventData.paymentMethod,
            client_id: newEventData.client_id || null,
            isProposal: statusOverride === 'Orçamento',
            extras: newEventData.selectedServices.map(s => ({
                id: s.id.toString(),
                name: s.name,
                price: s.price,
                type: s.type
            }))
        };

        try {
            // Save to API
            const result = await api.createEvent(newEvent);
            const savedEvent = { ...newEvent, id: result.id };

            if (savedEvent.status === 'Confirmado') {
                await createFinancialEntry(savedEvent);
            }

            setEvents([...events, savedEvent]);
            setIsModalOpen(false);
            setNewEventData({
                title: '',
                guests: 0,
                start: '08:00',
                end: '18:00',
                startDate: format(selectedDate, 'yyyy-MM-dd'),
                endDate: format(selectedDate, 'yyyy-MM-dd'),
                basePrice: getSuggestedPrice(selectedDate),
                client_id: '',
                selectedServices: [],
                paymentMethod: 'PIX'
            });
            alert(`Evento "${newEvent.title}" agendado com sucesso como ${newEvent.status}!`);
        } catch (error: any) {
            console.error('Erro detalhado:', error);
            alert(`Erro ao salvar evento: ${error.message}`);
        }
    };

    const selectedEvent = useMemo(() =>
        events.find(e => {
            const start = startOfDay(e.startDate ? parseISO(e.startDate) : new Date(e.date));
            const end = endOfDay(e.endDate ? parseISO(e.endDate) : new Date(e.date));
            return isWithinInterval(selectedDate, { start, end });
        }),
        [selectedDate, events]);

    const handleEditClick = (event: any) => {
        setNewEventData({
            title: event.title,
            guests: event.guests || 0,
            start: event.start || '08:00',
            end: event.end || '18:00',
            startDate: event.startDate || event.date,
            endDate: event.endDate || event.date,
            basePrice: event.basePrice || 2500,
            client_id: event.client_id?.toString() || '',
            selectedServices: event.extras || [],
            paymentMethod: event.paymentMethod || 'PIX'
        });
        setIsEditing(true);
        setEditingEventId(event.id);
        setIsModalOpen(true);
    };

    const calculateTotal = (event: any) => {
        if (!event) return 0;
        // Temporary logic until event_services API is fully linked
        const extrasTotal = (event.extras || []).reduce((acc: number, item: any) => {
            if (item.type === 'Por Pessoa') return acc + (item.price * event.guests);
            return acc + item.price;
        }, 0);
        return (event.basePrice || 0) + extrasTotal;
    };

    const createFinancialEntry = async (event: any) => {
        try {
            const total = calculateTotal(event);
            const entryValue = total / 2;
            const clientName = clients.find(c => c.id === parseInt(event.client_id))?.name || 'Cliente Geral';

            await api.createTransaction({
                description: `Reserva 50% - ${event.title}`,
                amount: entryValue,
                date: format(new Date(), 'yyyy-MM-dd'),
                category: 'Locação',
                type: 'Entrada',
                status: 'Pago',
                client: clientName,
                method: event.paymentMethod || 'PIX',
                event_id: event.id
            });
            console.log('Entrada financeira registrada com sucesso');
        } catch (error) {
            console.error('Erro ao registrar entrada financeira:', error);
        }
    };

    const handleStatusUpdate = async (event: any, newStatus: string) => {
        try {
            const updatedEvent = {
                ...event,
                status: newStatus,
                isProposal: newStatus === 'Orçamento'
            };
            await api.updateEvent(event.id, updatedEvent);

            if (newStatus === 'Confirmado' && event.status !== 'Confirmado') {
                await createFinancialEntry({ ...updatedEvent, id: event.id });
            }

            setEvents(prev => prev.map(ev => ev.id === event.id ? { ...updatedEvent, id: event.id } : ev));
            alert(`Status do evento atualizado para ${newStatus}!`);
        } catch (error: any) {
            console.error('Erro ao atualizar status:', error);
            alert(`Erro ao atualizar status: ${error.message}`);
        }
    };

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <p className="text-slate-500">Gerencie suas reservas e disponibilidades</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1 mr-4">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Mês anterior" className="p-2 hover:bg-slate-50 rounded-md transition-all text-slate-600">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 hover:bg-slate-50 rounded-md transition-all text-sm font-medium text-slate-600 border-x border-slate-100 mx-1">
                        Hoje
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Próximo mês" className="p-2 hover:bg-slate-50 rounded-md transition-all text-slate-600">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    <span>Nova Venda / Reserva</span>
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map((day, index) => (
                    <div key={index} className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest pb-4">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const date = day;
                const formattedDate = format(day, 'd');
                const event = events.find(e => {
                    const start = startOfDay(e.startDate ? parseISO(e.startDate) : new Date(e.date));
                    const end = endOfDay(e.endDate ? parseISO(e.endDate) : new Date(e.date));
                    return isWithinInterval(date, { start, end });
                });
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[120px] p-2 border-r border-b border-slate-100 relative group transition-all cursor-pointer overflow-hidden ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'
                            } ${isSelected ? 'ring-2 ring-primary-500 ring-inset z-10' : 'hover:bg-slate-50'}`}
                        onClick={() => setSelectedDate(date)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${isToday ? 'bg-primary-600 text-white' : isCurrentMonth ? 'text-slate-800' : 'text-slate-300'
                                }`}>
                                {formattedDate}
                            </span>
                        </div>

                        {event && (
                            <div className={`mt-1 p-2 rounded-lg text-xs font-medium border animate-slide-up ${event.status === 'Confirmado'
                                ? 'bg-primary-50 text-primary-700 border-primary-100'
                                : event.status === 'Orçamento'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : 'bg-slate-50 text-slate-700 border-slate-100'
                                }`}>
                                <p className="font-bold truncate">{event.title}</p>
                                <div className="flex items-center justify-between mt-1 opacity-80">
                                    <span className="font-bold text-[10px] uppercase">{event.status}</span>
                                    <span className="font-bold">R$ {calculateTotal(event).toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div className="glass-card overflow-hidden border-slate-200">{rows}</div>;
    };

    return (
        <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            <div className="w-full lg:w-96 space-y-6">
                <div className="glass-card p-6 overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                        Simulação de Venda
                        <span className="text-xs font-medium bg-primary-50 text-primary-600 px-2 py-1 rounded-md">
                            {format(selectedDate, "dd/MM/yyyy")}
                        </span>
                    </h3>

                    {selectedEvent ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-xl font-bold text-slate-900 truncate">{selectedEvent.title}</h4>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleEditClick(selectedEvent)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-primary-600"
                                            title="Editar Agendamento"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                                            {selectedEvent.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Locação Base</span>
                                        <span className="font-bold text-slate-800">R$ {(selectedEvent.basePrice || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Serviços Adicionais (Venda)</p>
                                        {(selectedEvent.extras || []).map((ex: any, i: number) => (
                                            <div key={i} className="flex justify-between text-xs py-1 group">
                                                <span className="text-slate-700 flex items-center gap-1">
                                                    <Plus className="w-3 h-3 text-primary-500" />
                                                    {ex.name} {ex.type === 'Por Pessoa' && `(${(selectedEvent.guests || 0)}x)`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">
                                                        R$ {(ex.type === 'Por Pessoa' ? ex.price * (selectedEvent.guests || 0) : ex.price).toLocaleString()}
                                                    </span>
                                                    <button aria-label="Remover" className="text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-2 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Dados Financeiros</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Forma de Pagto.</span>
                                        <span className="font-bold text-slate-800">{selectedEvent.paymentMethod || 'Não definido'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/30">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold opacity-70">Valor Total do Pedido</p>
                                        <p className="text-2xl font-black">R$ {calculateTotal(selectedEvent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                {selectedEvent.status === 'Confirmado' && (
                                    <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-[10px] font-bold">
                                        <span className="opacity-70">ENTRADA 50%</span>
                                        <span className="bg-white/20 px-2 py-1 rounded">R$ {(calculateTotal(selectedEvent) / 2).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button
                                    onClick={() => handleStatusUpdate(selectedEvent, 'Orçamento')}
                                    className="btn-secondary justify-center text-xs"
                                >
                                    Gerar Orçamento
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(selectedEvent, 'Confirmado')}
                                    className="btn-primary justify-center text-xs bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                                >
                                    Aprovar Venda
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium px-6">Selecione uma data para simular uma nova venda ou visualize reservas existentes.</p>
                            <button
                                className="btn-primary w-full justify-center mt-6"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus className="w-4 h-4" /> Nova Locação + Extras
                            </button>
                        </div>
                    )}
                </div>

                <div className="glass-card p-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Metas Mensais</h4>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className="text-slate-400">ALUGUÉIS</span>
                                <span className="text-primary-600">85%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 w-[85%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className="text-slate-400">SERVIÇOS EXTRA</span>
                                <span className="text-emerald-600">42%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[42%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">
                                {isEditing ? 'Editar Agendamento' : 'Nova Locação'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setIsEditing(false);
                                    setEditingEventId(null);
                                }}
                                title="Fechar"
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título do Evento</label>
                                <input
                                    type="text"
                                    title="Título do Evento"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Ex: Casamento João e Maria"
                                    value={newEventData.title}
                                    onChange={e => setNewEventData({ ...newEventData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cliente</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <select
                                        title="Selecionar Cliente"
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                                        value={newEventData.client_id}
                                        onChange={e => setNewEventData({ ...newEventData, client_id: e.target.value })}
                                    >
                                        <option value="">Selecione um cliente...</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>{client.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Convidados</label>
                                    <input
                                        type="number"
                                        title="Número de Convidados"
                                        placeholder="0"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newEventData.guests}
                                        onChange={e => setNewEventData({ ...newEventData, guests: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Forma de Pagamento</label>
                                    <select
                                        title="Forma de Pagamento"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                                        value={newEventData.paymentMethod}
                                        onChange={e => setNewEventData({ ...newEventData, paymentMethod: e.target.value })}
                                    >
                                        <option value="PIX">PIX</option>
                                        <option value="Cartão">Cartão</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="Boleto">Boleto</option>
                                        <option value="Transferência">Transferência</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Negociado (R$)</label>
                                    <input
                                        type="number"
                                        title="Valor Negociado"
                                        placeholder="0"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-primary-600"
                                        value={newEventData.basePrice}
                                        onChange={e => setNewEventData({ ...newEventData, basePrice: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data Início</label>
                                    <input
                                        type="date"
                                        title="Data Início"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newEventData.startDate}
                                        onChange={e => setNewEventData({ ...newEventData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data Término</label>
                                    <input
                                        type="date"
                                        title="Data Término"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newEventData.endDate}
                                        onChange={e => setNewEventData({ ...newEventData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Horário Início</label>
                                    <input
                                        type="time"
                                        title="Horário Início"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newEventData.start}
                                        onChange={e => setNewEventData({ ...newEventData, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Horário Término</label>
                                    <input
                                        type="time"
                                        title="Horário Término"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newEventData.end}
                                        onChange={e => setNewEventData({ ...newEventData, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Serviços Adicionais
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {catalog.map(service => {
                                        const isSelected = newEventData.selectedServices.some(s => s.id === service.id);
                                        return (
                                            <div
                                                key={service.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'border-primary-200 bg-primary-50/50' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                                onClick={() => {
                                                    const updated = isSelected
                                                        ? newEventData.selectedServices.filter(s => s.id !== service.id)
                                                        : [...newEventData.selectedServices, service];
                                                    setNewEventData({ ...newEventData, selectedServices: updated });
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-300'
                                                        }`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{service.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{service.type}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-primary-600">
                                                    R$ {service.price.toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAddEvent('Orçamento')}
                                    className="flex-1 px-4 py-2 border border-slate-200 bg-white rounded-lg font-bold text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Gerar Orçamento
                                </button>
                                <button
                                    onClick={() => handleAddEvent('Confirmado')}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                                >
                                    {isEditing ? 'Salvar Alterações' : 'Confirmar Venda'}
                                </button>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full px-4 py-2 text-xs text-slate-400 hover:text-slate-600 font-medium"
                            >
                                Cancelar e Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
