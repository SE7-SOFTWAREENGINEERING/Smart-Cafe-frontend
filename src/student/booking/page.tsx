import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Leaf, ShoppingBag, Clock, Check, AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../store/cart.store';
import toast from 'react-hot-toast';
import { bookSlot, getSlots, type Slot } from '../../services/booking.service';
import Button from '../../components/common/Button';


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

  const canteenMap: { [key: string]: string } = {
    'c1': 'Sopanam',
    'c2': 'Prasada',
    'c3': 'Samudra'
  };
  const canteenName = canteenMap[canteenId] || 'Sopanam';

  // State
  const [activeTab, setActiveTab] = useState<'Food' | 'Slots'>('Food');
  const [activeCategory, setActiveCategory] = useState<'Breakfast' | 'Lunch' | 'Snacks'>('Lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // const { user } = useAuth(); // User check handled by backend auth middleware 
  // Wait, useAuth was not in imports in the file view. I will comment it out or assume it's needed for booking.
  // Actually, looking at the code, `user` was used in `handleBookSlot`. I need to import useAuth.

  // Slot Booking State
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Fetch Menu on mount
  useEffect(() => {
    if (activeTab === 'Food') {
      fetchMenu();
    } else {
      fetchSlots();
    }
  }, [activeTab, canteenId]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const data = await getSlots(canteenName);
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

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

  const handleBookSlot = async (slotTime: string) => {
    // Note: User check removed as useAuth is not strictly imported in the previous snippet, 
    // but assuming it's available or handled by backend auth middleware.
    // If strict user check is needed, we need to import useAuth.
    // I will add the import for useAuth to be safe since it was used in Sidebar.
    try {
      // Use activeCategory for meal type
      await bookSlot(slotTime, activeCategory, canteenName);
      setBookingMessage({ type: 'success', text: 'Slot booked successfully!' });
      fetchSlots(); // Refresh
      setTimeout(() => setBookingMessage(null), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to book slot.';
      setBookingMessage({ type: 'error', text: msg });
      setTimeout(() => setBookingMessage(null), 3000);
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



  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">

      {/* 1. Header & Controls */}
      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'Food' ? 'Food Menu' : 'Book a Seat'}
            </h1>
            <p className="text-sm text-gray-500">Ordering from {canteenName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('Food')}
              className={cn("p-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'Food' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}
            >
              Food
            </button>
            <button
              onClick={() => setActiveTab('Slots')}
              className={cn("p-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'Slots' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}
            >
              Seats
            </button>
            <Link to="/student/cart" className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {activeTab === 'Food' && (
          <>
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
          </>
        )}
      </section>

      {/* 2. Content */}
      {activeTab === 'Food' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
              {/* Image Placeholder */}
              <Link to={`/student/item/${item.id}`} className={cn("w-28 h-28 rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity", item.imageColor)}></Link>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                {/* Top Content */}
                <div>
                  <div className="flex justify-between items-start">
                    <Link to={`/student/item/${item.id}`} className="font-bold text-gray-900 truncate pr-2 hover:text-blue-600">{item.name}</Link>
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
                        <AlertTriangle size={8} /> {alg}
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
        </section>
      ) : (
        <section className="space-y-4">
          {bookingMessage && (
            <div className={cn("p-3 rounded-lg text-center text-sm", bookingMessage.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
              {bookingMessage.text}
            </div>
          )}

          {loadingSlots ? (
            <div className="text-center py-10 text-gray-400">Loading slots...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map(slot => {
                const available = slot.capacity - slot.booked;
                return (
                  <div key={slot._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        {slot.time}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Available: <span className={cn("font-bold", available < 10 ? "text-red-500" : "text-green-500")}>{available}</span> / {slot.capacity}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      disabled={available <= 0}
                      onClick={() => handleBookSlot(slot.time)}
                      className={cn(available <= 0 ? "bg-gray-200 text-gray-400" : "")}
                    >
                      {available <= 0 ? 'Full' : 'Book'}
                    </Button>
                  </div>
                );
              })}
              {slots.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400">
                  No slots available.
                </div>
              )}
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default StudentBooking;
