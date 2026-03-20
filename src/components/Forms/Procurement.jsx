const ProcurementForm = ({ data, onChange }) => {
  const rows = data.components?.length ? data.components : [{ partNumber: "", description: "", manufacturers: "" }];

  const updateFile = (file) => {
    onChange({
      ...data,
      componentFile: file || null,
    });
  };

  const updateRow = (index, field, value) => {
    const nextRows = rows.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    onChange({
      ...data,
      components: nextRows,
    });
  };

  const addRow = () => {
    onChange({
      ...data,
      components: [...rows, { partNumber: "", description: "", manufacturers: "" }],
    });
  };

  const removeRow = (index) => {
    const filtered = rows.filter((_, i) => i !== index);
    onChange({
      ...data,
      components: filtered.length ? filtered : [{ partNumber: "", description: "", manufacturers: "" }],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Component List</label>
        <p className="text-[11px] text-muted-foreground">
          Share your component requirements by uploading an Excel file or filling the table below.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Upload Excel (optional)</p>
          <p className="text-xs text-muted-foreground">
            Accepted format: .xls, .xlsx, .csv with columns: Part Number, Description (optional), Manufacturer Name(s).
          </p>
        </div>
        <input
          type="file"
          accept=".xls,.xlsx,.csv"
          onChange={(e) => updateFile(e.target.files?.[0] || null)}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
        />
        {data.componentFile && (
          <p className="text-xs text-foreground/80">
            Selected file: <span className="font-medium">{data.componentFile.name}</span>
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Or add components manually</p>
          <button
            type="button"
            onClick={addRow}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            + Add Row
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-foreground">Part Number *</th>
                <th className="px-3 py-2 text-left font-medium text-foreground">Description (Optional)</th>
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
      </div>
    </div>
  );
};

export default ProcurementForm;
