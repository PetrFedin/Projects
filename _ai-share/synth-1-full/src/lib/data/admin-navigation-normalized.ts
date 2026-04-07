'use client';

import {
    Store, Settings, LayoutDashboard, Activity, Shield, Users, 
    BookText, ListChecks, Ruler, Palette, DollarSign, Megaphone, 
    Sigma, MessageSquare, Calendar, Gavel, TrendingUp, FileText, Globe, BarChart2
} from 'lucide-react';

/**
 * Normalized Admin Cabinet Navigation Structure
 * Clear separation by functional areas
 */

export const adminNavGroups = [
    {
        id: 'overview',
        label: 'Контроль',
        icon: LayoutDashboard,
        links: [
            { 
                href: '/admin', 
                value: 'dashboard', 
                label: 'Дашборд HQ', 
                icon: LayoutDashboard,
                description: 'Главная панель управления платформой'
            },
            { 
                href: '/admin/activity', 
                value: 'activity', 
                label: 'Логи активности', 
                icon: Activity,
                description: 'Мониторинг всех действий на платформе'
            },
            { 
                href: '/admin/audit', 
                value: 'audit', 
                label: 'Audit Trail Ledger', 
                icon: FileText,
                description: 'Неизменяемый лог всех действий в системе'
            },
            { 
                href: '/admin/production/dossier-metrics', 
                value: 'dossier-metrics', 
                label: 'Метрики досье ТЗ', 
                icon: BarChart2,
                description: 'Workshop2: сессии, вехи контура, команды (Upstash/файл)'
            },
            { 
                href: '/admin/production/dossier-metrics/ops', 
                value: 'dossier-metrics-ops', 
                label: 'Операции · воронка W2', 
                icon: TrendingUp,
                description: 'Алерты, дневная воронка вех, ссылка на архив cron'
            },
        ]
    },
    {
        id: 'users',
        label: 'Пользователи и организации',
        icon: Users,
        links: [
            { 
                href: '/admin/users', 
                value: 'users', 
                label: 'Пользователи', 
                icon: Users,
                description: 'Управление пользователями платформы',
                subsections: [
                    { href: '/admin/users', label: 'Все пользователи', value: 'all' },
                    { href: '/admin/users?role=brand', label: 'Бренды', value: 'brands' },
                    { href: '/admin/users?role=shop', label: 'Ритейлеры', value: 'shops' },
                    { href: '/admin/users?role=client', label: 'Клиенты', value: 'clients' }
                ]
            },
            { 
                href: '/admin/brands', 
                value: 'brands', 
                label: 'Бренды и компании', 
                icon: Store,
                description: 'Управление брендами на платформе',
                subsections: [
                    { href: '/admin/brands', label: 'Все бренды', value: 'all' },
                    { href: '/admin/brands?status=active', label: 'Активные', value: 'active' },
                    { href: '/admin/brands?status=pending', label: 'На модерации', value: 'pending' },
                    { href: '/admin/brands?status=suspended', label: 'Приостановленные', value: 'suspended' }
                ]
            },
            { 
                href: '/admin/staff', 
                value: 'staff', 
                label: 'Команда HQ', 
                icon: Shield,
                description: 'Администраторы и модераторы'
            },
            { 
                href: '/admin/appeals', 
                value: 'appeals', 
                label: 'Апелляции', 
                icon: Gavel,
                description: 'Рассмотрение жалоб и споров'
            },
        ]
    },
    {
        id: 'catalog',
        label: 'Каталог и справочники',
        icon: BookText,
        links: [
            { href: '/project-info/categories', value: 'categories', label: 'Категории', icon: BookText, description: 'Дерево категорий товаров' },
            { href: '/project-info/attributes', value: 'attribute-ref', label: 'Справочник атрибутов', icon: ListChecks, description: 'Значения атрибутов' },
            { href: '/project-info/sizes', value: 'sizes', label: 'Размерные сетки', icon: Ruler, description: 'Управление размерами' },
            { href: '/project-info/colors', value: 'colors', label: 'Палитра цветов', icon: Palette, description: 'Цветовые справочники' },
        ]
    },
    {
        id: 'commerce',
        label: 'Коммерция и транзакции',
        icon: DollarSign,
        links: [
            { 
                href: '/admin/billing', 
                value: 'billing', 
                label: 'Биллинг', 
                icon: DollarSign,
                description: 'Управление платежами и подписками',
                subsections: [
                    { href: '/admin/billing', label: 'Обзор', value: 'overview' },
                    { href: '/admin/billing?view=subscriptions', label: 'Подписки', value: 'subscriptions' },
                    { href: '/admin/billing?view=transactions', label: 'Транзакции', value: 'transactions' },
                    { href: '/admin/billing?view=invoices', label: 'Счета', value: 'invoices' }
                ]
            },
            { 
                href: '/admin/bpi-matrix', 
                value: 'bpi-matrix', 
                label: 'Матрица BPI', 
                icon: Sigma,
                description: 'Индекс эффективности брендов'
            },
        ]
    },
    {
        id: 'marketing',
        label: 'Маркетинг',
        icon: Megaphone,
        links: [
            { 
                href: '/admin/promotions', 
                value: 'promotions', 
                label: 'Акции и промо', 
                icon: Megaphone,
                description: 'Управление промо-кампаниями',
                subsections: [
                    { href: '/admin/promotions', label: 'Все акции', value: 'all' },
                    { href: '/admin/promotions?status=active', label: 'Активные', value: 'active' },
                    { href: '/admin/promotions/calendar', label: 'Календарь', value: 'calendar' }
                ]
            },
        ]
    },
    {
        id: 'content',
        label: 'Контент и модерация',
        icon: FileText,
        links: [
            { 
                href: '/admin/home', 
                value: 'home', 
                label: 'Главная страница', 
                icon: Globe,
                description: 'Управление контентом главной'
            },
            { 
                href: '/admin/quality', 
                value: 'quality', 
                label: 'Контроль качества', 
                icon: Shield,
                description: 'Модерация контента и товаров'
            },
            { 
                href: '/admin/auctions', 
                value: 'auctions', 
                label: 'Аукционы', 
                icon: Gavel,
                description: 'Управление аукционами'
            },
        ]
    },
    {
        id: 'communication',
        label: 'Коммуникации',
        icon: MessageSquare,
        links: [
            { 
                href: '/admin/messages', 
                value: 'messages', 
                label: 'Сообщения', 
                icon: MessageSquare,
                description: 'Внутренние сообщения'
            },
            { 
                href: '/admin/calendar', 
                value: 'calendar', 
                label: 'Календарь', 
                icon: Calendar,
                description: 'События и дедлайны платформы'
            },
        ]
    },
    {
        id: 'settings',
        label: 'Система',
        icon: Settings,
        links: [
            { 
                href: '/admin/settings', 
                value: 'settings', 
                label: 'Настройки OS', 
                icon: Settings,
                description: 'Глобальные настройки платформы',
                subsections: [
                    { href: '/admin/settings', label: 'Общие', value: 'general' },
                    { href: '/admin/settings?tab=integrations', label: 'Интеграции', value: 'integrations' },
                    { href: '/admin/settings?tab=security', label: 'Безопасность', value: 'security' },
                    { href: '/admin/settings?tab=notifications', label: 'Уведомления', value: 'notifications' }
                ]
            },
        ]
    }
];

export const allAdminLinks = adminNavGroups.flatMap(g => g.links);

// Helper functions
export function findAdminSubsection(sectionValue: string, subsectionValue: string) {
    const section = allAdminLinks.find(link => link.value === sectionValue);
    return section?.subsections?.find(sub => sub.value === subsectionValue);
}

export function getAdminSubsections(sectionValue: string) {
    const section = allAdminLinks.find(link => link.value === sectionValue);
    return section?.subsections || [];
}
