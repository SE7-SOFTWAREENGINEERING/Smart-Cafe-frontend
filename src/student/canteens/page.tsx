import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, ChevronRight, Info, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";

const IMAGE_COLORS = [
  "bg-orange-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-red-100",
];

const CanteenSelection: React.FC = () => {
  const navigate = useNavigate();
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCanteens();
  }, []);

  const loadCanteens = async () => {
    try {
      setLoading(true);
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
    } catch (error) {
      console.error("Failed to load canteens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    localStorage.setItem("selectedCanteenId", id);
    navigate(`/user/booking?canteenId=${id}`);
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-amber-600 bg-amber-50";
      case "High":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Select Canteen</h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose where you'd like to eat today.
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span>Loading canteens...</span>
        </div>
      ) : canteens.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
          <p>No canteens available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {canteens.map((canteen, index) => {
            const canteenId = canteen.id || canteen._id || "";
            return (
              <div
                key={canteenId}
                onClick={() => handleSelect(canteenId)}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-4 flex gap-4 items-center"
              >
                {/* Image Placeholder */}
                <div
                  className={cn(
                    "w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xl",
                    canteen.imageColor ||
                      IMAGE_COLORS[index % IMAGE_COLORS.length],
                  )}
                >
                  {canteen.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {canteen.name}
                    </h3>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        canteen.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : canteen.status === "Closed"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {canteen.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md",
                        getCrowdColor(canteen.crowd),
                      )}
                    >
                      <Users size={12} />
                      {canteen.crowd} Crowd
                    </div>
                    {canteen.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        <span>{canteen.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-2">
                  <button className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-brand-light group-hover:text-brand transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-brand-light border border-brand/20 rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-brand flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Check the crowd status before booking to avoid
          long wait times.
        </p>
      </div>
    </div>
  );
};

export default CanteenSelection;

