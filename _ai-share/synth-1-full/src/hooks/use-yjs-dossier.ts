import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function useYjsDossier(collectionId: string, articleId: string) {
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(null);
  const [synced, setSynced] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(1);
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    // В реальном приложении здесь будет URL вашего Yjs сервера (например PartyKit)
    // Сейчас используем публичный тестовый сервер или заглушку
    const wsUrl = 'wss://demos.yjs.dev';
    const roomName = `synth-dossier-${collectionId}-${articleId}`;

    const ydoc = new Y.Doc();
    docRef.current = ydoc;

    const provider = new WebsocketProvider(wsUrl, roomName, ydoc);
    providerRef.current = provider;

    const yDossier = ydoc.getMap('dossier');

    provider.on('status', (event: { status: string }) => {
      // connected or disconnected
    });

    provider.on('sync', (isSynced: boolean) => {
      setSynced(isSynced);
      if (isSynced) {
        const data = yDossier.toJSON();
        if (Object.keys(data).length > 0) {
          setDossier(data as Workshop2DossierPhase1);
        }
      }
    });

    provider.awareness.on('change', () => {
      setActiveUsers(provider.awareness.getStates().size);
    });

    yDossier.observeDeep(() => {
      const data = yDossier.toJSON();
      if (Object.keys(data).length > 0) {
        setDossier(data as Workshop2DossierPhase1);
      }
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [collectionId, articleId]);

  const updateDossier = (newDossier: Workshop2DossierPhase1) => {
    if (!docRef.current) return;
    const yDossier = docRef.current.getMap('dossier');

    docRef.current.transact(() => {
      // Простейший merge: перезаписываем ключи на верхнем уровне
      // Для полноценного CRDT нужно использовать Y.Map и Y.Array рекурсивно
      Object.entries(newDossier).forEach(([key, value]) => {
        yDossier.set(key, value);
      });
    });
  };

  return { dossier, updateDossier, synced, activeUsers };
}
