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

const AssemblyForm = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-7">
      {/* BOM upload */}
      <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4">
        <FileUpload
          label="BOM File"
          accept=".csv,.xlsx,.xls,.pdf,.zip"
          file={data.bomFile}
          onFileSelect={(f) => update("bomFile", f)}
        />
        <p className={`${hintClass} mt-2`}>Upload your Bill of Materials (CSV, Excel, or PDF)</p>
      </div>

      <div className="space-y-2">
        <SectionLabel hint="Total number of assembled units needed">Units</SectionLabel>
        <input
          type="number"
          min="1"
          className={inputClass}
          placeholder="Number of units"
          value={data.units}
          onChange={(e) => update("units", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <SectionLabel>Stencil</SectionLabel>
          <div className={radioGroupClass}>
            {["Procure from us", "Provided by user"].map((v) => (
              <button type="button" key={v} className={radioClass(data.stencil === v)} onClick={() => update("stencil", v)}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <SectionLabel hint="RoHS compliant or standard">Solder Type</SectionLabel>
          <div className={radioGroupClass}>
            {["ROHS", "Non ROHS"].map((v) => (
              <button type="button" key={v} className={radioClass(data.solderType === v)} onClick={() => update("solderType", v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <SectionLabel hint="Who provides the electronic components?">Components</SectionLabel>
          <div className={radioGroupClass}>
            {["Provided by user", "Procure from us"].map((v) => (
              <button type="button" key={v} className={radioClass(data.componentsSource === v)} onClick={() => update("componentsSource", v)}>
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

        <div className="space-y-2">
          <SectionLabel hint="Who provides the bare PCB boards?">PCB Source</SectionLabel>
          <div className={radioGroupClass}>
            {["Provided by user", "Fabricate from us"].map((v) => (
              <button type="button" key={v} className={radioClass(data.pcbSource === v)} onClick={() => update("pcbSource", v)}>
                {v}
              </button>
            ))}
          </div>
          {data.pcbSource === "Fabricate from us" && (
            <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Fabrication tab will be added for configuration
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssemblyForm;
