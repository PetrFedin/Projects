export interface NodeAuthenticationRequest {
  nodeId: string; // ID фабрики, грузовика или IoT-датчика
  nodeType: 'factory_server' | 'autonomous_truck' | 'smart_shelf_iot';
  location: { lat: number; lng: number };
  quantumKeySignature: string; // Сигнатура на основе пост-квантовой криптографии
  requestedAccessLevel: 'read_inventory' | 'write_ledger' | 'execute_payment';
}

export interface SecurityDecision {
  nodeId: string;
  isAuthorized: boolean;
  assignedTrustScore: number; // 0-100 (Zero-Trust Architecture)
  requiredMfa: boolean;
  reasoning: string;
}

/**
 * [Phase 38 — Quantum-Secured Supply Chain Identity (Zero-Trust)]
 * Движок безопасности цепи поставок на базе концепции Zero-Trust (Никому не доверяй).
 * В мире, где грузовики ездят сами, а полки сами заказывают товар,
 * защита от хакеров критична. Модуль проверяет криптографические подписи
 * (с заделом на пост-квантовые алгоритмы) каждого узла перед тем,
 * как разрешить ему списать деньги или изменить остатки в Ledger.
 */
export class ZeroTrustSecurityEngine {
  // Мок базы доверенных узлов и их последних известных локаций
  private static knownNodes = new Map<string, { lastLat: number; lastLng: number; baseTrust: number }>([
    ['truck-01', { lastLat: 40.7128, lastLng: -74.0060, baseTrust: 95 }], // NYC
    ['factory-vn', { lastLat: 21.0285, lastLng: 105.8542, baseTrust: 90 }] // Hanoi
  ]);

  /**
   * Оценивает запрос на доступ от любого узла сети (IoT, сервер, робот).
   */
  public static authenticateNode(request: NodeAuthenticationRequest): SecurityDecision {
    let isAuthorized = false;
    let assignedTrustScore = 50;
    let requiredMfa = true;
    let reasoning = 'Initial Zero-Trust evaluation.';

    // 1. Проверка криптографической сигнатуры (Quantum Key Mock)
    // В реальности здесь проверяется QKD (Quantum Key Distribution) или решетчатая криптография
    if (!request.quantumKeySignature || request.quantumKeySignature.length < 32) {
      return {
        nodeId: request.nodeId,
        isAuthorized: false,
        assignedTrustScore: 0,
        requiredMfa: false,
        reasoning: 'CRITICAL: Invalid or missing quantum-resistant signature. Access denied.'
      };
    }

    // 2. Проверка аномалий геолокации (Impossible Travel)
    const knownNode = this.knownNodes.get(request.nodeId);
    if (knownNode) {
      // Вычисляем примерное расстояние от последней известной точки
      const distance = Math.sqrt(
        Math.pow(knownNode.lastLat - request.location.lat, 2) +
        Math.pow(knownNode.lastLng - request.location.lng, 2)
      );

      // Если грузовик "телепортировался" на 1000 км за секунду — это взлом (GPS Spoofing)
      if (distance > 10 && request.nodeType !== 'factory_server') { // Сервера не двигаются
        assignedTrustScore = 10;
        reasoning = `SECURITY ALERT: Impossible travel detected for node ${request.nodeId}. Distance anomaly: ${distance.toFixed(2)}. Suspected GPS spoofing or node hijacking.`;
        return { nodeId: request.nodeId, isAuthorized: false, assignedTrustScore, requiredMfa: true, reasoning };
      }
      
      assignedTrustScore = knownNode.baseTrust;
    } else {
      // Неизвестный узел (New Device)
      assignedTrustScore = 30;
      reasoning = `Unknown node ${request.nodeId} attempting connection. Trust score set to minimum (30).`;
    }

    // 3. Оценка запрошенного уровня доступа (Least Privilege)
    if (request.requestedAccessLevel === 'execute_payment') {
      // Платежи требуют максимального доверия
      if (assignedTrustScore >= 90) {
        isAuthorized = true;
        requiredMfa = true; // Даже при высоком доверии требуем подтверждения (MFA/Multi-Sig)
        reasoning = `High trust score (${assignedTrustScore}). Payment execution authorized pending Multi-Signature validation.`;
      } else {
        reasoning = `Trust score (${assignedTrustScore}) insufficient for 'execute_payment'. Minimum 90 required.`;
      }
    } else if (request.requestedAccessLevel === 'write_ledger') {
      // Изменение остатков
      if (assignedTrustScore >= 70) {
        isAuthorized = true;
        requiredMfa = false;
        reasoning = `Trust score (${assignedTrustScore}) sufficient for 'write_ledger'. Access granted.`;
      } else {
        reasoning = `Trust score (${assignedTrustScore}) insufficient for 'write_ledger'. Minimum 70 required.`;
      }
    } else {
      // Чтение данных (Read-only)
      isAuthorized = assignedTrustScore >= 30;
      requiredMfa = false;
      reasoning = isAuthorized ? 'Read access granted.' : 'Trust score too low even for read access.';
    }

    return {
      nodeId: request.nodeId,
      isAuthorized,
      assignedTrustScore,
      requiredMfa,
      reasoning
    };
  }
}
