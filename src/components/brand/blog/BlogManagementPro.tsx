"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTablePro } from "@/components/data/DataTable/DataTablePro";
import type { DataTableColumn } from "@/components/data/DataTable/types";
import { useQueryState } from "@/hooks/useQueryState";
import { fmtNumber, fmtPercent } from "@/lib/format";
import { FileText, ImageIcon, TrendingUp, MoreHorizontal, Edit, Trash2 } from "lucide-react";

type PostRow = {
  id: string;
  title: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
  views: number;
  engagement: number;
  author: string;
};

const DEFAULT_POST_FILTERS = {
  q: "",
  page: 1,
  pageSize: 10,
  sortBy: "date",
  sortDir: "desc" as const,
};

export default function BlogManagementPro() {
  const [query, setQuery] = useQueryState(DEFAULT_POST_FILTERS);

  // Mock data - in real app, this would come from an API based on query
  const posts: PostRow[] = [
    { id: "1", title: "Наша новая осенняя коллекция", date: "2025-10-25", status: "Published", views: 12500, engagement: 0.082, author: "Alex Reed" },
    { id: "2", title: "За кулисами: как создавался кашемировый свитер", date: "2025-10-20", status: "Draft", views: 0, engagement: 0, author: "Alex Reed" },
    { id: "3", title: "Тренды зимы 2026: что носить", date: "2025-10-15", status: "Published", views: 8400, engagement: 0.054, author: "Maria S." },
  ];

  const columns: DataTableColumn<PostRow>[] = [
    {
      header: "Название",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{row.original.title}</span>
          <span className="text-xs text-text-muted">{row.original.author}</span>
        </div>
      )
    },
    {
      header: "Дата",
      accessorKey: "date",
      cell: ({ getValue }) => <span className="text-text-secondary">{getValue() as string}</span>
    },
    {
      header: "Статус",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const s = getValue() as PostRow["status"];
        const tone = s === "Published" ? "success" : s === "Draft" ? "warning" : "neutral";
        return <Badge tone={tone}>{s}</Badge>;
      }
    },
    {
      header: "Просмотры",
      accessorKey: "views",
      cell: ({ getValue }) => <span className="tabular-nums">{fmtNumber(getValue() as number)}</span>
    },
    {
      header: "Вовлеченность",
      accessorKey: "engagement",
      cell: ({ getValue }) => <span className="tabular-nums">{fmtPercent(getValue() as number)}</span>
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
           <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
           <Button variant="ghost" className="h-8 w-8 p-0 text-state-error hover:bg-state-error/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Всего просмотров" value="42,500" trend={{ value: "+12%", tone: "up" }} />
        <StatCard label="Средняя вовлеченность" value="6.8%" trend={{ value: "+0.5%", tone: "up" }} />
        <StatCard label="Новых подписчиков" value="1,240" trend={{ value: "+24%", tone: "up" }} />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Новая публикация</h2>
        </div>
        <div className="space-y-4">
          <Input placeholder="Заголовок статьи" className="text-lg h-12" />
          <textarea
            placeholder="Начните писать вашу историю здесь..."
            rows={6}
            className="w-full rounded-md border border-border-default bg-bg-surface p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:shadow-focus"
          />
          <div className="flex gap-4 items-center">
            <Button variant="secondary">
              <ImageIcon className="mr-2 h-4 w-4" />
              Добавить обложку
            </Button>
            <Button variant="secondary">
              <FileText className="mr-2 h-4 w-4" />
              Прикрепить лукбук
            </Button>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button>Опубликовать</Button>
          <Button variant="secondary">Сохранить как черновик</Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Управление контентом</h2>
            <Button variant="secondary">
                <TrendingUp className="mr-2 h-4 w-4" />
                Аналитика блога
            </Button>
        </div>

        <DataTablePro<PostRow>
          columns={columns}
          query={query}
          result={{ rows: posts, total: posts.length }}
          onQueryChange={setQuery}
          rowId={(r) => r.id}
          bulkActions={[
            { label: "Publish Selected", onClick: (ids) => console.log("publish", ids), tone: "primary" },
            { label: "Archive Selected", onClick: (ids) => console.log("archive", ids), tone: "secondary" },
            { label: "Delete Selected", onClick: (ids) => console.log("delete", ids), tone: "danger" },
          ]}
        />
      </div>
    </div>
  );
}



