import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../firebase/config';
import { B2BActivityLog, B2BNegotiation, B2BConnection } from '../types/b2b';

/**
 * B2B Repository
 * Абстракция над Firestore для работы с B2B данными.
 */
export class B2BRepository {
  private static ACTIVITIES_COL = 'b2b_activities';
  private static NEGOTIATIONS_COL = 'b2b_negotiations';
  private static CONNECTIONS_COL = 'b2b_connections';

  /**
   * Логирование активности
   */
  static async logActivity(log: Omit<B2BActivityLog, 'id' | 'timestamp'>) {
    if (!isFirebaseEnabled) {
      console.log('[MOCK_B2B] Log activity:', log);
      return;
    }
    const colRef = collection(db, this.ACTIVITIES_COL);
    await addDoc(colRef, {
      ...log,
      timestamp: Timestamp.now(),
    });
  }

  /**
   * Подписка на активности организации
   */
  static subscribeToActivities(orgId: string, callback: (logs: B2BActivityLog[]) => void) {
    if (!isFirebaseEnabled) {
      // Mock sub
      callback([]);
      return () => {};
    }
    const q = query(collection(db, this.ACTIVITIES_COL), where('actor.id', '==', orgId));

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString(),
      })) as B2BActivityLog[];
      callback(logs);
    });
  }

  /**
   * Сохранение/обновление переговоров по заказу
   */
  static async saveNegotiation(negotiation: B2BNegotiation) {
    if (!isFirebaseEnabled) {
      console.log('[MOCK_B2B] Save negotiation:', negotiation);
      return;
    }
    const docRef = doc(db, this.NEGOTIATIONS_COL, negotiation.orderId);
    await setDoc(
      docRef,
      {
        ...negotiation,
        lastUpdate: Timestamp.now(),
      },
      { merge: true }
    );
  }

  /**
   * Получение переговоров
   */
  static subscribeToNegotiations(
    orgId: string,
    isBrand: boolean,
    callback: (data: B2BNegotiation[]) => void
  ) {
    if (!isFirebaseEnabled) {
      // Mock sub
      callback([]);
      return () => {};
    }
    const field = isBrand ? 'brandId' : 'retailerId';
    const q = query(collection(db, this.NEGOTIATIONS_COL), where(field, '==', orgId));

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        lastUpdate: (doc.data().lastUpdate as Timestamp).toDate().toISOString(),
      })) as B2BNegotiation[];
      callback(data);
    });
  }
}
