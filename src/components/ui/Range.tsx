"use client";
import React from "react";
import { Input } from "./Input";

export function Range({
  min,
  max,
  onChange,
  placeholders = ["Min", "Max"]
}: {
  min?: number;
  max?: number;
  onChange: (v: { min?: number; max?: number }) => void;
  placeholders?: [string, string];
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={placeholders[0]}
        value={min ?? ""}
        onChange={(e) => onChange({ min: e.target.value === "" ? undefined : Number(e.target.value), max })}
      />
      <div className="text-text-muted">—</div>
      <Input
        placeholder={placeholders[1]}
        value={max ?? ""}
        onChange={(e) => onChange({ min, max: e.target.value === "" ? undefined : Number(e.target.value) })}
      />
    </div>
  );
}



