'use client';

import React from 'react';
import type { SavedView } from '../../types/views';
import type { MarketplaceFilters } from '../../types/filters';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/cn';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}

export function ViewSwitcher({
  currentFilters,
  applyFilters,
}: {
  currentFilters: MarketplaceFilters;
  applyFilters: (filters: Partial<MarketplaceFilters>) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [views, setViews] = React.useState<SavedView[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [scope, setScope] = React.useState<'personal' | 'team'>('personal');

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const json = await api<{ views: SavedView[] }>('/api/views');
      setViews(json.views ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const saveNew = async () => {
    if (!name.trim()) return;
    await api('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), scope, filters: currentFilters }),
    });
    setName('');
    await refresh();
  };

  const updateExisting = async (id: string) => {
    await api(`/api/views/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: currentFilters }),
    });
    await refresh();
  };

  const rename = async (id: string) => {
    const newName = prompt('Rename view:', views.find((v) => v.id === id)?.name ?? '');
    if (!newName) return;
    await api(`/api/views/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    await refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this view?')) return;
    await api(`/api/views/${id}`, { method: 'DELETE' });
    await refresh();
  };

  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
        Views
      </Button>

      {open && (
        <div className="border-border-subtle bg-bg-surface absolute right-0 z-30 mt-2 w-[420px] max-w-[90vw] rounded-lg border p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-text-muted text-xs uppercase tracking-[0.06em]">Saved Views</div>
            <button
              className="text-text-muted hover:text-text-primary"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название представления…"
            />
            <select
              className="border-border-default bg-bg-surface text-text-primary h-10 rounded-md border px-3 text-sm"
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
            >
              <option value="personal">Personal</option>
              <option value="team">Team</option>
            </select>
            <Button variant="cta" onClick={saveNew}>
              Save
            </Button>
          </div>

          <div className="mt-3 max-h-72 space-y-2 overflow-auto">
            {loading ? (
              <div className="text-text-secondary py-4 text-sm">Loading…</div>
            ) : views.length === 0 ? (
              <div className="text-text-secondary py-4 text-sm">No saved views yet.</div>
            ) : (
              views.map((v) => (
                <div
                  key={v.id}
                  className={cn('border-border-subtle hover:bg-bg-surface2 rounded-md border p-2')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-text-primary truncate text-sm font-medium">{v.name}</div>
                      <div className="text-text-muted text-xs">
                        {v.scope === 'team' ? 'Team' : 'Personal'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={() => applyFilters(v.filters)}>
                        Apply
                      </Button>
                      <Button variant="ghost" onClick={() => updateExisting(v.id)}>
                        Update
                      </Button>
                      <Button variant="ghost" onClick={() => rename(v.id)}>
                        Rename
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-state-error hover:bg-[rgba(220,38,38,0.06)]"
                        onClick={() => remove(v.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="secondary" onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
