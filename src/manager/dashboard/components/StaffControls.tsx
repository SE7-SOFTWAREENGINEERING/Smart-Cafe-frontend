import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, Briefcase, MoreHorizontal, Loader2, X, Check } from "lucide-react";
import { getUsers, assignCanteen } from "../../../services/user.service";
import toast from "react-hot-toast";
import ServingRules from '../../../staff/dashboard/components/ServingRules';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: string;
  canteenId?: string | { name: string }; 
}

interface Props {
  canteenId?: string;
}

const StaffControls: React.FC<Props> = ({ canteenId }) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  // Replaced unassignedStaff with allStaff
  // const [unassignedStaff, setUnassignedStaff] = useState<StaffMember[]>([]); 

  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch staff assigned to this canteen
      const data = await getUsers({ role: "canteen_staff", canteenId });
      const users = Array.isArray(data) ? data : (data as any).users || [];
      setStaff(
        users.map((u: any) => ({
          id: u.id || u._id,
          name: u.name || u.fullName || u.email,
          role: u.role || "canteen_staff",
          status: u.isOnline ? "Active" : "Inactive",
          canteenId: u.canteenId,
        })),
      );
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);

  // ...

  const loadAllStaff = async () => {
    try {
      // Fetch ALL staff (canteen_staff), regardless of assignment
      const data = await getUsers({ role: "canteen_staff" });
      const users = Array.isArray(data) ? data : (data as any).users || [];
      setAllStaff(
        users.map((u: any) => ({
          id: u.id || u._id,
          name: u.name || u.fullName || u.email,
          role: u.role || "canteen_staff",
          status: u.isOnline ? "Active" : "Inactive",
          canteenId: u.canteenId,
          canteenName: u.canteenId?.name 
        })),
      );
    } catch {
      setAllStaff([]);
    }
  };

  const handleOpenAssign = async () => {
    setShowAssignModal(true);
    await loadAllStaff();
  };

  const handleAssignStaff = async () => {
    if (!selectedStaffId || !canteenId) return;
    try {
      setAssigning(true);
      await assignCanteen(selectedStaffId, canteenId);
      toast.success("Staff assigned to canteen");
      setShowAssignModal(false);
      setSelectedStaffId("");
      await loadStaff();
    } catch {
      toast.error("Failed to assign staff");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Staff on Duty</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Assign Staff</h4>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            
            {allStaff.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No staff available</p>
            ) : (
              <>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4"
                >
                  <option value="">Select a staff member</option>
                  {allStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.canteenId ? `(Currently at: ${(s as any).canteenName || 'Another Canteen'})` : '(Unassigned)'}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignStaff}
                  disabled={!selectedStaffId || assigning}
                  className="w-full bg-brand text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {assigning ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                  {assigning ? "Assigning..." : "Assign to Canteen"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Roster Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] max-w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg text-gray-900">Staff Roster & Rules</h4>
              <button
                onClick={() => setShowRosterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Briefcase size={16} /> Staff on Duty
                </h5>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {staff.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No staff assigned</p>
                  ) : (
                    staff.map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                         <span className="text-sm font-medium text-gray-800">{s.name}</span>
                         <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                           {s.status}
                         </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <ServingRules />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {staff.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">
            No staff assigned to this canteen
          </p>
        ) : (
          staff.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand text-xs font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                    member.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleOpenAssign}
          className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <UserPlus size={14} /> Assign Staff
        </button>
        <button 
          onClick={() => setShowRosterModal(true)}
          className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Briefcase size={14} /> View Roster
        </button>
      </div>
    </div>
  );
};

export default StaffControls;
