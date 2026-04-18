'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Gamepad2, Share2, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface NftTryOnDialogProps {
  nft: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    imageHint: string;
  };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NftTryOnDialog({ nft, isOpen, onOpenChange }: NftTryOnDialogProps) {
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'avatar-3d');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="grid grid-cols-1 p-0 sm:max-w-4xl md:grid-cols-2">
        <div className="flex flex-col p-4">
          <DialogHeader>
            <Badge variant="outline" className="w-fit">
              Цифровой актив
            </Badge>
            <DialogTitle className="mt-2 text-base font-bold">{nft.name}</DialogTitle>
            <DialogDescription className="text-base">{nft.description}</DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID токена</span>
              <span className="font-mono">#001248</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Контракт</span>
              <span className="font-mono">0x123...aBcD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Сеть</span>
              <span className="font-mono">Base</span>
            </div>
          </div>

          <Separator />

          <div className="mt-auto space-y-3 pt-6">
            <Button size="lg" className="w-full">
              <Sparkles className="mr-2 h-5 w-5" /> Примерить в AR
            </Button>
            <Button size="lg" variant="secondary" className="w-full">
              <Gamepad2 className="mr-2 h-5 w-5" /> Отправить в игру
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              <Share2 className="mr-2 h-5 w-5" /> Поделиться
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center rounded-r-lg bg-secondary/50 p-4">
          {avatarImage && (
            <Image
              src={avatarImage.imageUrl}
              alt="3D Avatar"
              width={500}
              height={800}
              className="object-contain"
              data-ai-hint={avatarImage.imageHint}
            />
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-background/50 p-2 backdrop-blur-sm">
<<<<<<< HEAD
            <Cube className="h-5 w-5 text-muted-foreground" />
=======
            <Box className="h-5 w-5 text-muted-foreground" />
>>>>>>> recover/cabinet-wip-from-stash
            <span className="text-sm font-medium">3D-просмотр</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
