import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';

jest.mock('lucide-react', () => {
  const React = require('react');
  function Info(props: Record<string, unknown>) {
    return React.createElement('svg', { 'data-testid': 'lucide-info', ...props });
  }
  return { __esModule: true, Info };
});

import {
  WorkshopAttributeHintIcon,
  WorkshopLabelWithHint,
} from '../workshop2-phase1-dossier-panel-field-hints';

function renderWithTooltip(ui: ReactElement) {
  return render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>);
}

describe('workshop2-phase1-dossier-panel-field-hints', () => {
  it('WorkshopLabelWithHint renders label and hint trigger', () => {
    renderWithTooltip(
      <WorkshopLabelWithHint hint={<span data-testid="hint-body">Подсказка</span>}>
        Название поля
      </WorkshopLabelWithHint>
    );
    expect(screen.getByText('Название поля')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Справка по полю' })).toBeInTheDocument();
    expect(screen.getByTestId('lucide-info')).toBeInTheDocument();
  });

  it('WorkshopAttributeHintIcon renders fallback copy when hints empty', () => {
    const attribute = {
      attributeId: 'test-attr',
      name: 'Тестовый атрибут',
    } as AttributeCatalogAttribute;
    renderWithTooltip(<WorkshopAttributeHintIcon attribute={attribute} />);
    expect(screen.getByRole('button', { name: /Подробнее: Тестовый атрибут/ })).toBeInTheDocument();
  });
});
