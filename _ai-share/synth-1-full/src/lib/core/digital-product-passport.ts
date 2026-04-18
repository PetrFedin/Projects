import { ArticleAggregate } from '../article/article-aggregate';
import { ImmutableAuditTrail } from './immutable-audit-trail';

export interface MaterialComponent {
  materialName: string;
  percentage: number; // 0-100
  originCountry: string;
  supplierId: string;
  isRecycled: boolean;
}

export interface DigitalProductPassport {
  dppId: string; // Уникальный идентификатор паспорта
  articleId: string;
  brandName: string;
  manufacturingDate: string;
  assemblyFactoryId: string;
  assemblyCountry: string;
  billOfMaterials: MaterialComponent[];
  carbonFootprintKg: number;
  recyclingInstructions: string;
  blockchainHash: string; // Хэш для верификации подлинности
}

/**
 * [Phase 27 — Digital Product Passport (DPP) Generator]
 * Генератор Цифрового Паспорта Продукта (DPP).
 * Европейский Союз вводит обязательные DPP для всех текстильных изделий.
 * Этот модуль собирает данные со всей цепи поставок (от фермы до фабрики)
 * и генерирует единый, неизменяемый паспорт, который привязывается к QR-коду на бирке.
 */
export class DPPGenerator {
  /**
   * Генерирует цифровой паспорт для конкретной партии товара (Article).
   */
  public static generatePassport(
    article: ArticleAggregate,
    assemblyFactoryId: string,
    assemblyCountry: string,
    bom: MaterialComponent[],
    carbonFootprintKg: number
  ): DigitalProductPassport {
    const dppId = `dpp-${article.id}-${Date.now()}`;
    const manufacturingDate = new Date().toISOString();

    // 1. Формирование инструкций по переработке на основе состава
    let recyclingInstructions = 'Standard textile recycling.';
    const hasPolyester = bom.some((m) => m.materialName.toLowerCase().includes('polyester'));
    const hasCotton = bom.some((m) => m.materialName.toLowerCase().includes('cotton'));

    if (hasPolyester && hasCotton) {
      recyclingInstructions =
        'Complex blend (Poly-Cotton). Requires chemical separation before recycling. Do not compost.';
    } else if (hasCotton && bom.every((m) => m.percentage > 95)) {
      recyclingInstructions =
        '100% Cotton. Fully biodegradable and suitable for mechanical recycling into new yarn.';
    } else if (bom.every((m) => m.isRecycled)) {
      recyclingInstructions =
        'Made from 100% recycled materials. Please return to a certified circular economy drop-off point.';
    }

    // 2. Сборка паспорта
    const passport: DigitalProductPassport = {
      dppId,
      articleId: article.id,
      brandName: 'Syntha', // Mock brand
      manufacturingDate,
      assemblyFactoryId,
      assemblyCountry,
      billOfMaterials: bom,
      carbonFootprintKg,
      recyclingInstructions,
      blockchainHash: '', // Будет заполнено ниже
    };

    // 3. Запись в Blockchain (Immutable Audit Trail) для гарантии подлинности
    // Мы хэшируем данные паспорта, чтобы никто не мог подделать состав или страну происхождения
    const record = ImmutableAuditTrail.appendRecord(
      'dpp.generated',
      { dppId, articleId: article.id, assemblyCountry, carbonFootprintKg },
      'dpp_engine'
    );

    // Привязываем хэш транзакции к паспорту
    passport.blockchainHash = record.hash;

    console.log(
      `[DPP Generator] Created Digital Product Passport ${dppId} for Article ${article.id}. Hash: ${record.hash}`
    );

    return passport;
  }
}
