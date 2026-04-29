"use client";

import { useState } from "react";

const ProcurementForm = ({ data, onChange, submitAttempted = false }) => {
  const [fileError, setFileError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const rows = data.components?.length ? data.components : [{ partNumber: "", description: "", manufacturers: "" }];
  const maxFileSizeBytes = 5 * 1024 * 1024;
  const hasManualComponent = rows.some(
    (row) =>
      Boolean(row?.partNumber?.trim()) ||
      Boolean(row?.description?.trim()) ||
      Boolean(row?.manufacturers?.trim()),
  );
  const missingBothInputs = !data.componentFile && !hasManualComponent;
  const showMissingInputsError = (hasInteracted || submitAttempted) && missingBothInputs;

  const updateFile = (file) => {
    setHasInteracted(true);
    if (!file) {
      setFileError("");
      onChange({
        ...data,
        componentFile: null,
      });
      return;
    }

    if (file.size > maxFileSizeBytes) {
      setFileError("File exceeds 5MB. Please upload a smaller file.");
      onChange({
        ...data,
        componentFile: null,
      });
      return;
    }

    setFileError("");
    onChange({
      ...data,
      componentFile: file || null,
    });
  };

  const updateRow = (index, field, value) => {
    setHasInteracted(true);
    const nextRows = rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    onChange({
      ...data,
      components: nextRows,
    });
  };

  const addRow = () => {
    setHasInteracted(true);
    onChange({
      ...data,
      components: [...rows, { partNumber: "", description: "", manufacturers: "" }],
    });
  };

  const removeRow = (index) => {
    setHasInteracted(true);
    const filtered = rows.filter((_, i) => i !== index);
    onChange({
      ...data,
      components: filtered.length ? filtered : [{ partNumber: "", description: "", manufacturers: "" }],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Component List *</label>
        <p className="text-[11px] text-muted-foreground">
          Share your component requirements by uploading an Excel file or filling the table below.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Upload Excel *</p>
          <p className="text-xs text-muted-foreground">
            Accepted format: .xls, .xlsx, .csv with columns: Part Number, Description, Manufacturer Name(s).
          </p>
        </div>
        <input
          type="file"
          accept=".xls,.xlsx,.csv"
          onChange={(e) => updateFile(e.target.files?.[0] || null)}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
        />
        {fileError && <p className="text-xs text-destructive">{fileError}</p>}
        {showMissingInputsError && (
          <p className="text-xs text-destructive">
            Upload a component file or add at least one component manually.
          </p>
        )}
        {data.componentFile && (
          <p className="text-xs text-foreground/80">
            Selected file: <span className="font-medium">{data.componentFile.name}</span>
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Or add components manually *</p>
          <button
            type="button"
            onClick={addRow}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            + Add Row
          </button>
        </div>

        <div className="rounded-lg border border-border hidden md:block overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-foreground">Part Number *</th>
                <th className="px-3 py-2 text-left font-medium text-foreground">Description *</th>
                <th className="px-3 py-2 text-left font-medium text-foreground">Manufacturer Name(s) *</th>
                <th className="px-3 py-2 text-left font-medium text-foreground w-[90px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="p-2">
                    <input
                      value={row.partNumber}
                      onChange={(e) => updateRow(index, "partNumber", e.target.value)}
                      placeholder="e.g. STM32F103C8T6"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.description}
                      onChange={(e) => updateRow(index, "description", e.target.value)}
                      placeholder="e.g. Microcontroller"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.manufacturers}
                      onChange={(e) => updateRow(index, "manufacturers", e.target.value)}
                      placeholder="e.g. ST, NXP"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 md:hidden">
          {rows.map((row, index) => {
            const summary = row.partNumber || row.manufacturers || "Untitled component";
            return (
              <details key={index} className="group rounded-lg border border-border bg-background">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-foreground">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Component {index + 1}</span>
                    <span className="text-sm font-semibold text-foreground truncate">{summary}</span>
                    {row.description && (
                      <span className="text-xs text-muted-foreground truncate">{row.description}</span>
                    )}
                  </div>
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>

                <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Part Number *</label>
                    <input
                      value={row.partNumber}
                      onChange={(e) => updateRow(index, "partNumber", e.target.value)}
                      placeholder="e.g. STM32F103C8T6"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Description *</label>
                    <input
                      value={row.description}
                      onChange={(e) => updateRow(index, "description", e.target.value)}
                      placeholder="e.g. Microcontroller"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Manufacturer Name(s) *</label>
                    <input
                      value={row.manufacturers}
                      onChange={(e) => updateRow(index, "manufacturers", e.target.value)}
                      placeholder="e.g. ST, NXP"
                      className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    Remove Row
                  </button>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcurementForm;
