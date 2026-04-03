from typing import Dict, List, Any, Optional, Protocol
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User
from app.services.collaboration_service import CollaborationService
from app.core.logging import logger
from datetime import datetime

class RuleAction(Protocol):
    async def execute(self, db: AsyncSession, context: Dict[str, Any]) -> None:
        ...

class CreateTaskAction:
    def __init__(self, title: str, assignee_role: str = "brand_admin"):
        self.title = title
        self.assignee_role = assignee_role

    async def execute(self, db: AsyncSession, current_user: User, context: Dict[str, Any]) -> None:
        collab_service = CollaborationService(db, current_user)
        await collab_service.create_task({
            "title": f"AUTO: {self.title}",
            "description": f"Automated task triggered by event in {context.get('module')}. Context ID: {context.get('id') or context.get('batch_id') or context.get('sku_id')}",
            "priority": "high",
            "context_type": context.get("module"),
            "context_id": str(context.get("id") or context.get("batch_id") or context.get("sku_id"))
        })
        logger.info(f"AI Rule Engine: Created task '{self.title}' for user {current_user.id}")

class AnalyzeSupplyChainRiskAction:
    async def execute(self, db: AsyncSession, current_user: User, context: Dict[str, Any]) -> None:
        from app.services.supply_chain_service import SupplyChainService
        service = SupplyChainService(db, current_user)
        batch_id = context.get("batch_id")
        if batch_id:
            await service.analyze_batch_risk(batch_id)
            logger.info(f"AI Rule Engine: Triggered AI Risk Analysis for batch {batch_id}")

class EvaluateSmartContractAction:
    async def execute(self, db: AsyncSession, current_user: User, context: Dict[str, Any]) -> None:
        from app.services.smart_contract_service import SmartContractService
        # Note: We need the event name here, but the Protocol doesn't pass it.
        # For now, we'll assume the service knows how to handle the context.
        # In a real system, we'd pass the event name to the action.
        service = SmartContractService(db, current_user)
        # We use a special key in context or just pass the whole thing
        event_name = context.get("__event_name__")
        if event_name:
            await service.evaluate_and_execute(event_name, context)
            logger.info(f"AI Rule Engine: Evaluated smart contracts for event {event_name}")

