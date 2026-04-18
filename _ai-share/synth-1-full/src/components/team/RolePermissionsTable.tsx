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
    <Card className="overflow-hidden rounded-xl border-slate-200">
      <CardContent className="p-0">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Роли × разделы. Переключатели — для настройки (пока не применяются к навигации).
          </p>
        </div>
        <div className="max-h-[60vh] overflow-x-auto overflow-y-auto">
          <table className="w-full text-[10px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white">
              <tr>
                <th className="w-32 p-3 text-left font-black uppercase tracking-wider text-slate-600">
                  Роль
                </th>
                {groups.map((g) => (
                  <th
                    key={g.id}
                    className="min-w-[140px] p-2 text-left font-bold uppercase text-slate-500"
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th />
                {groups.map((g) => (
                  <th key={g.id} className="p-2 text-[8px] font-bold uppercase text-slate-400">
                    view · edit · delete
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => {
                const isExpanded = expandedRoles.has(role);
                return (
                  <tr key={role} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-2">
                      <button
                        onClick={() => toggleRole(role)}
                        className="flex items-center gap-2 font-bold uppercase text-slate-700 hover:text-indigo-600"
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
                        <td key={g.id} className="p-2 text-slate-300">
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
