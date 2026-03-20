const radioClass = (selected) =>
  `cursor-pointer rounded-lg border px-5 py-4 text-sm font-medium transition-all flex-1 text-center ${
    selected
      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
      : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
  }`;

const ProcurementForm = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Procurement Source</label>
        <p className="text-[11px] text-muted-foreground">Choose who handles sourcing the components</p>
      </div>
      <div className="flex gap-3">
        {[
          { value: "By Vendor", desc: "We source components from our trusted suppliers" },
          { value: "By User", desc: "You provide the components directly" },
        ].map((v) => (
          <button
            type="button"
            key={v.value}
            className={radioClass(data.procurementSource === v.value)}
            onClick={() => onChange({ procurementSource: v.value })}
          >
            <div className="font-semibold text-sm">{v.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1 font-normal">{v.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProcurementForm;
