import React, { useState } from 'react';
import { Scan, Search, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { scanToken, type ScanResponse } from '../../../services/staff.service';

const TokenScanner: React.FC = () => {
  const [tokenId, setTokenId] = useState('');
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'expired' | 'invalid'>('idle');
  const [scanData, setScanData] = useState<ScanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!tokenId.trim()) return;
    setLoading(true);
    try {
      const res = await scanToken(tokenId.trim());
      setScanData(res);
      if (res.access === 'APPROVED') {
        setScanResult('valid');
      } else if (res.message.toLowerCase().includes('expire')) {
        setScanResult('expired');
      } else {
        setScanResult('invalid');
      }
    } catch (error) {
      setScanResult('invalid');
      setScanData({ success: false, message: 'Server error processing token', access: 'DENIED' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">Token Validation</h3>

      <div className="flex flex-col gap-4 flex-1">
        {/* Input Area */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Scan or Enter Token ID"
              value={tokenId}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none font-mono text-lg uppercase"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><Scan size={20} /> <span className="hidden md:inline">Scan</span></>}
          </button>
        </div>

        {/* Result Display */}
        {scanResult === 'idle' && (
          <div className="flex flex-col items-center justify-center py-8 flex-1 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
            <Scan size={48} className="mb-2 opacity-50" />
            <p className="text-sm">Ready to scan tokens</p>
          </div>
        )}

        {scanResult === 'valid' && scanData?.data && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{scanData.data.userName}</h4>
            <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle size={14} /> Entry Approved
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {scanData.data.mealType} &bull; Slot: {new Date(scanData.data.slotTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="mt-4 flex gap-2 w-full justify-center">
              <button onClick={() => { setScanResult('idle'); setTokenId(''); }} className="bg-white border text-sm border-green-200 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 mt-2">
                Scan Next Token
              </button>
            </div>
          </div>
        )}

        {scanResult === 'expired' && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2">
              <Clock size={28} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">{tokenId}</h4>
            <p className="text-sm text-amber-600 font-medium flex items-center justify-center gap-1 mt-1">
              <Clock size={14} /> Expired / Late
            </p>
            <p className="text-xs text-amber-700 mt-1">{scanData?.message}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setScanResult('idle'); setTokenId(''); }} className="flex-1 bg-white border border-amber-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Reject & Clear
              </button>
            </div>
          </div>
        )}

        {scanResult === 'invalid' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
              <AlertTriangle size={28} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 overflow-hidden text-ellipsis">{tokenId || 'Unknown'}</h4>
            <p className="text-sm text-red-600 font-medium mt-1">
              {scanData?.message || 'Token not found or invalid'}
            </p>
            <div className="mt-4">
              <button onClick={() => { setScanResult('idle'); setTokenId(''); }} className="text-sm text-red-700 bg-white border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100">Reset Scanner</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenScanner;
