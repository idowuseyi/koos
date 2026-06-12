"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getRequestsAction,
  getUserBrandsAction,
  createRequestAction,
} from "./actions";

interface RequestRow {
  request: {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
  };
  brandName: string;
}

interface Brand {
  id: string;
  name: string;
}

const statusDisplay: Record<string, { label: string; className: string }> = {
  open: { label: "Pending", className: "bg-warning/10 text-warning" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  resolved: { label: "Completed", className: "bg-success/10 text-success" },
  closed: { label: "Closed", className: "bg-on-surface-variant/10 text-on-surface-variant" },
};

export default function RequestsPage() {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [newRequest, setNewRequest] = useState({
    brandId: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [reqs, userBrands] = await Promise.all([
          getRequestsAction(),
          getUserBrandsAction(),
        ]);
        setRequests(reqs as unknown as RequestRow[]);
        setBrands(userBrands as unknown as Brand[]);
      } catch (err) {
        console.error("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = () => {
    if (!newRequest.brandId || !newRequest.subject || !newRequest.message) return;

    startTransition(async () => {
      try {
        const created = await createRequestAction({
          brandId: newRequest.brandId,
          subject: newRequest.subject,
          message: newRequest.message,
        });

        const brand = brands.find((b) => b.id === newRequest.brandId);
        if (created && brand) {
          setRequests((prev) => [
            {
              request: {
                id: (created as { id: string }).id,
                subject: (created as { subject: string }).subject,
                message: (created as { message: string }).message,
                status: (created as { status: string }).status,
                createdAt: (created as { createdAt: Date }).createdAt,
              },
              brandName: brand.name,
            },
            ...prev,
          ]);
        }

        setShowNewRequest(false);
        setNewRequest({ brandId: "", subject: "", message: "" });
      } catch (err) {
        console.error("Failed to create request:", err);
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">
            Professional Requests
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-on-surface">
            Professional Requests
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Request expert marketing services and strategic consultations.
          </p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:ai-glow"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Request
        </button>
      </div>

      {/* New Request Form */}
      {showNewRequest && (
        <div className="glass-panel-strong p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-on-surface">
              New Professional Request
            </h2>
            <button
              onClick={() => setShowNewRequest(false)}
              className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                close
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                Brand
              </label>
              <select
                value={newRequest.brandId}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, brandId: e.target.value }))
                }
                className="w-full"
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={newRequest.subject}
                onChange={(e) =>
                  setNewRequest((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="What do you need help with?"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
              Message
            </label>
            <textarea
              value={newRequest.message}
              onChange={(e) =>
                setNewRequest((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Describe your request in detail..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowNewRequest(false)}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !newRequest.brandId ||
                !newRequest.subject ||
                !newRequest.message ||
                isPending
              }
              className="gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:ai-glow transition-all"
            >
              {isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {/* Request Cards */}
      {requests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              outgoing_mail
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-on-surface mb-2">
            No Requests Yet
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Create your first professional request to get expert marketing assistance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(({ request: req, brandName }) => {
            const status = statusDisplay[req.status] ?? statusDisplay.open;
            return (
              <div key={req.id} className="glass-panel glow-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`status-pill ${status.className}`}>
                      {status.label}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-on-surface">
                      {req.subject}
                    </h3>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      more_vert
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">
                      business
                    </span>
                    {brandName}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">
                      calendar_today
                    </span>
                    {formatDate(req.createdAt)}
                  </div>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                  {req.message}
                </p>

                <div className="flex items-center justify-end mt-4 pt-3 border-t border-outline-variant gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                    View Details
                  </button>
                  {req.status === "in_progress" && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        chat
                      </span>
                      Message
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
