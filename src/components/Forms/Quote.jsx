const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "text-sm font-medium text-foreground";


const QuoteFormSection = ({ data, onChange, errors }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>Name <span className="text-destructive">*</span></label>
          <input className={`${inputClass} ${errors.name ? "border-destructive" : ""}`} placeholder="Your name" value={data.name} onChange={(e) => update("name", e.target.value)} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Email <span className="text-destructive">*</span></label>
          <input type="email" className={`${inputClass} ${errors.email ? "border-destructive" : ""}`} placeholder="you@company.com" value={data.email} onChange={(e) => update("email", e.target.value)} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>Phone Number <span className="text-destructive">*</span></label>
          <input type="tel" className={`${inputClass} ${errors.phone ? "border-destructive" : ""}`} placeholder="+1 234 567 890" value={data.phone} onChange={(e) => update("phone", e.target.value)} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Company Name</label>
          <input className={inputClass} placeholder="Optional" value={data.companyName} onChange={(e) => update("companyName", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Purpose of Board</label>
        <input className={inputClass} placeholder="e.g. IoT sensor module, prototype" value={data.purpose} onChange={(e) => update("purpose", e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Additional Comments</label>
        <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Any specific requirements or notes..." value={data.comments} onChange={(e) => update("comments", e.target.value)} />
      </div>
    </div>
  );
};

export default QuoteFormSection;
