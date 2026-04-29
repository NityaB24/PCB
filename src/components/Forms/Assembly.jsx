"use client";

import FileUpload from "../FileUpload";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "text-sm font-medium text-foreground";
const hintClass = "text-[11px] text-muted-foreground mt-0.5";
const radioGroupClass = "flex flex-wrap gap-2";
const radioClass = (selected) =>
  `cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
    selected
      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
      : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
  }`;

const SectionLabel = ({ children, hint }) => (
  <div className="space-y-0.5">
    <label className={labelClass}>{children}</label>
    {hint && <p className={hintClass}>{hint}</p>}
  </div>
);

const pcbStencilOptions = [
  {
    value: "None",
    label: "None",
    desc: "User provides both stencil and PCB",
  },
  {
    value: "Only Stencil from us",
    label: "Only Stencil from us",
    desc: "We provide the stencil, you provide PCB",
  },
  {
    value: "Only Fabrication from us",
    label: "Only Fabrication from us",
    desc: "We fabricate the PCB, you provide stencil",
  },
  {
    value: "Both Stencil and Fabrication from us",
    label: "Both Stencil & Fabrication",
    desc: "We handle both stencil and PCB fabrication",
  },
];

const AssemblyForm = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-7">
      {/* BOM upload */}
      <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4">
        <FileUpload
          label="BOM File *"
          accept=".csv,.xlsx,.xls,.pdf,.zip"
          file={data.bomFile}
          onFileSelect={(f) => update("bomFile", f)}
          required
        />
        <p className={`${hintClass} mt-2`}>Upload your Bill of Materials (CSV, Excel, or PDF)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:items-stretch">
        <div className="col-span-2 space-y-2 rounded-lg border border-border bg-secondary/20 p-4 md:col-span-1">
          <SectionLabel hint="Total number of assembled units needed">Units *</SectionLabel>
          <input
            type="number"
            min="1"
            className={inputClass}
            placeholder="Number of units"
            value={data.units}
            onChange={(e) => update("units", e.target.value)}
          />
        </div>

        <div className="col-span-1 space-y-2 rounded-lg border border-border bg-secondary/20 p-4">
          <SectionLabel hint="RoHS compliant or standard">Solder Type *</SectionLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {["ROHS", "Non ROHS"].map((v) => (
              <button
                type="button"
                key={v}
                className={`${radioClass(data.solderType === v)} w-full text-center justify-center`}
                onClick={() => update("solderType", v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Components Source */}
        <div className="col-span-1 space-y-2 rounded-lg border border-border bg-secondary/20 p-4">
          <SectionLabel hint="Who provides the electronic components?">Components *</SectionLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {["Provided by user", "Procure from us"].map((v) => (
              <button
                type="button"
                key={v}
                className={`${radioClass(data.componentsSource === v)} w-full text-center justify-center`}
                onClick={() => update("componentsSource", v)}
              >
                {v}
              </button>
            ))}
          </div>
          {data.componentsSource === "Procure from us" && (
            <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Procurement tab will be added for configuration
            </p>
          )}
        </div>
      </div>

      {/* Fabrication & Stencil Option - merged */}
      <div className="space-y-2">
        <SectionLabel hint="Choose how stencil and PCB board are sourced">Fabrication & Stencil *</SectionLabel>
        <div className="grid gap-2 sm:grid-cols-2">
          {pcbStencilOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => update("pcbStencilOption", opt.value)}
              className={`relative rounded-lg border px-4 py-3 text-left transition-all ${
                data.pcbStencilOption === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-muted-foreground/50 hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  data.pcbStencilOption === opt.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                }`}>
                  {data.pcbStencilOption === opt.value && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${
                    data.pcbStencilOption === opt.value ? "text-primary" : "text-foreground"
                  }`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {(data.pcbStencilOption === "Only Stencil from us") && (
          <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Stencil tab will be added - upload your Gerber file there
          </p>
        )}
        {(data.pcbStencilOption === "Only Fabrication from us" || data.pcbStencilOption === "Both Stencil and Fabrication from us") && (
          <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Fabrication tab will be added for full PCB configuration
          </p>
        )}
      </div>
    </div>
  );
};

export default AssemblyForm;
