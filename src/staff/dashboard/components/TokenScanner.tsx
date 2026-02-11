import React, { useState } from 'react';
import { Scan, Search, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { staffService } from '../../../services/staff.service';
import type { ScanTokenResponse } from '../../../services/staff.service';

interface ScanResultData {
  userName?: string;
  slotTime?: string;
  mealType?: string;
  message?: string;
}

const TokenScanner: React.FC = () => {
  const [tokenId, setTokenId] = useState('');
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'expired' | 'invalid'>('idle');
  const [scanData, setScanData] = useState<ScanResultData>({});
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!tokenId.trim()) return;
    
    setLoading(true);
    setScanResult('idle');
    
    try {
      const response: ScanTokenResponse = await staffService.scanToken(tokenId.trim());
      
      if (response.success && response.access === 'APPROVED') {
        setScanResult('valid');
        setScanData({
          userName: response.data?.userName,
          slotTime: response.data?.slotTime,
          mealType: response.data?.mealType
        });
      } else {
        // Determine error type based on message
        const msg = response.message?.toLowerCase() || '';
        if (msg.includes('expired') || msg.includes('early')) {
          setScanResult('expired');
        } else {
          setScanResult('invalid');
        }
        setScanData({ message: response.message });
      }
    } catch (error) {
      setScanResult('invalid');
      setScanData({ message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (slotTime?: string) => {
    if (!slotTime) return '';
    const date = new Date(slotTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReset = () => {
    setScanResult('idle');
    setTokenId('');
    setScanData({});
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">Token Validation</h3>
      
      <div className="flex flex-col gap-4">
        {/* Input Area */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Scan or Enter Token ID" 
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none font-mono text-lg uppercase"
              disabled={loading}
            />
          </div>
          <button 
            onClick={handleScan}
            disabled={loading || !tokenId.trim()}
            className={`bg-brand text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              loading || !tokenId.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-hover'
            }`}
          >
            <Scan size={20} className={loading ? 'animate-pulse' : ''} /> 
            <span className="hidden md:inline">{loading ? 'Scanning...' : 'Scan'}</span>
          </button>
        </div>

        {/* Result Display */}
        {scanResult === 'idle' && (
           <div className="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
             <Scan size={48} className="mb-2 opacity-50" />
             <p className="text-sm">Ready to scan tokens</p>
           </div>
        )}

        {scanResult === 'valid' && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{scanData.userName || tokenId}</h4>
            <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle size={14} /> Entry Approved
            </p>
            {scanData.slotTime && (
              <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Clock size={12} /> {formatSlotTime(scanData.slotTime)} • {scanData.mealType}
              </p>
            )}
            <div className="mt-4">
              <button 
                onClick={handleReset}
                className="text-sm text-brand hover:underline"
              >
                Scan Next
              </button>
            </div>
          </div>
        )}

        {scanResult === 'expired' && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
             <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
              <Clock size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{tokenId}</h4>
            <p className="text-sm text-red-600 font-medium flex items-center justify-center gap-1 mt-1">
              <Clock size={14} /> {scanData.message || 'Token Expired'}
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <button 
                onClick={handleReset}
                className="bg-white border border-gray-200 text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

         {scanResult === 'invalid' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
             <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
              <AlertTriangle size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{tokenId || 'Unknown'}</h4>
             <p className="text-sm text-gray-500 font-medium mt-1">
              {scanData.message || 'Token not found or invalid'}
            </p>
            <div className="mt-4">
               <button onClick={handleReset} className="text-sm text-brand hover:underline">Try Again</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TokenScanner;
