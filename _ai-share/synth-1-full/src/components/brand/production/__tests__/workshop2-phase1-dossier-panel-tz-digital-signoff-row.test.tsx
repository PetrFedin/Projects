import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WorkshopTzDigitalSignoffRow } from '../workshop2-phase1-dossier-panel-tz-digital-signoff-row';

jest.mock('lucide-react', () => {
  const React = require('react');
  function Bell(props: Record<string, unknown>) {
    return React.createElement('svg', { 'data-testid': 'lucide-bell', ...props });
  }
  return { __esModule: true, Bell };
});

function renderWithTooltip(ui: ReactElement) {
  return render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>);
}

describe('WorkshopTzDigitalSignoffRow', () => {
  it('shows signed state and revoke when allowed', () => {
    const onRevoke = jest.fn();
    renderWithTooltip(
      <WorkshopTzDigitalSignoffRow
        title="Технолог"
        canSign={false}
        signoff={{ by: 'A', at: '2024-01-15T10:00:00.000Z' }}
        onSign={jest.fn()}
        onRevoke={onRevoke}
        canRevoke
      />
    );
    expect(screen.getByText('Подписано')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Снять подпись' })).toBeInTheDocument();
  });

  it('shows sign button when not signed', () => {
    renderWithTooltip(
      <WorkshopTzDigitalSignoffRow
        title="Технолог"
        canSign
        onSign={jest.fn()}
        onRevoke={jest.fn()}
        canRevoke={false}
      />
    );
    expect(screen.getByRole('button', { name: 'Подписать' })).toBeInTheDocument();
  });
});
