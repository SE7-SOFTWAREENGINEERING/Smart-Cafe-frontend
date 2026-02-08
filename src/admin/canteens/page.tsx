import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Leaf, CheckCircle, X, Users, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';
import * as canteenService from '../../services/canteen.service';
import type { Canteen } from '../../services/canteen.service';
import toast from 'react-hot-toast';

const AdminCanteens: React.FC = () => {
    const [canteens, setCanteens] = useState<Canteen[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCanteen, setEditingCanteen] = useState<Canteen | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Canteen>>({
        name: '', location: '', status: 'Open', crowd: 'Low', capacity: 100, occupancy: 0,
        ecoScore: 'B', isActive: true, imageColor: 'bg-orange-100', description: '',
        operatingHours: { open: '08:00', close: '20:00' }
    });

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        loadCanteens();
    }, []);

    const loadCanteens = async () => {
        try {
            setLoading(true);
            const data = await canteenService.getCanteens();
            setCanteens(data);
        } catch (error) {
            toast.error('Failed to load canteens');
        } finally {
            setLoading(false);
        }
    };

    const filteredCanteens = canteens.filter(canteen => {
        const matchesSearch = canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            canteen.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || canteen.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (canteen: Canteen) => {
        setEditingCanteen(canteen);
        setFormData({
            name: canteen.name,
            location: canteen.location || '',
            status: canteen.status,
            crowd: canteen.crowd,
            capacity: canteen.capacity,
            occupancy: canteen.occupancy,
            ecoScore: canteen.ecoScore,
            isActive: canteen.isActive,
            imageColor: canteen.imageColor || 'bg-orange-100',
            description: canteen.description || '',
            operatingHours: canteen.operatingHours || { open: '08:00', close: '20:00' }
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this canteen?')) {
            try {
                await canteenService.deleteCanteen(id);
                toast.success('Canteen deleted');
                loadCanteens();
            } catch (error) {
                toast.error('Failed to delete canteen');
            }
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await canteenService.toggleCanteenStatus(id);
            loadCanteens();
        } catch (error) {
            toast.error('Failed to toggle status');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCanteen) {
                await canteenService.updateCanteen(editingCanteen.id, formData);
                toast.success('Canteen updated');
            } else {
                await canteenService.createCanteen(formData);
                toast.success('Canteen created');
            }
            setIsModalOpen(false);
            setEditingCanteen(null);
            resetForm();
            loadCanteens();
        } catch (error) {
            toast.error('Failed to save canteen');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', location: '', status: 'Open', crowd: 'Low', capacity: 100, occupancy: 0,
            ecoScore: 'B', isActive: true, imageColor: 'bg-orange-100', description: '',
            operatingHours: { open: '08:00', close: '20:00' }
        });
    };

    const getCrowdColor = (level: string) => {
        switch (level) {
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-100 text-gray-500';
            case 'Closing Soon': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const colorOptions = [
        { value: 'bg-orange-100', label: 'Orange' },
        { value: 'bg-green-100', label: 'Green' },
        { value: 'bg-blue-100', label: 'Blue' },
        { value: 'bg-purple-100', label: 'Purple' },
        { value: 'bg-pink-100', label: 'Pink' },
        { value: 'bg-yellow-100', label: 'Yellow' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Canteen Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage canteens, capacity, status, and eco-scores.</p>
                </div>
                <Button onClick={() => { setEditingCanteen(null); resetForm(); setIsModalOpen(true); }}>
                    <Plus size={16} className="mr-2" />
                    Add Canteen
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search canteens..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Closing Soon">Closing Soon</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Canteen</th>
                            <th className="px-6 py-3 font-medium">Location</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Crowd</th>
                            <th className="px-6 py-3 font-medium">Capacity</th>
                            <th className="px-6 py-3 font-medium">Eco Score</th>
                            <th className="px-6 py-3 font-medium">Active</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCanteens.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                    No canteens found. Add your first canteen!
                                </td>
                            </tr>
                        ) : (
                            filteredCanteens.map((canteen) => (
                                <tr key={canteen.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-gray-600", canteen.imageColor || 'bg-orange-100')}>
                                                {canteen.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{canteen.name}</div>
                                                {canteen.description && (
                                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{canteen.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin size={14} />
                                            <span>{canteen.location || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusColor(canteen.status))}>
                                            {canteen.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border", getCrowdColor(canteen.crowd))}>
                                            <Users size={12} />
                                            {canteen.crowd}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className="font-medium">{canteen.occupancy}</span>
                                            <span className="text-gray-400"> / {canteen.capacity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Leaf size={14} className={cn(
                                                canteen.ecoScore === 'A' ? "text-green-600" :
                                                    canteen.ecoScore === 'B' ? "text-lime-500" :
                                                        canteen.ecoScore === 'C' ? "text-yellow-500" :
                                                            "text-red-500"
                                            )} />
                                            <span className="font-bold">{canteen.ecoScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleToggleActive(canteen.id)} className="focus:outline-none">
                                            {canteen.isActive ? (
                                                <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} className="mr-1" /> Active</span>
                                            ) : (
                                                <span className="flex items-center text-gray-400 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full"><X size={12} className="mr-1" /> Inactive</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(canteen)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(canteen.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{editingCanteen ? 'Edit Canteen' : 'New Canteen'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Canteen['status'] })}>
                                        <option>Open</option><option>Closed</option><option>Closing Soon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Crowd Level</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.crowd} onChange={e => setFormData({ ...formData, crowd: e.target.value as Canteen['crowd'] })}>
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input required type="number" min={1} className="w-full px-3 py-2 border rounded-lg" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupancy</label>
                                    <input type="number" min={0} className="w-full px-3 py-2 border rounded-lg" value={formData.occupancy} onChange={e => setFormData({ ...formData, occupancy: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Eco Score</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.ecoScore} onChange={e => setFormData({ ...formData, ecoScore: e.target.value as Canteen['ecoScore'] })}>
                                        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.imageColor} onChange={e => setFormData({ ...formData, imageColor: e.target.value })}>
                                        {colorOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                                    <input type="time" className="w-full px-3 py-2 border rounded-lg" value={formData.operatingHours?.open || '08:00'} onChange={e => setFormData({ ...formData, operatingHours: { ...formData.operatingHours!, open: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                                    <input type="time" className="w-full px-3 py-2 border rounded-lg" value={formData.operatingHours?.close || '20:00'} onChange={e => setFormData({ ...formData, operatingHours: { ...formData.operatingHours!, close: e.target.value } })} />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                                <Button type="submit">Save Canteen</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCanteens;
