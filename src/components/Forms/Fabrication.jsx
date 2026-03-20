import FileUpload from "../FileUpload";

const selectClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer";
const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "text-sm font-medium text-foreground";
const hintClass = "text-[11px] text-muted-foreground mt-1";

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

const FabricationForm = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-7">
      {/* File upload section */}
      <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4">
        <FileUpload
          label="Gerber File"
          accept=".zip,.gbr,.ger,.gtl,.gbl,.gbs,.gts"
          file={data.gerberFile}
          onFileSelect={(f) => update("gerberFile", f)}
        />
        <p className={`${hintClass} mt-2`}>Upload your Gerber files as a .zip archive or individual Gerber files</p>
      </div>

      {/* Basic specs - 2 col grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <SectionLabel hint="Number of copper layers">Layers</SectionLabel>
          <select className={selectClass} value={data.layers} onChange={(e) => update("layers", e.target.value)}>
            {["1", "2", "4", "6", "8"].map((l) => (
              <option key={l} value={l}>
                {l} Layer{l !== "1" ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <SectionLabel hint="Minimum order: 5 pcs">PCB Quantity</SectionLabel>
          <input
            type="number"
            min="1"
            className={inputClass}
            placeholder="e.g. 100"
            value={data.quantity}
            onChange={(e) => update("quantity", e.target.value)}
          />
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-2">
        <SectionLabel hint="Width (X) and Height (Y) in millimeters">Board Dimensions</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              className={`${inputClass} pr-10`}
              placeholder="Width (X)"
              value={data.width}
              onChange={(e) => update("width", e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">mm</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              className={`${inputClass} pr-10`}
              placeholder="Height (Y)"
              value={data.height}
              onChange={(e) => update("height", e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">mm</span>
          </div>
        </div>
      </div>

      {/* Discrete Design */}
      <div className="space-y-2">
        <SectionLabel hint="Number of unique designs per panel">Discrete Design</SectionLabel>
        <div className={radioGroupClass}>
          {["1", "2", "3", "4", "5"].map((v) => (
            <button type="button" key={v} className={radioClass(data.discreteDesign === v)} onClick={() => update("discreteDesign", v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Board Type */}
      <div className="space-y-2">
        <SectionLabel>Board Type</SectionLabel>
        <div className={radioGroupClass}>
          {["Single PCB", "Panel by Customer", "Panel by Us"].map((v) => (
            <button type="button" key={v} className={radioClass(data.boardType === v)} onClick={() => update("boardType", v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Thickness row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <SectionLabel hint="Standard: 1.6mm">PCB Thickness</SectionLabel>
          <div className={radioGroupClass}>
            {["0.4mm", "0.8mm", "1.2mm", "1.6mm", "2.0mm", "2.4mm"].map((v) => (
              <button type="button" key={v} className={radioClass(data.thickness === v)} onClick={() => update("thickness", v)}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <SectionLabel hint="Standard: 1 oz">Copper Thickness</SectionLabel>
          <div className={radioGroupClass}>
            {["1 oz", "2 oz", "3 oz"].map((v) => (
              <button type="button" key={v} className={radioClass(data.copperThickness === v)} onClick={() => update("copperThickness", v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Finish */}
      <div className="space-y-2">
        <SectionLabel hint="Surface finish applied to exposed copper">PCB Finish</SectionLabel>
        <div className={radioGroupClass}>
          {["HASL Finish", "Lead Free HASL", "ENIG"].map((v) => (
            <button type="button" key={v} className={radioClass(data.pcbFinish === v)} onClick={() => update("pcbFinish", v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Mask Color */}
      <div className="space-y-2">
        <SectionLabel>Mask Color</SectionLabel>
        <div className={radioGroupClass}>
          {[
            { name: "Green", color: "#22c55e" },
            { name: "Blue", color: "#3b82f6" },
            { name: "Black", color: "#1a1a2e" },
            { name: "White", color: "#e5e5e5" },
            { name: "Red", color: "#ef4444" },
          ].map((v) => (
            <button
              type="button"
              key={v.name}
              className={radioClass(data.maskColor === v.name)}
              onClick={() => update("maskColor", v.name)}
            >
              <span className="inline-block h-3 w-3 rounded-full mr-1.5 border border-border/50 shrink-0" style={{ backgroundColor: v.color }} />
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FabricationForm;
