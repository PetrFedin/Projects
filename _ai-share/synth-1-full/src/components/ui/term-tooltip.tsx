import React, { useState } from 'react';

const DICTIONARY: Record<string, string> = {
  BOM: 'Bill of Materials — спецификация материалов и фурнитуры для пошива.',
  B2B: 'Business-to-business — оптовые заказы между брендом и магазином.',
  W2: 'Workshop 2 — разработка артикулов и хранилище досье (не привязано к сезону).',
  QC: 'Quality Control — контроль качества (проверка на брак).',
  PO: 'Production Order — производственный заказ (партия в цех после handoff).',
  RFQ: 'Request for Quotation — запрос цены у поставщика.',
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
          <span className="absolute left-1/2 top-full -ml-1 -mt-1 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
};
