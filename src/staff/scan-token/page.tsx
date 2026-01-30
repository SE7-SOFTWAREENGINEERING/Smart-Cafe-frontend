import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Camera } from 'lucide-react';

const StaffScanToken: React.FC = () => {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Scan Token</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        {scanning ? (
          <div className="relative w-full max-w-sm aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
             <div className="text-white">Camera View Simulation</div>
             {/* Overlay */}
             <div className="absolute inset-4 border-2 border-white/50 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-full inline-flex">
              <Camera size={48} className="text-blue-600" />
            </div>
            <p className="text-gray-500 max-w-xs mx-auto">Click below to start the camera and scan student QR codes.</p>
            <Button onClick={() => setScanning(true)}>Start Scanning</Button>
          </div>
        )}
        {scanning && <Button variant="secondary" className="mt-6" onClick={() => setScanning(false)}>Stop Scanning</Button>}
      </div>
    </div>
  );
};

export default StaffScanToken;
