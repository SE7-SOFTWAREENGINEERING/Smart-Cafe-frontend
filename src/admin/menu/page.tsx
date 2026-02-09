import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Store,
  Loader2,
  Check,
} from "lucide-react";
import Button from "../../components/common/Button";
import { cn } from "../../utils/cn";
import * as menuService from "../../services/menu.service";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";
import type { MenuItem as BackendMenuItem } from "../../services/menu.service";

// Extended MenuItem type for admin display
interface MenuItem extends BackendMenuItem {
  name?: string; // Some old items might have this
  mealType?: string; // Frontend legacy
  allergens?: string[];
  ecoScore?: string;
  portionSize?: string;
}

const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State — canteens is now an array of IDs
  const [formData, setFormData] = useState<{
    itemName: string;
    price: number;
    category: string;
    dietaryType: string;
    isVeg: boolean;
    description: string;
    isAvailable: boolean;
    canteens: string[];
  }>({
    itemName: "",
    price: 0,
    category: "LUNCH",
    dietaryType: "Veg",
    isVeg: true,
    description: "",
    isAvailable: true,
    canteens: [],
  });

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [canteenFilter, setCanteenFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuData, canteenData] = await Promise.all([
        menuService.getMenuItems(),
        canteenService.getCanteens(),
      ]);
      setItems(menuData);
      setCanteens(canteenData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract canteen IDs from an item's canteens array
  const getItemCanteenIds = (item: MenuItem): string[] => {
    if (!item.canteens || !Array.isArray(item.canteens)) return [];
    return item.canteens
      .map((c) =>
        typeof c === "object" ? (c as any)._id || (c as any).id || "" : c,
      )
      .filter(Boolean);
  };

  // Helper to get display names for an item's canteens
  const getCanteenNames = (item: MenuItem): string[] => {
    if (
      !item.canteens ||
      !Array.isArray(item.canteens) ||
      item.canteens.length === 0
    )
      return [];
    return item.canteens.map((c) => {
      if (typeof c === "object") return (c as any).name || "Unknown";
      const found = canteens.find((cn) => (cn.id || cn._id) === c);
      return found?.name || "Unknown";
    });
  };

  const filteredItems = items.filter((item) => {
    const itemName = item.itemName || item.name || "";
    const matchesSearch = itemName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesMeal = mealFilter === "All" || item.category === mealFilter;
    const matchesDiet =
      dietaryFilter === "All" ||
      (dietaryFilter === "Veg" && item.isVeg) ||
      (dietaryFilter === "Non-Veg" && !item.isVeg);
    const itemCanteenIds = getItemCanteenIds(item);
    const matchesCanteen =
      canteenFilter === "All" || itemCanteenIds.includes(canteenFilter);
    return matchesSearch && matchesMeal && matchesDiet && matchesCanteen;
  });

  const VALID_CATEGORIES = [
    "BREAKFAST",
    "LUNCH",
    "DINNER",
    "SNACKS",
    "BEVERAGES",
  ];

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    const canteenIds = getItemCanteenIds(item);

    // Old items may have category set to a dietary value like "Veg" — normalise it
    const rawCategory = (item.category || "").toUpperCase();
    const validCategory = VALID_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : "LUNCH";

    setFormData({
      itemName: item.itemName || item.name || "",
      price: item.price || 0,
      category: validCategory,
      dietaryType: item.dietaryType || (item.isVeg ? "Veg" : "Non-Veg"),
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
      description: item.description || "",
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      canteens: canteenIds,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this item?")) {
      try {
        await menuService.deleteMenuItem(id);
        setItems(items.filter((i) => (i.id || i._id) !== id));
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert(getErrorMessage(error));
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const item = items.find((i) => (i.id || i._id) === id);
      if (!item) return;

      const updated = await menuService.updateMenuItem(id, {
        isAvailable: !item.isAvailable,
      });
      setItems(
        items.map((i) => ((i.id || i._id) === id ? { ...i, ...updated } : i)),
      );
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const toggleCanteenSelection = (canteenId: string) => {
    setFormData((prev) => {
      const selected = prev.canteens.includes(canteenId)
        ? prev.canteens.filter((id) => id !== canteenId)
        : [...prev.canteens, canteenId];
      return { ...prev, canteens: selected };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dietaryType = formData.dietaryType || "Veg";
      const isVeg = ["Veg", "Vegan", "Jain"].includes(dietaryType);

      const payload: any = {
        itemName: formData.itemName,
        price: formData.price,
        category: formData.category,
        dietaryType: dietaryType,
        isVeg: isVeg,
        description: formData.description,
        isAvailable: formData.isAvailable,
        canteens: formData.canteens,
      };

      if (editingItem) {
        const updated = await menuService.updateMenuItem(
          editingItem.id || editingItem._id || "",
          payload,
        );
        setItems(
          items.map((i) =>
            (i.id || i._id) === (editingItem.id || editingItem._id)
              ? { ...i, ...updated }
              : i,
          ),
        );
      } else {
        const created = await menuService.createMenuItem(payload);
        setItems([...items, created]);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error("Failed to save item:", error);
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: "",
      price: 0,
      category: "LUNCH",
      dietaryType: "Veg",
      isVeg: true,
      description: "",
      isAvailable: true,
      canteens: [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span>Loading menu items...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Food Menu & Sustainability
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage dishes, dietary labels, and eco-scores.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
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
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACKS">Snacks</option>
          </select>
          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Dietary</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
          <select
            value={canteenFilter}
            onChange={(e) => setCanteenFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Canteens</option>
            {canteens.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Item Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Dietary</th>
              <th className="px-6 py-3 font-medium">Canteens</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const names = getCanteenNames(item);
                return (
                  <tr key={item.id || item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.itemName || item.name || "Unnamed"}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        ₹{item.price || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.category || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-semibold border",
                          item.isVeg
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200",
                        )}
                      >
                        {!item.isVeg && item.dietaryType === "Veg"
                          ? "Non-Veg"
                          : item.dietaryType ||
                            (item.isVeg ? "Veg" : "Non-Veg")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {names.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {names.map((n, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              <Store size={10} />
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          All Canteens
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleAvailability(item.id || item._id || "")
                        }
                        className="focus:outline-none"
                      >
                        {item.isAvailable ? (
                          <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle size={12} className="mr-1" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-400 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                            <X size={12} className="mr-1" /> Sold Out
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.id || item._id || "")
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No menu items found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Edit Item" : "New Menu Item"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.itemName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.category || "LUNCH"}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACKS">Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.dietaryType || "Veg"}
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryType: e.target.value })
                    }
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Jain">Jain</option>
                    <option value="Egg">Egg</option>
                  </select>
                </div>
              </div>

              {/* Canteen Checklist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Store size={14} className="inline mr-1" />
                  Available at Canteens
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Leave all unchecked to make available at every canteen.
                </p>
                <div className="border rounded-lg p-3 max-h-44 overflow-y-auto space-y-1">
                  {canteens.length > 0 ? (
                    canteens.map((c) => {
                      const cId = c.id || c._id || "";
                      const isSelected = formData.canteens.includes(cId);
                      return (
                        <label
                          key={cId}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                            isSelected
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50 border border-transparent",
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0",
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300 bg-white",
                            )}
                          >
                            {isSelected && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => toggleCanteenSelection(cId)}
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {c.name}
                          </span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No canteens found.
                    </p>
                  )}
                </div>
                {formData.canteens.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.canteens.map((cId) => {
                      const c = canteens.find(
                        (cn) => (cn.id || cn._id) === cId,
                      );
                      return (
                        <span
                          key={cId}
                          className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                          {c?.name || "Unknown"}
                          <button
                            type="button"
                            onClick={() => toggleCanteenSelection(cId)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Brief description of the item"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={saving}>
                  Save Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
