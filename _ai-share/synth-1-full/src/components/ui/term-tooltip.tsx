import React, { useState } from 'react';

const DICTIONARY: Record<string, string> = {
  BOM: 'Спецификация (ведомость) материалов и фурнитуры, необходимых для пошива.',
  QC: 'Контроль качества (проверка на брак).',
  PO: 'План заказа (документ на запуск партии в производство).',
  AQL: 'Допустимый уровень брака (стандарт выборки для проверки партии).',
  RFID: 'Радиочастотная метка для быстрого учета товара на складе.',
  CMT: 'Формат работы: только пошив (из давальческого сырья).',
  FPP: 'Формат работы: пошив под ключ (фабрика сама закупает ткань).',
  SKU: 'Артикул (уникальный идентификатор товара).',
  MOQ: 'Минимальный объем заказа (минимальная партия).',
};

interface TooltipProps {
  term: string;
  children?: React.ReactNode;
}

export const TermTooltip: React.FC<TooltipProps> = ({ term, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const definition = DICTIONARY[term.toUpperCase()] || DICTIONARY[term];

  if (!definition) {
    return <>{children || term}</>;
  }

  return (
    <span
      className="relative inline-block cursor-help border-b border-dashed border-gray-400"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || term}
      {isVisible && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
          {definition}
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -mt-1 -ml-1 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
};
