'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { canAccess, type PlatformRole, type Resource } from '@/lib/rbac';
import { NAV_GROUP_RESOURCE } from '@/lib/data/profile-page-features';
import { brandNavGroups } from '@/lib/data/brand-navigation';

const ROLES: PlatformRole[] = [
  'admin',
  'brand',
  'retailer',
  'buyer',
  'distributor',
  'manufacturer',
  'supplier',
  'designer',
  'technologist',
  'production_manager',
  'finance_manager',
  'sales_rep',
  'merchandiser',
];

const ACTIONS = ['view', 'edit', 'delete'] as const;
const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  brand: 'Brand',
  retailer: 'Retailer',
  buyer: 'Buyer',
  distributor: 'Distributor',
  manufacturer: 'Manufacturer',
  supplier: 'Supplier',
  designer: 'Designer',
  technologist: 'Technologist',
  production_manager: 'Production Manager',
  finance_manager: 'Finance Manager',
  sales_rep: 'Sales Rep',
  merchandiser: 'Merchandiser',
};

/** Локальный оверрайд прав (пока не применяется к навигации). */
type OverrideKey = `${PlatformRole}:${string}:${string}`;

/** Таблица ролей и доступов. UI для настройки — фильтрация по ролям пока не применяется. */
export function RolePermissionsTable() {
  const groups = brandNavGroups.filter((g) => NAV_GROUP_RESOURCE[g.id]);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set(['admin', 'brand']));
  const [overrides, setOverrides] = useState<Set<OverrideKey>>(new Set());

  const hasAccess = useCallback(
    (role: PlatformRole, resource: Resource, action: string) => {
      const key: OverrideKey = `${role}:${resource}:${action}`;
      if (overrides.has(key))
        return !canAccess(role, resource, action as Parameters<typeof canAccess>[2]);
      return canAccess(role, resource, action as Parameters<typeof canAccess>[2]);
    },
    [overrides]
  );

  const toggleOverride = useCallback((role: PlatformRole, resource: Resource, action: string) => {
    const key: OverrideKey = `${role}:${resource}:${action}`;
    setOverrides((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleRole = (r: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  return (
    <Card className="border-border-default overflow-hidden rounded-xl">
      <CardContent className="p-0">
        <div className="border-border-subtle bg-bg-surface2/80 border-b p-4">
          <p className="text-text-secondary text-[10px] font-black uppercase tracking-wider">
            Роли × разделы. Переключатели — для настройки (пока не применяются к навигации).
          </p>
        </div>
        <div className="max-h-[60vh] overflow-x-auto overflow-y-auto">
          <table className="w-full text-[10px]">
            <thead className="border-border-default sticky top-0 z-10 border-b bg-white">
              <tr>
                <th className="text-text-secondary w-32 p-3 text-left font-black uppercase tracking-wider">
                  Роль
                </th>
                {groups.map((g) => (
                  <th
                    key={g.id}
                    className="text-text-secondary min-w-[140px] p-2 text-left font-bold uppercase"
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
              <tr className="border-border-subtle bg-bg-surface2/80 border-b">
                <th />
                {groups.map((g) => (
                  <th key={g.id} className="text-text-muted p-2 text-[8px] font-bold uppercase">
                    view · edit · delete
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => {
                const isExpanded = expandedRoles.has(role);
                return (
                  <tr key={role} className="border-border-subtle hover:bg-bg-surface2/80 border-b">
                    <td className="p-2">
                      <button
                        onClick={() => toggleRole(role)}
                        className="text-text-primary hover:text-accent-primary flex items-center gap-2 font-bold uppercase"
                      >
                        {isExpanded ? '−' : '+'} {ROLE_LABELS[role] ?? role}
                      </button>
                    </td>
                    {isExpanded &&
                      groups.map((g) => {
                        const resource = NAV_GROUP_RESOURCE[g.id];
                        if (!resource)
                          return (
                            <td key={g.id} className="p-2">
                              —
                            </td>
                          );
                        return (
                          <td key={g.id} className="p-2">
                            <div className="flex flex-wrap gap-2">
                              {ACTIONS.map((a) => (
                                <label key={a} className="flex cursor-pointer items-center gap-1">
                                  <Switch
                                    checked={hasAccess(role, resource, a)}
                                    onCheckedChange={() => toggleOverride(role, resource, a)}
                                  />
                                  <span className="text-[9px] uppercase">{a}</span>
                                </label>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    {!isExpanded &&
                      groups.map((g) => (
                        <td key={g.id} className="text-text-muted p-2">
                          ⋯
                        </td>
                      ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
