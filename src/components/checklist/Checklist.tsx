import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
    Plus,
    ListTodo,
    Clock,
    CheckCircle2,
    X,
    Check,
    Calendar,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export default function Checklist() {
    const [activeFilter, setActiveFilter] = useState('todos');
    const [checklists, setChecklists] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedChecklist, setSelectedChecklist] = useState<any | null>(null);

    // New Checklist State
    const [newChecklistData, setNewChecklistData] = useState({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        priority: 'Média',
        items: [] as { id: string, text: string, completed: boolean }[]
    });
    const [newItemText, setNewItemText] = useState('');

    const fetchChecklists = async () => {
        try {
            const data = await api.getChecklists();
            setChecklists(data);
        } catch (error) {
            console.error('Erro ao buscar checklists:', error);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, []);

    const handleCreateChecklist = async () => {
        if (!newChecklistData.title || newChecklistData.items.length === 0) {
            alert('Por favor, preencha o título e adicione pelo menos uma tarefa.');
            return;
        }

        try {
            const payload = {
                ...newChecklistData,
                total: newChecklistData.items.length,
                completed: 0
            };
            await api.createChecklist(payload);
            setIsCreateModalOpen(false);
            setNewChecklistData({
                title: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                priority: 'Média',
                items: []
            });
            fetchChecklists();
        } catch (error) {
            alert('Erro ao criar checklist.');
        }
    };

    const handleToggleItem = async (checklist: any, itemId: string) => {
        const updatedItems = checklist.items.map((item: any) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        const completedCount = updatedItems.filter((i: any) => i.completed).length;

        const updatedChecklist = {
            ...checklist,
            items: updatedItems,
            completed: completedCount,
            total: updatedItems.length
        };

        try {
            await api.updateChecklist(checklist.id, updatedChecklist);
            setChecklists(prev => prev.map(c => c.id === checklist.id ? updatedChecklist : c));
            if (selectedChecklist?.id === checklist.id) {
                setSelectedChecklist(updatedChecklist);
            }
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
        }
    };

    const addItemToNew = () => {
        if (!newItemText) return;
        setNewChecklistData({
            ...newChecklistData,
            items: [...newChecklistData.items, { id: Date.now().toString(), text: newItemText, completed: false }]
        });
        setNewItemText('');
    };

    const removeItemFromNew = (id: string) => {
        setNewChecklistData({
            ...newChecklistData,
            items: newChecklistData.items.filter(i => i.id !== id)
        });
    };

    const filteredChecklists = checklists.filter(item => {
        if (activeFilter === 'todos') return true;
        if (activeFilter === 'pendentes') return (item.completed / item.total) < 1;
        if (activeFilter === 'concluídos') return (item.completed / item.total) === 1;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Checklists de Operação</h2>
                    <p className="text-slate-500">Controle de tarefas pré, durante e pós evento</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    <span>Criar Checklist</span>
                </button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 w-fit rounded-lg">
                {['Todos', 'Pendentes', 'Concluídos'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter.toLowerCase())}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeFilter === filter.toLowerCase() ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChecklists.map((item) => {
                    const total = item.total || 1;
                    const percent = (item.completed / total) * 100;
                    return (
                        <div key={item.id} className="glass-card p-6 flex flex-col gap-4 group hover:shadow-xl transition-all cursor-pointer border hover:border-primary-200"
                            onClick={() => setSelectedChecklist(item)}>
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg transition-all ${percent === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                                    }`}>
                                    <ListTodo className="w-5 h-5" />
                                </div>
                                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.priority === 'Alta' ? 'bg-rose-50 text-rose-600' :
                                        item.priority === 'Média' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                                    }`}>
                                    {item.priority}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-all">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {item.date}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span className="text-slate-400">Progresso</span>
                                    <span className="text-primary-600">{Math.round(percent)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${percent === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${percent}%` }} />
                                </div>
                                <div className="flex justify-between text-[10px] font-medium text-slate-400">
                                    <span>{item.completed} tarefas concluídas</span>
                                    <span>{item.total} total</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                                <div className="flex items-center gap-1">
                                    {percent === 100 ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-amber-500" />
                                    )}
                                    <span className={`text-[10px] font-bold uppercase ${percent === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {percent === 100 ? 'Finalizado' : 'Em andamento'}
                                    </span>
                                </div>
                                <button className="text-[10px] font-bold text-primary-600 hover:underline uppercase tracking-wider">Ver Tarefas</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Checklist Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">Novo Checklist</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título do Checklist</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        placeholder="Ex: Checklist Pré-Casamento"
                                        value={newChecklistData.title}
                                        onChange={e => setNewChecklistData({ ...newChecklistData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newChecklistData.date}
                                        onChange={e => setNewChecklistData({ ...newChecklistData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prioridade</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={newChecklistData.priority}
                                        onChange={e => setNewChecklistData({ ...newChecklistData, priority: e.target.value })}
                                    >
                                        <option value="Baixa">Baixa</option>
                                        <option value="Média">Média</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3 text-primary-600">Adicionar Tarefas</label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        placeholder="Digite a tarefa..."
                                        value={newItemText}
                                        onChange={e => setNewItemText(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && addItemToNew()}
                                    />
                                    <button
                                        onClick={addItemToNew}
                                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-bold"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {newChecklistData.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                                            <span className="text-sm font-medium text-slate-700">{item.text}</span>
                                            <button
                                                onClick={() => removeItemFromNew(item.id)}
                                                className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {newChecklistData.items.length === 0 && (
                                        <p className="text-center py-6 text-sm text-slate-400 italic">Nenhuma tarefa adicionada ainda.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateChecklist}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                            >
                                Criar Checklist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist Detail View (Items Toggle) */}
            {selectedChecklist && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{selectedChecklist.title}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">{selectedChecklist.date}</p>
                            </div>
                            <button onClick={() => setSelectedChecklist(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="p-4 bg-primary-50 rounded-xl flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-primary-600 uppercase">Progresso Geral</span>
                                        <span className="text-primary-700">{Math.round((selectedChecklist.completed / selectedChecklist.total) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 transition-all duration-500"
                                            style={{ width: `${(selectedChecklist.completed / selectedChecklist.total) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedChecklist.items?.map((item: any) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggleItem(selectedChecklist, item.id)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${item.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-primary-200'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'
                                            }`}>
                                            {item.completed && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-all ${item.completed ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'
                                            }`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                                {(!selectedChecklist.items || selectedChecklist.items.length === 0) && (
                                    <div className="text-center py-10 opacity-30">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                                        <p className="text-sm">Nenhum item neste checklist.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setSelectedChecklist(null)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-all"
                            >
                                Fechar Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
