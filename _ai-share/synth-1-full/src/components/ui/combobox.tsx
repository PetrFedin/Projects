'use client';

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "./input"
import { Label } from "./label"

interface ComboboxOption {
    value: string;
    label: string;
}

export interface ComboboxGroup {
    label: string;
    options: ComboboxOption[];
}

export type ComboboxOptions = (ComboboxOption | ComboboxGroup)[];

interface ComboboxProps {
    options: ComboboxOptions;
    value?: string | string[];
    onChange: (value: string | string[] | undefined) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyPlaceholder?: string;
    disabled?: boolean;
    multiple?: boolean;
    className?: string;
}

export function Combobox({ 
    options, 
    value, 
    onChange, 
    placeholder = "Выберите...", 
    searchPlaceholder="Поиск...", 
    emptyPlaceholder="Не найдено.",
    disabled = false,
    multiple = false,
    className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [isCustomValueDialogOpen, setIsCustomValueDialogOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    if (currentValue === "__add_new__") {
      setCustomValue("");
      setIsCustomValueDialogOpen(true);
      setOpen(false);
      return;
    }
    
    if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(currentValue)
            ? currentValues.filter(v => v !== currentValue)
            : [...currentValues, currentValue];
        onChange(newValues);
    } else {
        const newValue = currentValue === value ? undefined : currentValue;
        onChange(newValue);
        setOpen(false);
    }
  };
  
  const handleSaveCustomValue = () => {
    if (customValue.trim()) {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        onChange([...currentValues, customValue.trim()]);
      } else {
        onChange(customValue.trim());
      }
      setIsCustomValueDialogOpen(false);
    }
  }

  const allOptions = React.useMemo(() => {
    if (!Array.isArray(options)) {
        return [];
    }
    const flatOptions: ComboboxOption[] = [];
    options.forEach(option => {
        if ('options' in option && Array.isArray(option.options)) {
            flatOptions.push(...option.options);
        } else if ('value' in option) {
            flatOptions.push(option as ComboboxOption);
        }
    });
    return flatOptions;
  }, [options]);

  const displayedValue = React.useMemo(() => {
    if (multiple) {
        const values = Array.isArray(value) ? value : [];
        if (values.length === 0) return placeholder;
        if (values.length === 1) return allOptions.find(o => o.value === values[0])?.label || values[0];
        return `${values.length} выбрано`;
    }
    return allOptions.find((option) => option.value === value)?.label || value || placeholder;
  }, [value, allOptions, placeholder, multiple]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between font-normal", className)}
                disabled={disabled}
              >
                <span className="truncate">
                  {displayedValue}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command
              filter={(itemValue, search) => {
                  if (itemValue === "__add_new__") return 1;
                  const itemLabel = allOptions.find(o => o.value.toLowerCase() === itemValue)?.label;
                  if (itemLabel?.toLowerCase().includes(search.toLowerCase())) return 1;
                  return 0; // Only filter by label
              }}
          >
            <CommandInput 
              placeholder={searchPlaceholder}
            />
            <CommandList>
              <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
              {Array.isArray(options) && options.map((item, index) => {
                  if ('options' in item && Array.isArray(item.options)) {
                      return (
                          <CommandGroup key={item.label + index} heading={item.label}>
                            {(item.options || []).map(option => (
                               <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={handleSelect}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    multiple 
                                      ? (Array.isArray(value) && value.includes(option.value) ? "opacity-100" : "opacity-0")
                                      : (value === option.value ? "opacity-100" : "opacity-0")
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                      )
                  }
                  return (
                     <CommandItem
                        key={(item as ComboboxOption).value}
                        value={(item as ComboboxOption).value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            multiple 
                                ? (Array.isArray(value) && value.includes((item as ComboboxOption).value) ? "opacity-100" : "opacity-0")
                                : (value === (item as ComboboxOption).value ? "opacity-100" : "opacity-0")
                          )}
                        />
                        {(item as ComboboxOption).label}
                      </CommandItem>
                  )
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
