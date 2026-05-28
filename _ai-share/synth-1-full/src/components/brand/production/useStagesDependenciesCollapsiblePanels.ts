'use client';

import { useEffect, useState } from 'react';
import {
  loadStagesPanelsSession,
  saveStagesPanelsSession,
} from '@/lib/production/stages-panels-session';

export type StagesCollapsiblePanelsState = {
  depsOpen: boolean;
  setDepsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  depsPinned: boolean;
  setDepsPinned: (v: boolean | ((p: boolean) => boolean)) => void;
  depsExpanded: boolean;
  sliceOpen: boolean;
  setSliceOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  slicePinned: boolean;
  setSlicePinned: (v: boolean | ((p: boolean) => boolean)) => void;
  sliceExpanded: boolean;
  boardOpen: boolean;
  setBoardOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  boardPinned: boolean;
  setBoardPinned: (v: boolean | ((p: boolean) => boolean)) => void;
  boardExpanded: boolean;
  matrixOpen: boolean;
  setMatrixOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  matrixPinned: boolean;
  setMatrixPinned: (v: boolean | ((p: boolean) => boolean)) => void;
  matrixExpanded: boolean;
  skuPanelOpen: boolean;
  setSkuPanelOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  skuPanelPinned: boolean;
  setSkuPanelPinned: (v: boolean | ((p: boolean) => boolean)) => void;
  skuPanelExpanded: boolean;
  profilePanelOpen: boolean;
  setProfilePanelOpen: (v: boolean | ((p: boolean) => boolean)) => void;
};

/** Свёрнутость / pin блоков экрана этапов + sessionStorage (как раньше в useStagesDependenciesTabContent). */
export function useStagesDependenciesCollapsiblePanels(
  collectionFlowKey: string
): StagesCollapsiblePanelsState {
  const [depsOpen, setDepsOpen] = useState(true);
  const [depsPinned, setDepsPinned] = useState(true);
  const depsExpanded = depsPinned || depsOpen;

  const [sliceOpen, setSliceOpen] = useState(true);
  const [slicePinned, setSlicePinned] = useState(true);
  const sliceExpanded = slicePinned || sliceOpen;

  const [boardOpen, setBoardOpen] = useState(true);
  const [boardPinned, setBoardPinned] = useState(true);
  const boardExpanded = boardPinned || boardOpen;

  const [matrixOpen, setMatrixOpen] = useState(true);
  const [matrixPinned, setMatrixPinned] = useState(true);
  const matrixExpanded = matrixPinned || matrixOpen;

  const [skuPanelOpen, setSkuPanelOpen] = useState(true);
  const [skuPanelPinned, setSkuPanelPinned] = useState(true);
  const skuPanelExpanded = skuPanelPinned || skuPanelOpen;

  const [profilePanelOpen, setProfilePanelOpen] = useState(false);

  const [panelsHydrated, setPanelsHydrated] = useState(false);

  useEffect(() => {
    const s = loadStagesPanelsSession(collectionFlowKey);
    if (s) {
      if (typeof s.depsPinned === 'boolean') setDepsPinned(s.depsPinned);
      if (typeof s.depsOpen === 'boolean') setDepsOpen(s.depsOpen);
      if (typeof s.slicePinned === 'boolean') setSlicePinned(s.slicePinned);
      if (typeof s.sliceOpen === 'boolean') setSliceOpen(s.sliceOpen);
      if (typeof s.boardPinned === 'boolean') setBoardPinned(s.boardPinned);
      if (typeof s.boardOpen === 'boolean') setBoardOpen(s.boardOpen);
      if (typeof s.matrixPinned === 'boolean') setMatrixPinned(s.matrixPinned);
      if (typeof s.matrixOpen === 'boolean') setMatrixOpen(s.matrixOpen);
      if (typeof s.skuPanelPinned === 'boolean') setSkuPanelPinned(s.skuPanelPinned);
      if (typeof s.skuPanelOpen === 'boolean') setSkuPanelOpen(s.skuPanelOpen);
      if (typeof s.profilePanelOpen === 'boolean') setProfilePanelOpen(s.profilePanelOpen);
    }
    setPanelsHydrated(true);
  }, [collectionFlowKey]);

  useEffect(() => {
    if (!panelsHydrated) return;
    saveStagesPanelsSession(collectionFlowKey, {
      depsPinned,
      depsOpen,
      slicePinned,
      sliceOpen,
      boardPinned,
      boardOpen,
      matrixPinned,
      matrixOpen,
      skuPanelPinned,
      skuPanelOpen,
      profilePanelOpen,
    });
  }, [
    panelsHydrated,
    collectionFlowKey,
    depsPinned,
    depsOpen,
    slicePinned,
    sliceOpen,
    boardPinned,
    boardOpen,
    matrixPinned,
    matrixOpen,
    skuPanelPinned,
    skuPanelOpen,
    profilePanelOpen,
  ]);

  return {
    depsOpen,
    setDepsOpen,
    depsPinned,
    setDepsPinned,
    depsExpanded,
    sliceOpen,
    setSliceOpen,
    slicePinned,
    setSlicePinned,
    sliceExpanded,
    boardOpen,
    setBoardOpen,
    boardPinned,
    setBoardPinned,
    boardExpanded,
    matrixOpen,
    setMatrixOpen,
    matrixPinned,
    setMatrixPinned,
    matrixExpanded,
    skuPanelOpen,
    setSkuPanelOpen,
    skuPanelPinned,
    setSkuPanelPinned,
    skuPanelExpanded,
    profilePanelOpen,
    setProfilePanelOpen,
  };
}
