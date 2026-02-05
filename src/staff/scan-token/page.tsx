import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Camera, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const StaffScanToken: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | null>(null);

  const simulateScan = () => {
    // Simulate API call and result
    setTimeout(() => {
       const random = Math.random();
       setScanResult(random > 0.3 ? 'success' : 'invalid');
       setScanning(false);
    }, 2000);
  };

  React.useEffect(() => {
    if (scanning) {
        simulateScan();
    }
  }, [scanning]);

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
               <div className="text-white/80 text-sm">Scanning...</div>
               {/* Overlay */}
               <div className="absolute inset-0 border-2 border-transparent">
                  <div className="absolute inset-8 border-2 border-green-400/80 rounded-lg animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500/80 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
               </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 p-6 rounded-full inline-flex mx-auto">
                <Camera size={48} className="text-blue-600" />
              </div>
              <div>
                 <p className="text-gray-900 font-medium text-lg">Ready to Scan</p>
                 <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Point camera at the QR code on the student's device.</p>
              </div>
              <Button size="lg" onClick={() => { setScanResult(null); setScanning(true); }}>
                Start Camera
              </Button>
            </div>
          )}
          {scanning && <Button variant="secondary" className="mt-6" onClick={() => setScanning(false)}>Cancel</Button>}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
           {scanResult === 'success' && (
             <div className="bg-green-50 border border-green-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <h3 className="text-lg font-bold text-green-900">Valid Token</h3>
                    <p className="text-green-700 text-sm">Entry Authorized</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100 space-y-3">
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 text-sm">Token ID</span>
                      <span className="font-mono font-bold text-gray-900">TK-8829</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm flex items-center gap-1"><User size={14}/> Student</span>
                      <span className="font-medium text-gray-900">Alex Student</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={14}/> Slot Time</span>
                      <span className="font-medium text-blue-600">12:30 PM - 01:00 PM</span>
                   </div>
                </div>
                
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-transparent">
                   Confirm Entry & Clear
                </Button>
             </div>
           )}

           {scanResult === 'invalid' && (
             <div className="bg-red-50 border border-red-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="text-red-600" size={32} />
                  <div>
                    <h3 className="text-lg font-bold text-red-900">Invalid Token</h3>
                    <p className="text-red-700 text-sm">Action Required</p>
                  </div>
                </div>
                <p className="text-red-800 mb-4">
                   This token has expired or belongs to a different time slot.
                </p>
                <div className="bg-white/50 rounded p-3 text-sm text-red-900 border border-red-100">
                   Error: TOKEN_EXPIRED_120
                </div>
                <Button variant="danger" className="w-full mt-4" onClick={() => setScanResult(null)}>
                   Dismiss
                </Button>
             </div>
           )}

           {!scanResult && !scanning && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400 p-8 text-center">
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
