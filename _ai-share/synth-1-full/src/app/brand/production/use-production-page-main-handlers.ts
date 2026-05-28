'use client';

import type { ProductionPageMainPageState } from '@/app/brand/production/use-production-page-main-page-state';

type ToastLike = (args: { title: string; description?: string }) => void;

/** Действия для legacy production hub (раньше — инлайн в `production-page-main`). */
export function useProductionPageMainHandlers(args: {
  toast: ToastLike;
  selectedId: string | null;
  page: ProductionPageMainPageState;
}) {
  const { toast, selectedId, page } = args;

  const handleSendMessage = () => {
    if (!page.newMessage.trim()) return;
    const msg = {
      id: Date.now().toString(),
      sender: 'Вы',
      text: page.newMessage,
      time: 'Just now',
      collection: selectedId || 'General',
      avatar: 'ME',
    };
    page.setChatMessages([...page.chatMessages, msg]);
    page.setNewMessage('');
  };

  const handleToggleSfcConfirmation = (index: number) => {
    const updated = [...page.sfcOperations];
    updated[index].confirmed = !updated[index].confirmed;
    page.setSfcOperations(updated);
  };

  const handleAddMaterial = () => {
    const newMaterial = {
      name: 'Новый рулон ткани',
      roll: `#${Math.floor(Math.random() * 9000) + 1000}`,
      length: '50.0 м',
      width: '150 см',
      defects: 0,
      status: 'Factory',
      collection: selectedId || 'General',
    };
    page.setMaterialsList([newMaterial, ...page.materialsList]);
  };

  const handleAction = (title: string, description: string) => {
    toast({ title, description });
  };

  const handleCollectionCreated = (
    newColl: {
      id: string;
      name: string;
      status: string;
      items: number;
      readiness: string;
      budget: string;
      type: string;
      priority: string;
      deadline: string;
      responsible: string;
      season?: string;
    },
    budget?: { materials: number; sewing: number; logistics: number }
  ) => {
    page.setCollections([newColl as any, ...page.collections]);
    if (budget) {
      const total = budget.materials + budget.sewing + budget.logistics;
      page.setCollectionBudgets((prev) => [
        ...prev,
        {
          collectionId: newColl.id,
          categories: [
            { id: 'materials', label: 'Материалы', plan: budget.materials, fact: 0, unit: '₽' },
            { id: 'sewing', label: 'Пошив', plan: budget.sewing, fact: 0, unit: '₽' },
            { id: 'logistics', label: 'Логистика', plan: budget.logistics, fact: 0, unit: '₽' },
          ],
          totalPlan: total,
          totalFact: 0,
        },
      ]);
    }
    handleAction(
      'Коллекция создана',
      `Проект ${newColl.name} успешно инициализирован. Ответственный: ${newColl.responsible}`
    );
  };

  const handleSkuCreated = (created: {
    id: string;
    name: string;
    collection: string;
    stage?: string;
    sizes?: string[];
    colors?: string[];
    bomItems?: any[];
  }) => {
    const newSku = {
      name: created.name,
      id: created.id,
      ver: '1.0',
      collection: created.collection,
      audienceId: 'unisex',
      catLevel1Id: '',
      catLevel2Id: '',
      catLevel3Id: '',
      attributes: { color: (created.colors || ['Black'])[0] },
      price: '0 ₽',
      status: created.stage || 'Development',
      master: true,
      deadline: '2026-09-01',
      responsible: 'Анна К.',
    };
    page.setSkus([newSku as any, ...page.skus]);
    page.setIsSkuWizardOpen(false);
    handleAction('Артикул создан', `Артикул ${created.name} успешно добавлен.`);
  };

  const handleAddLoss = () => {
    const newLoss = {
      type: 'material',
      item: 'Silk Satin (Defect)',
      collection: selectedId || 'SS26',
      qty: '1.5 м',
      reason: 'Технический брак',
      cost: '4,500 ₽',
      date: 'Today',
      status: 'pending',
      responsible: 'Анна К.',
    };
    page.setProductionLosses([newLoss, ...page.productionLosses]);
    handleAction('Потеря зафиксирована', 'Новый дефект добавлен в реестр для анализа.');
  };

  const getContextTitle = () => {
    if (page.selectedContext === 'brand') return 'Весь бренд';
    if (page.selectedCollectionIds.length > 1)
      return `Выбрано: ${page.selectedCollectionIds.length}`;
    if (page.selectedCollectionIds.length === 1) {
      const coll = page.collections.find((c: any) => c.id === page.selectedCollectionIds[0]);
      return coll ? `Коллекция: ${coll.name}` : 'Дроп';
    }
    return 'Весь бренд';
  };

  const resetToBrand = () => {
    page.setSelectedContext('brand');
    page.setSelectedCollectionIds([]);
  };

  return {
    handleSendMessage,
    handleToggleSfcConfirmation,
    handleAddMaterial,
    handleAction,
    handleCollectionCreated,
    handleSkuCreated,
    handleAddLoss,
    getContextTitle,
    resetToBrand,
  };
}

export type ProductionPageMainHandlersSnapshot = ReturnType<typeof useProductionPageMainHandlers>;
