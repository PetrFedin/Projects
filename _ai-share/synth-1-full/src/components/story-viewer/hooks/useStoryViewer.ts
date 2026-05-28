'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { ImagePlaceholder, Product } from '@/lib/types';

export function useStoryViewer(
  story: ImagePlaceholder,
  products: Product[] = [],
  mode: 'products' | 'gallery' | 'simple' | 'invitation' = 'products',
  isLiveNow: boolean = false,
  onNext?: () => void
) {
  const [showProducts, setShowProducts] = useState(mode !== 'simple');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(124);
  const [progress, setProgress] = useState(0);
  const [isBuyLookOpen, setIsBuyLookOpen] = useState(false);
  const [isLookOrdered, setIsLookOrdered] = useState(false);
  const [isContactStepOpen, setIsContactStepOpen] = useState(false);
  const [isLivePlayerOpenFromStory, setIsLivePlayerOpenFromStory] = useState(false);
  const [lookSelections, setLookSelections] = useState<
    Record<string, Array<{ colorId: string; size: string; qty: number }>>
  >({});
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [tempContactValue, setTempContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState('telegram');
  const [contactTime, setContactTime] = useState('asap');
  const [selectedContactDate, setSelectedContactDate] = useState<Date | undefined>(new Date());
  const [selectedContactTimeStr, setSelectedContactTimeStr] = useState(format(new Date(), 'HH:mm'));
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [userProfile, setUserProfile] = useState({
    telegram: '@user_synth',
    phone: '+7 (999) 123-45-67',
    whatsapp: '+7 (999) 123-45-67',
  });

  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onNext?.();
      setProgress(0);
    }
  }, [progress, onNext]);

  useEffect(() => {
    setShowProducts(mode !== 'simple' && !isLiveNow && mode !== 'invitation');
    setProgress(0);
  }, [story.id, mode, isLiveNow]);

  const updateLookSelection = (productId: string, colorId: string, size: string, delta: number) => {
    setLookSelections((prev) => {
      const current = [...(prev[productId] || [])];
      const idx = current.findIndex((item) => item.colorId === colorId && item.size === size);
      if (idx >= 0) {
        const newQty = current[idx].qty + delta;
        if (newQty <= 0) current.splice(idx, 1);
        else current[idx] = { ...current[idx], qty: newQty };
      } else if (delta > 0) {
        current.push({ colorId, size, qty: delta });
      }
      return { ...prev, [productId]: current };
    });
  };

  const totalLookSum = Object.entries(lookSelections).reduce((acc, [productId, selections]) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.availability === 'pre_order') return acc;
    return acc + product.price * selections.reduce((sum, s) => sum + s.qty, 0);
  }, 0);

  const isAnyPreOrderInSelection = Object.keys(lookSelections).some((id) => {
    const p = products.find((prod) => prod.id === id);
    return p?.availability === 'pre_order' || p?.id === '1' || p?.id === '3';
  });

  const lookPriceLabel = isAnyPreOrderInSelection
    ? 'Купить весь образ'
    : totalLookSum > 0
      ? `${totalLookSum.toLocaleString('ru-RU')} ₽`
      : 'Купить весь образ';

  return {
    showProducts,
    setShowProducts,
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    progress,
    setProgress,
    isBuyLookOpen,
    setIsBuyLookOpen,
    isLookOrdered,
    setIsLookOrdered,
    isContactStepOpen,
    setIsContactStepOpen,
    isLivePlayerOpenFromStory,
    setIsLivePlayerOpenFromStory,
    lookSelections,
    updateLookSelection,
    editingContactId,
    setEditingContactId,
    tempContactValue,
    setTempContactValue,
    contactMethod,
    setContactMethod,
    contactTime,
    setContactTime,
    selectedContactDate,
    setSelectedContactDate,
    selectedContactTimeStr,
    setSelectedContactTimeStr,
    currentGalleryIdx,
    setCurrentGalleryIdx,
    userProfile,
    setUserProfile,
    lookPriceLabel,
    isAnyPreOrderInSelection,
  };
}
