import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import {
  CheckCircle,
  QrCode,
  Home,
  Info,
  Clock,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import QRCodeLib from "qrcode";
import {
  encodeTokenPayload,
  type TokenPayload,
} from "../../utils/tokenPayload";

const StudentToken: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    bookingId?: string;
    tokenNumber?: string;
    slotTime?: string;
    slotDate?: string;
    totalAmount?: number;
    items?: Array<{ menuItem?: any; quantity?: number; price?: number }>;
    status?: string;
    expiryAt?: string;
  } | null;

  const tokenNumber = state?.tokenNumber || "N/A";
  const slotTime = state?.slotTime || "N/A";
  const slotDate = state?.slotDate || new Date().toISOString();
  const totalAmount = state?.totalAmount || 0;
  const bookingId = state?.bookingId || "";
  const items = state?.items || [];
  const expiryAt = state?.expiryAt || "";
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const payload = useMemo<TokenPayload>(
    () => ({
      v: 1,
      bookingId,
      tokenNumber,
      slotTime,
      slotDate,
      totalAmount,
      status: state?.status,
      expiryAt: expiryAt || undefined,
      items: items.map((item, idx) => ({
        name:
          item.menuItem?.itemName || item.menuItem?.name || `Item ${idx + 1}`,
        quantity: item.quantity || 1,
        price: item.price || 0,
      })),
    }),
    [
      bookingId,
      tokenNumber,
      slotTime,
      slotDate,
      totalAmount,
      items,
      state?.status,
      expiryAt,
    ],
  );

  const encodedPayload = useMemo(() => encodeTokenPayload(payload), [payload]);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    QRCodeLib.toDataURL(encodedPayload, {
      margin: 1,
      width: 180,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch(() => {
        if (isMounted) setQrDataUrl("");
      });
    return () => {
      isMounted = false;
    };
  }, [encodedPayload]);

  return (
    <div className="pb-24 min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm space-y-6 relative overflow-hidden">
        {/* Success Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />

        <div className="space-y-2">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 text-sm">
            Your items are being prepared.
          </p>
        </div>

        <div className="border-t border-b border-gray-100 py-6 space-y-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl inline-flex shadow-lg border border-gray-100">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Token QR" className="w-40 h-40" />
            ) : (
              <div className="w-40 h-40 bg-gray-900 text-white flex items-center justify-center rounded-xl">
                <QrCode size={80} />
              </div>
            )}
          </div>
          <p className="text-xs font-mono text-gray-400">Scan at Counter</p>

          {bookingId && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-700">
              Booking ID:{" "}
              <span className="font-bold text-gray-900">
                #{bookingId.slice(-8).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="text-blue-600" size={18} />
            <span className="text-lg font-bold text-gray-900">{slotTime}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              today
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="text-orange-500" size={18} />
            <span>{date}</span>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          {/* Token Number */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">Token Number</span>
            <span className="text-sm text-gray-500">Total Amount</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
              {tokenNumber}
            </span>
            <span className="text-lg font-bold text-blue-600">
              ₹{totalAmount}
            </span>
          </div>

          {/* Order Items */}
          {items.length > 0 && (
            <>
              <div className="h-px bg-gray-100 my-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ShoppingBag size={14} />
                  <span>Order Items</span>
                </div>
                {items.map((item, idx) => {
                  const name =
                    item.menuItem?.itemName ||
                    item.menuItem?.name ||
                    `Item ${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {name} × {item.quantity}
                      </span>
                      <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-left flex gap-3">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              Important
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Please arrive within 15 minutes of your slot time. Show this token
              at the counter.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm mt-8 space-y-3">
        <Button
          className="w-full flex justify-center items-center gap-2"
          onClick={() => navigate("/user/dashboard")}
        >
          <Home size={18} />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default StudentToken;
