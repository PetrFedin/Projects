import React from 'react';
import type { DossierAttributeDisplayDefinition } from './workshop2-dossier-attribute-input.types';
import { WorkshopInlineHintIcon } from '@/components/brand/production/workshop2-phase1-dossier-panel-field-hints';

interface DossierAttributeInputProps {
  attribute: DossierAttributeDisplayDefinition;
  onChange: (value: string | string[] | number | null) => void;
  /** E2E / Platform Core golden path */
  inputTestId?: string;
}

export const DossierAttributeInput: React.FC<DossierAttributeInputProps> = ({
  attribute,
  onChange,
  inputTestId,
}) => {
  const renderInput = () => {
    switch (attribute.uiType) {
      case 'text_input':
        return (
          <input
            type="text"
            value={attribute.value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={attribute.placeholder}
            data-testid={inputTestId}
            className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
          />
        );
      case 'number_input':
        return (
          <input
            type="number"
            value={attribute.value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={attribute.placeholder}
            className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
          />
        );
      case 'date_input':
        return (
          <input
            type="date"
            value={attribute.value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={attribute.placeholder}
            className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
          />
        );
      case 'select':
        return (
          <select
            value={attribute.value as string}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
          >
            {attribute.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <select
            multiple
            value={attribute.value as string[]}
            onChange={(e) =>
              onChange(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
          >
            {attribute.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'color_palette':
        return (
          <div className="flex flex-wrap gap-2">
            {attribute.options?.map((option) => (
              <div
                key={option.value}
                className={`h-8 w-8 cursor-pointer rounded-full border-2 ${
                  attribute.value === option.value ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: option.color }}
                onClick={() => onChange(option.value)}
              ></div>
            ))}
          </div>
        );
      case 'image_upload':
        return (
          <div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => onChange(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="h-8 w-full rounded-md border bg-white px-2 py-1 text-[11px]"
            />
            {attribute.value &&
              typeof attribute.value === 'string' &&
              attribute.value.startsWith('data:') && (
                <img src={attribute.value} alt="Uploaded" className="mt-2 max-h-40" />
              )}
            {!attribute.value && attribute.imageUploadUrl && (
              <img src={attribute.imageUploadUrl} alt="Uploaded" className="mt-2 max-h-40" />
            )}
          </div>
        );
      default:
        return <p>Unknown UI Type: {attribute.uiType}</p>;
    }
  };

  return (
    <div className="border-border-subtle bg-bg-surface2/40 flex h-full min-h-[52px] flex-col justify-between space-y-0.5 rounded-md border px-2 py-1.5">
      <div>
        <label className="text-text-primary mb-1 flex min-w-0 items-center gap-1 truncate text-[11px] font-semibold leading-none">
          <span>{attribute.label}</span>
          {attribute.description && (
            <WorkshopInlineHintIcon label={attribute.label}>
              {attribute.description}
            </WorkshopInlineHintIcon>
          )}
        </label>
        {renderInput()}
      </div>
    </div>
  );
};
