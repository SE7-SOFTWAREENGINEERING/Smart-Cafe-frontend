import React, { useState } from "react";
import {
  Scan,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import * as bookingService from "../../../services/booking.service";
import type { Booking } from "../../../services/booking.service";
import toast from "react-hot-toast";

const TokenScanner: React.FC = () => {
  const [tokenId, setTokenId] = useState("");
  const [scanResult, setScanResult] = useState<
    "idle" | "valid" | "expired" | "invalid"
  >("idle");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!tokenId.trim()) return;
    try {
      setLoading(true);
      setScanResult("idle");
      const result = await bookingService.getBookingByToken(tokenId.trim());
      setBooking(result);
      if (result.status === "confirmed" || result.status === "pending") {
        setScanResult("valid");
      } else if (
        result.status === "completed" ||
        result.status === "cancelled"
      ) {
        setScanResult("expired");
      } else {
        setScanResult("invalid");
      }
    } catch (error) {
      setScanResult("invalid");
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEntry = async () => {
    if (!booking) return;
    try {
      await bookingService.completeBooking(booking.id);
      toast.success(`Token ${booking.tokenNumber} entry approved!`);
      setScanResult("idle");
      setBooking(null);
      setTokenId("");
    } catch (error) {
      toast.error("Failed to approve entry");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">
        Token Validation
      </h3>

      <div className="flex flex-col gap-4">
        {/* Input Area */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Scan or Enter Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none font-mono text-lg uppercase"
            />
          </div>
          <button
            onClick={handleScan}
            className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover transition flex items-center gap-2"
          >
            <Scan size={20} /> <span className="hidden md:inline">Scan</span>
          </button>
        </div>

        {/* Result Display */}
        {scanResult === "idle" && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
            <Scan size={48} className="mb-2 opacity-50" />
            <p className="text-sm">Ready to scan tokens</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Verifying token...</span>
          </div>
        )}

        {scanResult === "valid" && booking && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {booking.tokenNumber}
            </h4>
            <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1 mt-1">
              <CheckCircle size={14} /> Valid Token —{" "}
              {(booking as any).user?.name || booking.guestName || "Student"}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleApproveEntry}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Approve Entry
              </button>
            </div>
          </div>
        )}

        {scanResult === "expired" && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
              <Clock size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {booking?.tokenNumber || tokenId}
            </h4>
            <p className="text-sm text-red-600 font-medium flex items-center justify-center gap-1 mt-1">
              <Clock size={14} /> Token already used or cancelled
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setScanResult("idle");
                  setBooking(null);
                  setTokenId("");
                }}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {scanResult === "invalid" && !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
              <AlertTriangle size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {tokenId || "Unknown"}
            </h4>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Token not found or invalid
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setScanResult("idle");
                  setTokenId("");
                }}
                className="text-sm text-brand hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenScanner;
