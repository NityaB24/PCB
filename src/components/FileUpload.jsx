"use client";

import { useState, useCallback } from "react";

const FileUpload = ({ label, accept, onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : file
            ? "border-primary/30 bg-primary/5"
            : "border-border hover:border-muted-foreground/50"
        }`}
        onClick={() => document.getElementById(`file-${label}`)?.click()}
      >
        <input
          id={`file-${label}`}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="ml-2 rounded-md p-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <p className="text-sm text-muted-foreground">
              Drop file here or <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">{accept}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
