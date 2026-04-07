
'use client';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface ArFilterProps {
    hasAR?: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export default function ArFilter({ hasAR, onCheckedChange }: ArFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="ar-mode" checked={hasAR} onCheckedChange={onCheckedChange}/>
      <Label htmlFor="ar-mode" className="flex items-center gap-2 font-normal cursor-pointer">
        <Sparkles className="h-4 w-4 text-accent" />
        Digital-Примерка
      </Label>
    </div>
  );
}
