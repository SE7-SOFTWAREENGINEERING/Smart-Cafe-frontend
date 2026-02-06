import { useNavigate } from 'react-router-dom';
import { MapPin, Users, ChevronRight, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Canteen {
    id: string;
    name: string;
    status: 'Open' | 'Closed' | 'Closing Soon';
    crowd: 'Low' | 'Medium' | 'High';
    capacity: number;
    occupancy: number;
    image: string; // Using color gradients/placeholders for now
}

const CANTEENS: Canteen[] = [
    {
        id: 'c1',
        name: 'Sopanam',
        status: 'Open',
        crowd: 'High',
        capacity: 200,
        occupancy: 180,
        image: 'bg-orange-100',
    },
    {
        id: 'c2',
        name: 'Prasada',
        status: 'Open',
        crowd: 'Medium',
        capacity: 150,
        occupancy: 75,
        image: 'bg-green-100',
    },
    {
        id: 'c3',
        name: 'Samudra',
        status: 'Closing Soon',
        crowd: 'Low',
        capacity: 100,
        occupancy: 20,
        image: 'bg-blue-100',
    }
];

const CanteenSelection: React.FC = () => {
    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        // Mimic selection delay or context update
        setTimeout(() => {
            navigate(`/student/booking?canteenId=${id}`); // Navigate to booking/menu after selection
        }, 300);
    };

    const getCrowdColor = (level: string) => {
        switch (level) {
            case 'Low': return 'text-green-600 bg-green-50';
            case 'Medium': return 'text-orange-600 bg-orange-50';
            case 'High': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Select Canteen</h1>
                <p className="text-sm text-gray-500 mt-1">Choose where you'd like to eat today.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {CANTEENS.map((canteen) => (
                    <div
                        key={canteen.id}
                        onClick={() => handleSelect(canteen.id)}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-4 flex gap-4 items-center"
                    >
                        {/* Image Placeholder */}
                        <div className={cn("w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xl", canteen.image)}>
                            {canteen.name[0]}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{canteen.name}</h3>
                                <span className={cn("text-xs font-bold px-2 py-1 rounded-full",
                                    canteen.status === 'Open' ? 'bg-green-100 text-green-700' :
                                        canteen.status === 'Closed' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'
                                )}>
                                    {canteen.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md", getCrowdColor(canteen.crowd))}>
                                    <Users size={12} />
                                    {canteen.crowd} Crowd
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <MapPin size={12} />
                                    <span>Central Block</span>
                                </div>
                            </div>
                        </div>

                        <div className="ml-2">
                            <button className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Check the crowd status before booking to avoid long wait times.
                </p>
            </div>

        </div>
    );
};

export default CanteenSelection;
