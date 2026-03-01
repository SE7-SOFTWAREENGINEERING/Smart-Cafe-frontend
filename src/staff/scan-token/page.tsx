import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Camera, CheckCircle, XCircle, Clock, User, Loader2 } from 'lucide-react';
import { scanToken, type ScanResponse } from '../../services/staff.service';

const StaffScanToken: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | 'expired' | null>(null);
  const [scanData, setScanData] = useState<ScanResponse | null>(null);

  const handleScan = async (idToScan: string) => {
    if (!idToScan.trim()) return;
    setScanning(true);
    setScanResult(null);
    setScanData(null);

    try {
      const res = await scanToken(idToScan.trim());
      setScanData(res);

      if (res.access === 'APPROVED') {
        setScanResult('success');
      } else if (res.message.toLowerCase().includes('expire')) {
        setScanResult('expired');
      } else {
        setScanResult('invalid');
      }
    } catch (error) {
      setScanResult('invalid');
      setScanData({ success: false, message: 'Server error processing token', access: 'DENIED' });
    } finally {
      setScanning(false);
    }
  };

  const submitInput = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(tokenIdInput);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Scan Token</h1>
        <p className="text-sm text-gray-500 mt-1">Validate student booking tokens.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {scanning ? (
            <div className="relative w-full max-w-sm aspect-square bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-white/80 text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processing...</div>
              {/* Overlay */}
              <div className="absolute inset-0 border-2 border-transparent">
                <div className="absolute inset-8 border-2 border-brand/80 rounded-lg animate-pulse shadow-[0_0_15px_rgba(var(--brand-rgb),0.5)]" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full max-w-sm">
              <div className="bg-blue-50 p-6 rounded-full inline-flex mx-auto">
                <Camera size={48} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium text-lg">Ready to Scan</p>
                <p className="text-gray-500 text-sm mt-1 mx-auto">Point camera at the QR code, or enter Token ID manually below.</p>
              </div>

              <form onSubmit={submitInput} className="flex gap-2 w-full mt-4">
                <input
                  type="text"
                  value={tokenIdInput}
                  onChange={e => setTokenIdInput(e.target.value)}
                  placeholder="Enter Token ID manually"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand font-mono text-center uppercase"
                />
                <Button type="submit" disabled={!tokenIdInput.trim()}>Check</Button>
              </form>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {scanResult === 'success' && scanData?.data && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-600" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-green-900">Valid Token</h3>
                  <p className="text-green-700 text-sm">{scanData.message || 'Entry Authorized'}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100 space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-sm">Token ID</span>
                  <span className="font-mono font-bold text-gray-900 uppercase">{tokenIdInput || 'SCANNED'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-1"><User size={14} /> Student</span>
                  <span className="font-medium text-gray-900">{scanData.data.userName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={14} /> Slot Time</span>
                  <span className="font-medium text-blue-600">{new Date(scanData.data.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-transparent" onClick={() => { setScanResult(null); setTokenIdInput(''); }}>
                Done & Scan Next
              </Button>
            </div>
          )}

          {scanResult === 'expired' && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-amber-600" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Token Expired</h3>
                  <p className="text-amber-700 text-sm">{scanData?.message || 'Action Required'}</p>
                </div>
              </div>
              <p className="text-amber-800 mb-4 text-sm">
                This token has expired or is for a different time slot. Please advise user.
              </p>
              <div className="bg-white/50 rounded p-3 text-sm text-amber-900 border border-amber-200">
                {scanData?.message}
              </div>
              <Button variant="secondary" className="w-full mt-4" onClick={() => { setScanResult(null); setTokenIdInput(''); }}>
                Dismiss
              </Button>
            </div>
          )}

          {scanResult === 'invalid' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-red-600" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-red-900">Invalid Token</h3>
                  <p className="text-red-700 text-sm">Access Denied</p>
                </div>
              </div>
              <p className="text-red-800 mb-4 text-sm">
                {scanData?.message || 'Token not found or invalid.'}
              </p>
              <div className="bg-white/50 rounded p-3 text-sm text-red-900 border border-red-200">
                Error: {scanData?.message}
              </div>
              <Button variant="danger" className="w-full mt-4" onClick={() => { setScanResult(null); setTokenIdInput(''); }}>
                Dismiss
              </Button>
            </div>
          )}

          {!scanResult && !scanning && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 p-8 text-center min-h-[300px]">
              <div className="max-w-xs">
                <p>Scan result details will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffScanToken;