class AIRuleEngine:
    """
    Advanced AI Rule Engine for cross-module horizontal integration.
    Connects events in one module to actions in another (e.g., Production -> Collaboration).
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def trigger_event(self, event_name: str, context: Dict[str, Any]):
        """
        Main entry point for triggering system-wide events.
        """
        logger.info(f"AI Rule Engine: Processing event '{event_name}' with context {context}")
        
        # Inject event name for actions that need it
        context["__event_name__"] = event_name
        
        # In a real system, these would be loaded from a DB or AI-generated
        rules = self._get_rules_for_event(event_name)
        
        for rule in rules:
            if self._check_conditions(rule, context):
                for action in rule["actions"]:
                    await action.execute(self.db, self.current_user, context)

    def _get_rules_for_event(self, event_name: str) -> List[Dict[str, Any]]:
        # Mocking rules for now. In production, these are dynamic.
        all_rules = {
            "production.material_order_created": [
                {
                    "conditions": {"status": "ordered"},
                    "actions": [CreateTaskAction("Проверить спецификации нового заказа материалов")]
                }
            ],
            "production.sample_fit_failed": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Назначить встречу по исправлению дефектов образца")]
                }
            ],
            "collection.drop_delayed": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Пересчитать маркетинговый бюджет для задержанного дропа")]
                }
            ],
            "collection.drop_created": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Настроить план пополнения стока для нового дропа")]
                }
            ],
            "compliance.eac_registered": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Проверить корректность маркировки (КИЗ) для нового сертификата")]
                }
            ],
            "compliance.edo_signed": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Архивировать подписанный УПД в реестре бухгалтерии")]
                }
            ],
            "fintech.invoice_created": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Подтвердить оплату счета в системе банковского контроля")]
                }
            ],
            "esg.high_carbon_alert": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Начать аудит цепочки поставок из-за превышения углеродного следа")]
                }
            ],
            "intelligence.competitor_launch": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Провести сравнительный анализ новой функции конкурента")]
                }
            ],
            "loyalty.points_added": [
                {
                    "conditions": {"reason": "sustainability_action"},
                    "actions": [CreateTaskAction("Отправить email-благодарность клиенту за вклад в экологию")]
                }
            ],
            "retail.transaction_completed": [
                {
                    "conditions": {},
                    "actions": [
                        CreateTaskAction("Проверить остатки товаров после крупной продажи"),
                        EvaluateSmartContractAction()
                    ]
                }
            ],
            "factory.batch_started": [
                {
                    "conditions": {},
                    "actions": [
                        CreateTaskAction("Обновить GANTT график производства для нового батча"),
                        AnalyzeSupplyChainRiskAction()
                    ]
                }
            ],
            "client.body_scan_completed": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Подготовить AI-подборку размеров для нового сканирования пользователя")]
                }
            ],
            "client.wardrobe_updated": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Рассчитать ESG-след личного гардероба пользователя")]
                }
            ],
            "distributor.low_performance_alert": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Пересмотреть план маркетинга для региона с низкими продажами")]
                }
            ],
            "distributor.quota_allocated": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Сформировать черновик логистической накладной для дилера")]
                }
            ],
            "admin.dispute_opened": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Провести первичную проверку жалобы в Dispute Center")]
                }
            ],
            "admin.announcement_published": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Подготовить отчет о вовлеченности пользователей после объявления")]
                }
            ],
            "analytics.high_demand_forecast": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Забронировать производственные мощности для SKU с высоким ожидаемым спросом")]
                },
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Рассчитать оптимальную размерную сетку для региона с высоким спросом")]
                }
            ],
            "analytics.size_curve_calculated": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Обновить техзадание (Tech Pack) спецификацией размерной сетки")]
                }
            ],
            "logistics.packing_list_created": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Назначить слот на отгрузку со склада для нового упаковочного листа")]
                }
            ],
            "logistics.customs_ready": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Перевести оплату таможенных пошлин для разблокировки груза")]
                }
            ],
            "pricing.significant_change": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Уведомить дилеров о значительном изменении цены на SKU")]
                }
            ],
            "vmi.low_stock_detected": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Сформировать черновик заказа (Draft Order) для авто-пополнения ритейлера")]
                }
            ],
            "showroom.visitor_detected": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Провести фоллоу-ап по итогам визита в цифровой шоурум")]
                }
            ],
            "showroom.created": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Подготовить 3D-контент и лукбук для нового шоурума")]
                }
            ],
            "supply_chain.high_risk_detected": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Провести аудит альтернативных поставщиков из-за высокого риска срыва поставок")]
                }
            ],
            "expansion.entry_initiated": [
                {
                    "conditions": {},
                    "actions": [
                        CreateTaskAction("Проверить локальное налоговое соответствие (VAT/GST) для нового рынка"),
                        CreateTaskAction("Сформировать HS-код спецификацию для таможни в новом регионе")
                    ]
                }
            ],
            "staff.shift_swap_requested": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Проверить влияние смены сотрудника на KPI магазина перед одобрением")]
                }
            ],
            "staff.salary_advance_requested": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Оценить финансовый риск выдачи аванса сотруднику")]
                }
            ],
            "marketing.campaign_generated": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Утвердить медиа-план и бюджет для новой маркетинговой кампании")]
                }
            ],
            "marketing.content_ready": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Одобрить AI-сгенерированный контент для публикации")]
                }
            ],
            "compliance.sanction_hit": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("СРОЧНО: Заблокировать транзакцию и провести ручную проверку санкционного совпадения")]
                }
            ],
            "compliance.tax_report_ready": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Утвердить налоговый отчет для подачи в налоговые органы")]
                }
            ],
            "factory.batch_completed": [
                {
                    "conditions": {},
                    "actions": [
                        CreateTaskAction("Запустить генерацию Digital Product Passport (DPP) для завершенной партии"),
                        EvaluateSmartContractAction()
                    ]
                }
            ],
            "factory.milestone_delayed": [
                {
                    "conditions": {},
                    "actions": [
                        CreateTaskAction("Проверить влияние задержки на отгрузку и применить штрафные санкции к фабрике"),
                        EvaluateSmartContractAction()
                    ]
                }
            ],
            "esg.metric_recorded": [
                {
                    "conditions": {"category": "recyclability"},
                    "actions": [CreateTaskAction("Обновить данные об экологичности в реестре DPP для затронутых SKU")]
                }
            ],
            "academy.certification_passed": [
                {
                    "conditions": {},
                    "actions": [CreateTaskAction("Обновить уровень доступа сотрудника после прохождения курса")]
                }
            ]
        }
        return all_rules.get(event_name, [])

    def _check_conditions(self, rule: Dict[str, Any], context: Dict[str, Any]) -> bool:
        conditions = rule.get("conditions", {})
        for key, value in conditions.items():
            if context.get(key) != value:
                return False
        return True
