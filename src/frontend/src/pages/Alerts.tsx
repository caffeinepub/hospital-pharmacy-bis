import { Skeleton } from "@/components/ui/skeleton";
import { useNearExpiryAlerts, useSuppliers } from "@/hooks/useQueries";
import { AlertTriangle, Calendar, Clock, Package } from "lucide-react";

export function Alerts() {
  const { data: alerts, isLoading } = useNearExpiryAlerts();
  const { data: suppliers } = useSuppliers();

  const supplierName = (id: bigint) =>
    suppliers?.find((s) => s.id === id)?.name ?? `Supplier #${id}`;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-800 text-black tracking-tight">
            Near Expiry Alerts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {isLoading
              ? "Loading…"
              : `${alerts?.length ?? 0} items require immediate attention`}
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {!isLoading && alerts && alerts.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-[14px] font-700 text-red-800 mb-1">
              Action Required
            </p>
            <p className="text-[13px] font-600 text-red-700">
              The following medicines are near their expiry dates and should be
              reviewed or removed from the dispensing queue immediately.
            </p>
          </div>
        </div>
      )}

      {/* Alert Cards */}
      <div
        data-ocid="alerts.list"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => `skel-${i}`).map((skelKey) => (
            <div
              key={skelKey}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        ) : (alerts ?? []).length === 0 ? (
          <div
            data-ocid="alerts.empty_state"
            className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="text-[15px] font-700 text-black mb-1">All Clear!</p>
            <p className="text-[13px] text-slate-500 font-medium">
              No medicines are near their expiry date.
            </p>
          </div>
        ) : (
          (alerts ?? []).map((m, idx) => (
            <div
              key={m.id.toString()}
              data-ocid={`alerts.item.${idx + 1}`}
              className="bg-white border-2 border-red-400 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[11px] font-700 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  NEAR EXPIRY
                </span>
                <span className="text-[11px] font-700 text-slate-400 uppercase">
                  #{idx + 1}
                </span>
              </div>

              {/* Medicine Name */}
              <div>
                <h3 className="text-[16px] font-display font-800 text-black leading-tight">
                  {m.name}
                </h3>
                <p className="text-[13px] font-700 text-slate-600 mt-0.5">
                  {m.dosage}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-red-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-700 text-slate-400 uppercase">
                      Category
                    </p>
                    <p className="text-[12px] font-700 text-black">
                      {m.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-700 text-slate-400 uppercase">
                      Qty Left
                    </p>
                    <p className="text-[12px] font-700 text-black">
                      {Number(m.quantity)} units
                    </p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-700 text-slate-400 uppercase">
                      Expiry Date
                    </p>
                    <p className="text-[13px] font-700 text-red-700">
                      {m.expiryDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supplier */}
              <p className="text-[12px] font-600 text-slate-500 border-t border-red-100 pt-2">
                Supplier:{" "}
                <span className="font-700 text-black">
                  {supplierName(m.supplierId)}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
