import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Camera, CheckCircle, XCircle, Clock, User, Loader2 } from 'lucide-react';
import { staffService } from '../../services/staff.service';
import toast from 'react-hot-toast';

interface ScanResult {
  type: 'success' | 'invalid' | 'expired';
  tokenId?: string;
  userName?: string;
  slotTime?: string;
  mealType?: string;
  message?: string;
}

const StaffScanToken: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScan = async (tokenCode: string) => {
    if (!tokenCode.trim()) {
      toast.error('Please enter a token code');
      return;
    }

    setScanning(true);
    setScanResult(null);

    try {
      const response = await staffService.scanToken(tokenCode);

      if (response.success && response.access === 'APPROVED') {
        setScanResult({
          type: 'success',
          tokenId: tokenCode.substring(0, 8).toUpperCase(),
          userName: response.data?.userName || 'Unknown User',
          slotTime: response.data?.slotTime || 'N/A',
          mealType: response.data?.mealType || 'N/A'
        });
        toast.success('Token validated successfully!');
      } else {
        // Check for specific error types
        const message = response.message || 'Invalid token';
        const isExpired = message.toLowerCase().includes('expired');
        
        setScanResult({
          type: isExpired ? 'expired' : 'invalid',
          message: message
        });
        toast.error(message);
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      setScanResult({
        type: 'invalid',
        message: error.response?.data?.message || 'Failed to validate token'
      });
      toast.error('Failed to scan token');
    } finally {
      setScanning(false);
    }
  };

  const handleManualSubmit = () => {
    handleScan(manualToken);
  };

  const resetScan = () => {
    setScanResult(null);
    setManualToken('');
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
            <div className="text-center space-y-4">
              <Loader2 size={48} className="animate-spin text-blue-600 mx-auto" />
              <p className="text-gray-600">Validating token...</p>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full max-w-sm">
              <div className="bg-blue-50 p-6 rounded-full inline-flex mx-auto">
                <Camera size={48} className="text-blue-600" />
              </div>
              <div>
                 <p className="text-gray-900 font-medium text-lg">Enter Token Code</p>
                 <p className="text-gray-500 text-sm mt-1">Enter the token code from the student's device or scan QR.</p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Enter token code..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleManualSubmit}
                  disabled={!manualToken.trim()}
                >
                  Validate Token
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="space-y-6">
           {scanResult?.type === 'success' && (
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
                      <span className="font-mono font-bold text-gray-900">{scanResult.tokenId}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm flex items-center gap-1"><User size={14}/> Student</span>
                      <span className="font-medium text-gray-900">{scanResult.userName}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={14}/> Slot Time</span>
                      <span className="font-medium text-blue-600">{scanResult.slotTime}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Meal Type</span>
                      <span className="font-medium text-gray-900">{scanResult.mealType}</span>
                   </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-transparent"
                  onClick={resetScan}
                >
                   Confirm Entry & Scan Next
                </Button>
             </div>
           )}

           {(scanResult?.type === 'invalid' || scanResult?.type === 'expired') && (
             <div className="bg-red-50 border border-red-100 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="text-red-600" size={32} />
                  <div>
                    <h3 className="text-lg font-bold text-red-900">
                      {scanResult.type === 'expired' ? 'Token Expired' : 'Invalid Token'}
                    </h3>
                    <p className="text-red-700 text-sm">Action Required</p>
                  </div>
                </div>
                <p className="text-red-800 mb-4">
                   {scanResult.message || 'This token has expired or belongs to a different time slot.'}
                </p>
                <Button variant="danger" className="w-full" onClick={resetScan}>
                   Dismiss & Scan Again
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
