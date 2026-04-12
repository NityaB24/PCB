"use client";
import FileUpload from "../FileUpload";

const hintClass = "text-[11px] text-muted-foreground mt-1";

const StencilForm = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-border bg-secondary/20 p-4">
        <FileUpload
          label="Gerber File (for Stencil)"
          accept=".zip,.gbr,.ger,.gtl,.gbl,.gbs,.gts"
          file={data.gerberFile}
          onFileSelect={(f) => onChange({ ...data, gerberFile: f })}
        />
        <p className={`${hintClass} mt-2`}>
          Upload your Gerber files for stencil production (.zip or individual Gerber files)
        </p>
      </div>
    </div>
  );
};

export default StencilForm;
