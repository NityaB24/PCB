"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../components/ui/drawer";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["all", "received", "in_review", "quoted", "closed"];
const SERVICE_TITLES = {
  Assembly: "Assembly",
  fabrication: "Fabrication",
  stencil: "Stencil",
  procurement: "Procurement",
};

const SERVICE_FIELD_LABELS = {
  units: "Units",
  bomFile: "BOM File",
  solderType: "Solder Type",
  componentsSource: "Components Source",
  pcbStencilOption: "PCB/Stencils Source",
  width: "Width (mm)",
  height: "Height (mm)",
  layers: "Layers",
  quantity: "Quantity",
  boardType: "Board Type",
  maskColor: "Mask Color",
  pcbFinish: "PCB Finish",
  thickness: "Thickness",
  gerberFile: "Gerber File",
  discreteDesign: "Discrete Design",
  copperThickness: "Copper Thickness",
  stencilRequirement: "Stencil Requirement",
  procurementSource: "Procurement Source",
  componentFile: "Component File",
};

const chipClass = {
  received: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  in_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  quoted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  closed: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const formatQuoteDateParts = (value) => {
  if (!value) return { date: "-", time: "-" };

  const dateValue = new Date(value);
  return {
    date: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dateValue),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateValue),
  };
};

const getInitial = (name) => {
  const firstChar = name?.trim()?.charAt(0)?.toUpperCase();
  return firstChar || "Q";
};

