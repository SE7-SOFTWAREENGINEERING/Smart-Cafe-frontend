import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  AlertOctagon,
  Loader2,
} from "lucide-react";
import {
  getDailySummary,
  getTransactions,
  type DailySummary,
} from "../../../services/financial.service";

interface Props {
  canteenId?: string;
}

const RevenueStats: React.FC<Props> = ({ canteenId }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [unsettledCount, setUnsettledCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [daily, pending] = await Promise.all([
          getDailySummary({ canteenId }).catch(() => null),
          getTransactions({ status: "PENDING" }).catch(() => null),
        ]);
        if (daily) setSummary(daily);
        if (pending) setUnsettledCount(pending.total || 0);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canteenId]);

  const totalRevenue = summary?.totalRevenue || 0;
  const digitalTotal =
    summary?.byPaymentMethod
      ?.filter((p) =>
        ["CARD", "UPI", "WALLET", "BANK_TRANSFER"].includes(p._id),
      )
      .reduce((s, p) => s + p.total, 0) || 0;
  const cashTotal =
    summary?.byPaymentMethod
      ?.filter((p) => ["CASH", "OTHER"].includes(p._id))
      .reduce((s, p) => s + p.total, 0) || 0;
  const digitalPct =
    totalRevenue > 0 ? Math.round((digitalTotal / totalRevenue) * 100) : 0;
  const cashPct =
    totalRevenue > 0 ? Math.round((cashTotal / totalRevenue) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[250px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Today's Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹ {totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          {summary?.netIncome !== undefined && summary.netIncome >= 0 ? (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <TrendingUp size={14} /> Net: ₹
              {summary.netIncome.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-red-600 font-medium flex items-center gap-1">
              <TrendingDown size={14} /> Net: ₹
              {Math.abs(summary?.netIncome || 0).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} /> Digital/Online
            </span>
            <span className="font-medium text-gray-900">
              ₹ {digitalTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${digitalPct}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Wallet size={14} /> Cash/Token
            </span>
            <span className="font-medium text-gray-900">
              ₹ {cashTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${cashPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {unsettledCount > 0 && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-xs font-medium">
          <AlertOctagon size={14} />
          <span>
            {unsettledCount} Unsettled Transaction
            {unsettledCount !== 1 ? "s" : ""} detected
          </span>
        </div>
      )}
    </div>
  );
};

export default RevenueStats;
