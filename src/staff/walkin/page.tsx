import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { UserPlus, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { issueWalkInToken } from '../../services/staff.service';

const StaffWalkin: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tokenGenerated, setTokenGenerated] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!userEmail) {
      setErrorMsg('User email is required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await issueWalkInToken(userEmail, mealType);
      if (res.success && res.data?.token?.qrCode) {
        // Just displaying string ID here to fit the existing visual, 
        // ideally we would show the QR code image encoded in res.data.token.qrCodeImage
        // Since original UI used a short string, we'll slice UUID or find token_id
        setTokenGenerated(res.data.token.tokenId ? `WK-${res.data.token.tokenId}` : 'WK-SUCCESS');
      } else {
        setErrorMsg(res.message || 'Failed to issue token.');
      }
    } catch (error: any) {
      setErrorMsg('Network error: Could not reach backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Issue Walk-in Token</h1>
        <p className="text-sm text-gray-500 mt-1">Assign an immediate available slot to a registered user.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {tokenGenerated ? (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Token Generated!</h3>
            <div className="my-4 text-4xl font-mono font-bold text-blue-600 tracking-wider p-4 bg-gray-50 rounded-lg inline-block border border-gray-200">
              {tokenGenerated}
            </div>
            <p className="text-gray-500 mb-6">User has been notified via email & in-app.</p>
            <Button variant="secondary" onClick={() => {
              setTokenGenerated(null);
              setUserEmail('');
              setErrorMsg(null);
            }}>Issue Another</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Category</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(meal => (
                    <button
                      key={meal}
                      onClick={() => setMealType(meal)}
                      className={cn(
                        "py-2 px-3 rounded-lg border text-sm font-medium transition-all text-center",
                        mealType === meal
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                      )}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 flex items-start gap-2 rounded-lg text-sm border border-red-200">
                <AlertTriangle size={18} className="shrink-0 flex-none mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <Button
              className="w-full h-12 text-lg"
              disabled={loading}
              onClick={handleGenerate}
            >
              {loading ? <Loader2 className="animate-spin text-white" /> : <><UserPlus className="mr-2" /> Issue Walk-in Token</>}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffWalkin;
