import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Leaf, ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../store/cart.store';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  price: { small?: number; regular: number };
  category: 'Breakfast' | 'Lunch' | 'Snacks';
  type: 'Veg' | 'Non-Veg' | 'Vegan';
  isJain: boolean;
  allergens: string[]; // e.g., 'Dairy', 'Nuts'
  tags?: string[]; // e.g. 'Eco'
  imageColor: string;
  ecoScore?: number;
}

const StudentBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const canteenId = searchParams.get('canteenId') || 'c1';
  const { addToCart, totalItems } = useCart();

  // State
  const [activeCategory, setActiveCategory] = useState<'Breakfast' | 'Lunch' | 'Snacks'>('Lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch Menu on mount
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      // Direct fetch from backend API
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();

      // Map backend data to frontend model if necessary
      // Assuming backend might return different field names, mapped here safely
      const mapped = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id || item._id,
        name: item.name || item.itemName || 'Unknown Item',
        price: item.price || { regular: 0 },
        category: item.category || 'Lunch',
        type: item.type || (item.isVeg ? (item.type === 'Vegan' ? 'Vegan' : 'Veg') : 'Non-Veg'),
        isJain: item.isJain || false,
        allergens: item.allergens || [],
        tags: item.tags || [],
        imageColor: item.imageColor || 'bg-gray-100'
      })) : [];

      // If backend returns empty array (no data), fallback to screenshot mock
      if (mapped.length === 0) throw new Error('No items from backend');

      setMenuItems(mapped);
    } catch (err) {
      console.warn("Using fallback menu data:", err);
      // Fallback if API fails (Strictly matches screenshot items)
      setMenuItems([
        { id: '1', name: 'Chicken Biryani', price: { small: 120, regular: 180 }, category: 'Lunch', type: 'Non-Veg', isJain: false, allergens: [], imageColor: 'bg-red-100' },
        { id: '2', name: 'Veg Meals', price: { regular: 80 }, category: 'Lunch', type: 'Veg', isJain: true, allergens: ['Dairy'], imageColor: 'bg-green-100' },
        { id: '3', name: 'Paneer Butter Masala', price: { small: 90, regular: 150 }, category: 'Lunch', type: 'Veg', isJain: false, allergens: ['Dairy', 'Nuts'], imageColor: 'bg-orange-50' },
        { id: '4', name: 'Vegan Salad', price: { regular: 120 }, category: 'Lunch', type: 'Vegan', isJain: true, allergens: [], tags: ['Eco'], imageColor: 'bg-green-50' },
        // Add some fallback items for other categories to test tabs
        { id: '5', name: 'Masala Dosa', price: { regular: 60 }, category: 'Breakfast', type: 'Veg', isJain: true, allergens: [], imageColor: 'bg-orange-100' },
        { id: '6', name: 'Samosa', price: { regular: 20 }, category: 'Snacks', type: 'Veg', isJain: false, allergens: ['Gluten'], imageColor: 'bg-yellow-100' },
      ]);
    }
  };

  // Filter Logic
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVeg = activeFilters.includes('Veg') ? (item.type === 'Veg' || item.type === 'Vegan') : true;
    const matchesVegan = activeFilters.includes('Vegan') ? item.type === 'Vegan' : true;
    const matchesJain = activeFilters.includes('Jain') ? item.isJain : true;
    const matchesNutFree = activeFilters.includes('No Nuts') ? !item.allergens.includes('Nuts') : true;

    return matchesCategory && matchesSearch && matchesVeg && matchesVegan && matchesJain && matchesNutFree;
  });

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const addItemToCart = (item: MenuItem, portion: 'Regular' | 'Small' = 'Regular') => {
    const price = portion === 'Small' && item.price.small ? item.price.small : item.price.regular;

    addToCart({
      id: item.id,
      name: item.name,
      price: price,
      quantity: 1,
      prepTime: 15,
      ecoScore: item.ecoScore || 50,
      imageColor: item.imageColor,
      portion
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const getCanteenName = (id: string) => {
    if (id === 'c1') return 'Sopanam';
    if (id === 'c2') return 'Prasada';
    return 'Samudra';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Menu</h1>
          <p className="text-sm text-gray-500 mt-1">Ordering from <span className="text-gray-700 font-medium">{getCanteenName(canteenId)}</span></p>
        </div>
        <Link to="/student/cart" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-700 relative">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      {/* Controls Container */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search food (e.g. Biryani)"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs (Segmented Control style) */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl">
          {(['Breakfast', 'Lunch', 'Snacks'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeCategory === cat
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 font-medium">
          {['Veg', 'Vegan', 'Jain', 'No Nuts'].map(filter => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs transition-colors border",
                activeFilters.includes(filter)
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
            {/* Image Placeholder */}
            <div className={cn("w-28 h-28 rounded-xl flex-shrink-0", item.imageColor)}></div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              {/* Top Content */}
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 truncate pr-2">{item.name}</h3>
                  {/* Veg/Non-Veg Icon */}
                  <div className={cn(
                    "w-4 h-4 border flex items-center justify-center flex-shrink-0 rounded-[2px]",
                    item.type === 'Non-Veg' ? "border-red-500" : "border-green-600"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      item.type === 'Non-Veg' ? "bg-red-500" : "bg-green-600"
                    )}></div>
                  </div>
                </div>

                {/* Tags / Allergens */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags?.includes('Eco') && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Leaf size={8} /> Eco
                    </span>
                  )}
                  {item.allergens.map(alg => (
                    <span key={alg} className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {/* Tiny warning icon could go here if needed */}
                      {alg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Price & Action */}
              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-xl font-bold text-gray-900">₹{item.price.regular}</p>
                  {item.price.small && (
                    <p className="text-xs text-gray-400">Sm: ₹{item.price.small}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.price.small && (
                    <select className="bg-transparent text-xs font-semibold text-gray-500 border-none outline-none cursor-pointer hover:text-gray-900">
                      <option>Reg</option>
                      <option>Sm</option>
                    </select>
                  )}
                  <button
                    onClick={() => addItemToCart(item)}
                    className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-orange-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            No items found matching your filters.
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentBooking;
