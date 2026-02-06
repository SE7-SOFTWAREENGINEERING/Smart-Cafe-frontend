import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  Search, Leaf, AlertTriangle, Check, ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/cn';



interface MenuItem {
  id: string;
  name: string;
  price: { small?: number; regular: number };
  category: 'Breakfast' | 'Lunch' | 'Snacks';
  type: 'Veg' | 'Non-Veg' | 'Vegan';
  isJain: boolean;
  allergens: string[];
  ecoScore: number; // 0-100
  imageColor: string;
}

// --- Mock Data ---


const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Masala Dosa', price: { regular: 60 }, category: 'Breakfast', type: 'Veg', isJain: true, allergens: [], ecoScore: 85, imageColor: 'bg-orange-100' },
  { id: '2', name: 'Idli Sambar', price: { small: 30, regular: 50 }, category: 'Breakfast', type: 'Veg', isJain: true, allergens: [], ecoScore: 90, imageColor: 'bg-gray-100' },
  { id: '3', name: 'Chicken Biryani', price: { small: 120, regular: 180 }, category: 'Lunch', type: 'Non-Veg', isJain: false, allergens: [], ecoScore: 40, imageColor: 'bg-red-100' },
  { id: '4', name: 'Veg Meals', price: { regular: 80 }, category: 'Lunch', type: 'Veg', isJain: true, allergens: ['Dairy'], ecoScore: 80, imageColor: 'bg-green-100' },
  { id: '5', name: 'Paneer Butter Masala', price: { small: 90, regular: 150 }, category: 'Lunch', type: 'Veg', isJain: false, allergens: ['Dairy', 'Nuts'], ecoScore: 60, imageColor: 'bg-orange-50' },
  { id: '6', name: 'Samosa', price: { regular: 20 }, category: 'Snacks', type: 'Veg', isJain: false, allergens: ['Gluten'], ecoScore: 75, imageColor: 'bg-yellow-100' },
  { id: '7', name: 'Vegan Salad', price: { regular: 120 }, category: 'Lunch', type: 'Vegan', isJain: true, allergens: [], ecoScore: 95, imageColor: 'bg-green-50' },
];

const StudentBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const canteenId = searchParams.get('canteenId') || 'c1';

  // State
  const [activeCategory, setActiveCategory] = useState<'Breakfast' | 'Lunch' | 'Snacks'>('Lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);


  // Handlers
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };



  // Filter Logic
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Complex Filters
    const matchesVeg = activeFilters.includes('Veg') ? item.type === 'Veg' : true;
    const matchesVegan = activeFilters.includes('Vegan') ? item.type === 'Vegan' : true;
    const matchesJain = activeFilters.includes('Jain') ? item.isJain : true;
    const matchesNutFree = activeFilters.includes('No Nuts') ? !item.allergens.includes('Nuts') : true;

    return matchesCategory && matchesSearch && matchesVeg && matchesVegan && matchesJain && matchesNutFree;
  });

  return (
    <div className="space-y-8 pb-20">

      {/* 1. Header & Controls */}
      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food Menu</h1>
            <p className="text-sm text-gray-500">Ordering from {canteenId === 'c1' ? 'Sopanam' : canteenId === 'c2' ? 'Prasada' : 'Samudra'}</p>
          </div>
          <Link to="/student/cart" className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <ShoppingBag size={20} />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search food (e.g. Biryani)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto">
          {(['Breakfast', 'Lunch', 'Snacks'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Review: Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Veg', 'Vegan', 'Jain', 'No Nuts'].map(filter => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 whitespace-nowrap",
                activeFilters.includes(filter)
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600"
              )}
            >
              {activeFilters.includes(filter) && <Check size={12} />}
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Menu Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4">
            {/* Image Placeholder */}
            <Link to={`/student/item/${item.id}`} className={cn("w-24 h-24 rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity", item.imageColor)}></Link>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <Link to={`/student/item/${item.id}`} className="font-bold text-gray-900 truncate hover:text-blue-600">{item.name}</Link>
                  {/* Veg/Non-Veg Indicator */}
                  <span className={cn(
                    "w-4 h-4 border flex items-center justify-center flex-shrink-0",
                    item.type === 'Non-Veg' ? "border-red-500" : "border-green-500"
                  )}>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      item.type === 'Non-Veg' ? "bg-red-500" : "bg-green-500"
                    )}></span>
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.ecoScore > 80 && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Leaf size={8} /> Eco
                    </span>
                  )}
                  {item.allergens.map(alg => (
                    <span key={alg} className="text-[10px] font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle size={8} /> {alg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">₹{item.price.regular}</p>
                  {item.price.small && (
                    <p className="text-xs text-gray-400">Sm: ₹{item.price.small}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Portion Selector (Mock) */}
                  {item.price.small && (
                    <select className="text-xs bg-gray-50 border-gray-200 rounded p-1 outline-none">
                      <option>Reg</option>
                      <option>Sml</option>
                    </select>
                  )}
                  <Button size="sm" className="h-8 px-3 text-xs">Add</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400">
            No items found matching your filters.
          </div>
        )}
      </section>



    </div>
  );
};

export default StudentBooking;