const formatSize = (bytes) => {
  if (typeof bytes !== "number") return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatServiceLabel = (value) => {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatProcurementComponent = (row) => {
  if (!row || typeof row !== "object") return "-";

  const parts = [row.partNumber, row.description, row.manufacturers]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  if (parts.length === 0) {
    return "-";
  }

  return parts.join(" | ");
};

const StatusChip = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${chipClass[status] || "bg-muted text-muted-foreground border-border"}`}
    >
      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-current opacity-80" />
      {status?.replace("_", " ") || "unknown"}
    </span>
  );
};

const STATUS_UPDATE_OPTIONS = STATUS_OPTIONS.filter((value) => value !== "all");

const STATUS_LABELS = {
  received: "Received",
  in_review: "In review",
  quoted: "Quoted",
  closed: "Closed",
};

const getStatusLabel = (value) => STATUS_LABELS[value] || value.replace("_", " ");

const StatusActionMenu = ({ quoteId, status, disabled, onChange }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
        aria-label="Update quote status"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border border-border bg-popover p-2 shadow-2xl shadow-black/10">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Update status
          </p>
          <div className="space-y-1">
            {STATUS_UPDATE_OPTIONS.map((value) => {
              const isActive = value === status;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onChange(quoteId, value);
                    setOpen(false);
                  }}
                  disabled={isActive}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <span>{getStatusLabel(value)}</span>
                  {isActive && <span className="text-[11px] font-semibold uppercase tracking-wide">Current</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminQuotes = () => {
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [total, setTotal] = useState(0);
  const [quotes, setQuotes] = useState([]);

  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingQuoteId, setUpdatingQuoteId] = useState(null);

  const totalPages = useMemo(() => {
    return Math.max(Math.ceil((total || 0) / PAGE_SIZE), 1);
  }, [total]);

  const headers = useMemo(() => {
    if (!adminKey) return null;
    return {
      "x-admin-api-key": adminKey,
    };
  }, [adminKey]);

  const fetchQuotes = useCallback(async () => {
    if (!headers) return;

    setLoadingList(true);
    setListError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });

      if (status !== "all") {
        params.set("status", status);
      }

      const response = await fetch(`/api/quotes?${params.toString()}`, {
        headers,
      });

      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body.error || "Failed to load quotes.");
      }

      setQuotes(Array.isArray(body.quotes) ? body.quotes : []);
      setTotal(Number(body.total || 0));
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Failed to load quotes.");
      setQuotes([]);
      setTotal(0);
    } finally {
      setLoadingList(false);
    }
  }, [headers, page, status]);

  const fetchQuoteDetail = useCallback(
    async (quoteId) => {
      if (!headers || !quoteId) return;

      setLoadingDetail(true);
      setDetailError("");

      try {
        const response = await fetch(`/api/quotes/${quoteId}`, {
          headers,
        });

        const body = await response.json();
        if (!response.ok || !body.ok) {
          throw new Error(body.error || "Failed to load quote detail.");
        }

        setSelectedQuote(body.quote || null);
      } catch (error) {
        setDetailError(
          error instanceof Error ? error.message : "Failed to load quote detail.",
        );
        setSelectedQuote(null);
      } finally {
        setLoadingDetail(false);
      }
    },
    [headers],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("quote-admin-key") || "";
    if (saved) {
      setAdminKey(saved);
      setAdminKeyInput(saved);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleConnect = () => {
    const value = adminKeyInput.trim();
    setAdminKey(value);
    setPage(1);
    setListError("");

    if (value) {
      window.localStorage.setItem("quote-admin-key", value);
    } else {
      window.localStorage.removeItem("quote-admin-key");
      setQuotes([]);
      setTotal(0);
    }
  };

  const openQuote = async (quoteId) => {
    setDrawerOpen(true);
    setSelectedQuoteId(quoteId);
    await fetchQuoteDetail(quoteId);
  };

  const updateQuoteStatus = useCallback(
    async (quoteId, nextStatus) => {
      if (!headers || !quoteId || !nextStatus) return;

      setUpdatingQuoteId(quoteId);
      setUpdatingStatus(true);
      setDetailError("");

      try {
        const response = await fetch(`/api/quotes/${quoteId}`, {
          method: "PATCH",
          headers: {
            ...headers,
            "content-type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        });

        const body = await response.json();
        if (!response.ok || !body.ok) {
          throw new Error(body.error || "Failed to update quote status.");
        }

        const updatedStatus = body.quote.status;
        let removedFromList = false;

        setSelectedQuote((prev) =>
          prev && prev.id === quoteId ? { ...prev, status: updatedStatus } : prev,
        );
        setQuotes((prev) =>
          prev
            .map((quote) =>
              quote.id === quoteId ? { ...quote, status: updatedStatus } : quote,
            )
            .filter((quote) => {
              if (quote.id !== quoteId) return true;
              if (status === "all" || quote.status === status) {
                return true;
              }

              removedFromList = true;
              return false;
            }),
        );

        if (removedFromList && status !== "all") {
          setTotal((prev) => Math.max(prev - 1, 0));
        }
      } catch (error) {
        setDetailError(
          error instanceof Error ? error.message : "Failed to update quote status.",
        );
      } finally {
        setUpdatingStatus(false);
        setUpdatingQuoteId(null);
      }
    },
    [headers, status],
  );

  const handleStatusUpdate = async (nextStatus) => {
    await updateQuoteStatus(selectedQuoteId, nextStatus);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-8">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    Admin <span className="text-primary">Quotes</span>
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review submitted quote requests, inspect payloads, and update status.
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Admin Access
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    placeholder="Enter QUOTE_ADMIN_API_KEY"
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
                    type="password"
                  />
                  <button
                    type="button"
                    onClick={handleConnect}
                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
                  >
                    Connect
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={!adminKey}
                  >
                    {STATUS_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value === "all" ? "All" : value.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={fetchQuotes}
                    disabled={!adminKey || loadingList}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    title="Refresh quotes list"
                  >
                    {loadingList ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">Total quotes: {total}</p>
              </div>

              {listError && (
                <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {listError}
                </p>
              )}

              <div className="overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card md:shadow-sm md:shadow-black/5">
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/35">
                      <tr>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Date</th>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Service</th>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Contact</th>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Status</th>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Attachments</th>
                        <th className="px-5 py-4 text-left font-semibold text-slate-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingList ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                            Loading quotes...
                          </td>
                        </tr>
                      ) : quotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                            No quotes found.
                          </td>
                        </tr>
                      ) : (
                        quotes.map((quote) => {
                          const dateParts = formatQuoteDateParts(quote.created_at);
                          const attachmentsCount = quote.quote_attachments?.length || 0;

                          return (
                            <tr key={quote.id} className="border-t border-border/70 align-middle transition-colors hover:bg-secondary/20">
                              <td className="px-5 py-5 align-middle">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/40 text-muted-foreground">
                                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="4" width="18" height="17" rx="2" />
                                      <path d="M8 2v4M16 2v4M3 10h18" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{dateParts.date}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{dateParts.time}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-5 align-middle font-medium text-foreground">
                                {formatServiceLabel(quote.selected_service)}
                              </td>
                              <td className="px-5 py-5 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                                    {getInitial(quote.contact_name)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground">{quote.contact_name}</p>
                                    <p className="truncate text-sm text-muted-foreground">{quote.contact_email}</p>
                                    <p className="truncate text-sm text-muted-foreground">{quote.contact_phone}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-5 align-middle">
                                <StatusChip status={quote.status} />
                              </td>
                              <td className="px-5 py-5 align-middle">
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05 12 20.49a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.48" />
                                  </svg>
                                  <span>{attachmentsCount} {attachmentsCount === 1 ? "file" : "files"}</span>
                                </div>
                              </td>
                              <td className="px-5 py-5 align-middle">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openQuote(quote.id)}
                                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-slate-900 transition-colors hover:bg-secondary"
                                  >
                                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>View Details</span>
                                  </button>
                                  <StatusActionMenu
                                    quoteId={quote.id}
                                    status={quote.status}
                                    disabled={!adminKey || updatingQuoteId === quote.id}
                                    onChange={updateQuoteStatus}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 bg-secondary/10 md:hidden">
                  {loadingList ? (
                    <p className="rounded-2xl border border-border bg-background px-4 py-6 text-center text-sm text-muted-foreground shadow-sm">
                      Loading quotes...
                    </p>
                  ) : quotes.length === 0 ? (
                    <p className="rounded-2xl border border-border bg-background px-4 py-6 text-center text-sm text-muted-foreground shadow-sm">
                      No quotes found.
                    </p>
                  ) : (
                    quotes.map((quote) => {
                      const dateParts = formatQuoteDateParts(quote.created_at);
                      const attachmentsCount = quote.quote_attachments?.length || 0;

                      return (
                        <div key={quote.id} className="rounded-3xl border border-border bg-background p-4 shadow-sm shadow-black/5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary">
                                {getInitial(quote.contact_name)}
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">{dateParts.date}, {dateParts.time}</p>
                                <p className="mt-2 text-lg font-semibold text-foreground">{quote.contact_name}</p>
                                <p className="text-sm text-muted-foreground">{quote.contact_email}</p>
                                <p className="text-sm text-muted-foreground">{quote.contact_phone}</p>
                              </div>
                            </div>
                            <StatusChip status={quote.status} />
                          </div>

                          <div className="mt-4 rounded-2xl border border-border/70 bg-secondary/20 px-3 py-3">
                            <p className="text-xs text-muted-foreground">Service</p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                              {formatServiceLabel(quote.selected_service)}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                            <div className="inline-flex items-center gap-2 text-primary">
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05 12 20.49a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 0 1-2.12-2.12l8.49-8.48" />
                              </svg>
                              <span className="font-medium">{attachmentsCount} {attachmentsCount === 1 ? "file" : "files"}</span>
                            </div>
                            <StatusActionMenu
                              quoteId={quote.id}
                              status={quote.status}
                              disabled={!adminKey || updatingQuoteId === quote.id}
                              onChange={updateQuoteStatus}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => openQuote(quote.id)}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:brightness-110"
                          >
                            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View Details</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!adminKey || page === 1 || loadingList}
                  className="rounded-md border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={!adminKey || page >= totalPages || loadingList}
                  className="rounded-md border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="h-[90dvh] max-h-[90dvh] overflow-hidden border border-border/60 sm:mx-auto sm:mb-6 sm:w-full sm:max-w-3xl sm:rounded-2xl">
          <div className="h-full overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6">
            <DrawerHeader className="px-0">
              <DrawerTitle>Quote Detail</DrawerTitle>
              <DrawerDescription>
                Full payload, attachments, and status management for this quote.
              </DrawerDescription>
            </DrawerHeader>

            {detailError && (
              <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {detailError}
              </p>
            )}

            {loadingDetail ? (
              <p className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                Loading quote detail...
              </p>
            ) : !selectedQuote ? (
              <p className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                No quote selected.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">Summary</h3>
                    <StatusChip status={selectedQuote.status} />
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <p><span className="text-muted-foreground">Submitted:</span> {formatDate(selectedQuote.created_at)}</p>
                    <p><span className="text-muted-foreground">Service:</span> {formatServiceLabel(selectedQuote.selected_service)}</p>
                    <p><span className="text-muted-foreground">Name:</span> {selectedQuote.contact_name || "-"}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedQuote.contact_phone || "-"}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedQuote.contact_email || "-"}</p>
                    <p><span className="text-muted-foreground">Company:</span> {selectedQuote.company_name || "-"}</p>
                  </div>
                  {(selectedQuote.purpose || selectedQuote.comments) && (
                    <div className="mt-3 space-y-2 text-sm">
                      {selectedQuote.purpose && (
                        <p><span className="text-muted-foreground">Purpose:</span> {selectedQuote.purpose}</p>
                      )}
                      {selectedQuote.comments && (
                        <p><span className="text-muted-foreground">Comments:</span> {selectedQuote.comments}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold">Attachments</h3>
                  {selectedQuote.quote_attachments?.length ? (
                    <div className="space-y-2">
                      {selectedQuote.quote_attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{attachment.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.file_kind} • {formatSize(attachment.size_bytes)}
                            </p>
                          </div>
                          {attachment.signed_url ? (
                            <a
                              href={attachment.signed_url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">No URL</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No attachments on this quote.</p>
                  )}
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold">Service Details</h3>
                  {selectedQuote.services &&
                  typeof selectedQuote.services === "object" &&
                  Object.keys(selectedQuote.services).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(selectedQuote.services).map(([serviceKey, serviceValue]) => {
                        const fields =
                          serviceValue && typeof serviceValue === "object"
                            ? Object.entries(serviceValue)
                            : [];

                        return (
                          <div key={serviceKey} className="rounded-md border border-border bg-background p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                              {SERVICE_TITLES[serviceKey] || serviceKey}
                            </p>

                            {fields.length > 0 ? (
                              <div className="grid gap-2 sm:grid-cols-2">
                                {fields.map(([fieldKey, fieldValue]) => (
                                  <div key={fieldKey} className="rounded-md border border-border/70 bg-card px-2.5 py-2">
                                    <p className="text-[11px] font-medium text-muted-foreground">
                                      {SERVICE_FIELD_LABELS[fieldKey] || fieldKey}
                                    </p>
                                    {fieldKey === "components" && Array.isArray(fieldValue) ? (
                                      <div className="mt-0.5 text-xs text-foreground">
                                        {fieldValue.length > 0 ? (
                                          <div className="overflow-x-auto">
                                            <table className="w-full border-collapse text-xs">
                                              <thead>
                                                <tr className="border-b border-border/50">
                                                  <th className="border border-border/50 bg-secondary/30 px-2 py-1.5 text-left font-semibold">
                                                    Part Number
                                                  </th>
                                                  <th className="border border-border/50 bg-secondary/30 px-2 py-1.5 text-left font-semibold">
                                                    Description
                                                  </th>
                                                  <th className="border border-border/50 bg-secondary/30 px-2 py-1.5 text-left font-semibold">
                                                    Manufacturer Name
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {fieldValue.map((row, rowIndex) => (
                                                  <tr key={rowIndex} className="border-b border-border/30">
                                                    <td className="border border-border/30 px-2 py-1.5 break-words">
                                                      {row?.partNumber?.trim() || "-"}
                                                    </td>
                                                    <td className="border border-border/30 px-2 py-1.5 break-words">
                                                      {row?.description?.trim() || "-"}
                                                    </td>
                                                    <td className="border border-border/30 px-2 py-1.5 break-words">
                                                      {row?.manufacturers?.trim() || "-"}
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        ) : (
                                          <p>-</p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-foreground mt-0.5 break-words">
                                        {formatValue(fieldValue)}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">No data captured for this service.</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No service data available.</p>
                  )}
                </div>
              </div>
            )}

            <DrawerFooter className="mt-4 px-0 pb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Update Status
              </p>
              <div className="grid gap-2 sm:grid-cols-4">
                {STATUS_OPTIONS.filter((value) => value !== "all").map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={updatingStatus || !selectedQuote || selectedQuote.status === value}
                    onClick={() => handleStatusUpdate(value)}
                    className="rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold capitalize disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingStatus && selectedQuote?.status !== value
                      ? "Please wait"
                      : value.replace("_", " ")}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md border border-border px-3 py-2 text-sm bg-red-500/10 text-red-600 hover:bg-red-500/20 mt-4"
              >
                Close
              </button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AdminQuotes;