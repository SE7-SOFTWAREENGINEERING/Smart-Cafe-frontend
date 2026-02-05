import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Leaf, CheckCircle, X } from 'lucide-react';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';
import type { MenuItem } from '../../types';

// Mock Data
const MOCK_MENU: MenuItem[] = [
    { id: 1, name: 'Avocado Toast', price: 150, mealType: 'Breakfast', dietaryType: 'Vegan', allergens: ['Gluten'], ecoScore: 'A', portionSize: 'Regular', isAvailable: true },
    { id: 2, name: 'Chicken Biryani', price: 220, mealType: 'Lunch', dietaryType: 'Non-Veg', allergens: [], ecoScore: 'D', portionSize: 'Regular', isAvailable: true },
    { id: 3, name: 'Paneer Wrap', price: 180, mealType: 'Snacks', dietaryType: 'Veg', allergens: ['Dairy', 'Gluten'], ecoScore: 'B', portionSize: 'Small', isAvailable: false },
    { id: 4, name: 'Jain Burger', price: 120, mealType: 'Snacks', dietaryType: 'Jain', allergens: ['Gluten'], ecoScore: 'A', portionSize: 'Regular', isAvailable: true },
];

const AdminMenu: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>(MOCK_MENU);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: '', price: 0, mealType: 'Lunch', dietaryType: 'Veg', allergens: [], ecoScore: 'B', portionSize: 'Regular', isAvailable: true
    });

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [mealFilter, setMealFilter] = useState('All');
    const [dietaryFilter, setDietaryFilter] = useState('All');

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMeal = mealFilter === 'All' || item.mealType === mealFilter;
        const matchesDiet = dietaryFilter === 'All' || item.dietaryType === dietaryFilter;
        return matchesSearch && matchesMeal && matchesDiet;
    });

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this item?')) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    const handleToggleAvailability = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setItems(items.map(i => i.id === editingItem.id ? { ...formData, id: editingItem.id } as MenuItem : i));
        } else {
            setItems([...items, { ...formData, id: Date.now() } as MenuItem]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', price: 0, mealType: 'Lunch', dietaryType: 'Veg', allergens: [], ecoScore: 'B', portionSize: 'Regular', isAvailable: true });
    };



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Menu & Sustainability</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage dishes, dietary labels, and eco-scores.</p>
                </div>
                <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
                    <Plus size={16} className="mr-2" />
                    Add Item
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={mealFilter}
                        onChange={(e) => setMealFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="All">All Meals</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snacks">Snacks</option>
                    </select>
                    <select
                        value={dietaryFilter}
                        onChange={(e) => setDietaryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="All">All Dietary</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Jain">Jain</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Item Name</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Dietary</th>
                            <th className="px-6 py-3 font-medium">Eco Score</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {item.name}
                                    <div className="text-xs text-gray-400 font-normal mt-0.5">₹{item.price} • {item.portionSize}</div>
                                </td>
                                <td className="px-6 py-4">{item.mealType}</td>
                                <td className="px-6 py-4">
                                    <span className={cn("px-2 py-1 rounded text-xs font-semibold border",
                                        item.dietaryType === 'Veg' ? "bg-green-50 text-green-700 border-green-200" :
                                            item.dietaryType === 'Non-Veg' ? "bg-red-50 text-red-700 border-red-200" :
                                                item.dietaryType === 'Vegan' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    "bg-orange-50 text-orange-700 border-orange-200"
                                    )}>
                                        {item.dietaryType}
                                    </span>
                                    {item.allergens.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {item.allergens.map(a => <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded">{a}</span>)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Leaf size={14} className={cn(
                                            item.ecoScore === 'A' ? "text-green-600" :
                                                item.ecoScore === 'B' ? "text-lime-500" :
                                                    item.ecoScore === 'C' ? "text-yellow-500" :
                                                        "text-red-500"
                                        )} />
                                        <span className="font-bold">{item.ecoScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleToggleAvailability(item.id)} className="focus:outline-none">
                                        {item.isAvailable ? (
                                            <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} className="mr-1" /> Available</span>
                                        ) : (
                                            <span className="flex items-center text-gray-400 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full"><X size={12} className="mr-1" /> Sold Out</span>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Item' : 'New Menu Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input required type="number" className="w-full px-3 py-2 border rounded-lg" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.mealType} onChange={e => setFormData({ ...formData, mealType: e.target.value as any })}>
                                        <option>Breakfast</option><option>Lunch</option><option>Snacks</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Type</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.dietaryType} onChange={e => setFormData({ ...formData, dietaryType: e.target.value as any })}>
                                        <option>Veg</option><option>Non-Veg</option><option>Vegan</option><option>Jain</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma separated)</label>
                                <input type="text" placeholder="Gluten, Dairy, Nuts" className="w-full px-3 py-2 border rounded-lg"
                                    value={formData.allergens?.join(', ')}
                                    onChange={e => setFormData({ ...formData, allergens: e.target.value.split(',').map(s => s.trim()) })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Eco Score</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.ecoScore} onChange={e => setFormData({ ...formData, ecoScore: e.target.value as any })}>
                                        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Portion Size</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.portionSize} onChange={e => setFormData({ ...formData, portionSize: e.target.value as any })}>
                                        <option>Regular</option><option>Small</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                                <Button type="submit">Save Item</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
