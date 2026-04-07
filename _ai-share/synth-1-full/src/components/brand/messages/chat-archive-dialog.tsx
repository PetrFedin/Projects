
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from '@/lib/types';
import { useMemo } from 'react';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { FileText, Link as LinkIcon, ShoppingBag } from "lucide-react";

interface ChatArchiveDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  messages: ChatMessage[];
}

export function ChatArchiveDialog({ isOpen, onOpenChange, messages }: ChatArchiveDialogProps) {
  
  const files = useMemo(() => messages.filter(m => m.attachment?.type === 'file'), [messages]);
  const links = useMemo(() => messages.filter(m => m.attachment?.type === 'link'), [messages]);
  const products = useMemo(() => messages.filter(m => m.attachedProduct), [messages]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Архив чата</DialogTitle>
          <DialogDescription>Все файлы, ссылки и товары, которыми делились в этом чате.</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="products" className="flex-1 min-h-0 flex flex-col">
          <TabsList>
            <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4" />Товары ({products.length})</TabsTrigger>
            <TabsTrigger value="files"><FileText className="mr-2 h-4 w-4" />Файлы ({files.length})</TabsTrigger>
            <TabsTrigger value="links"><LinkIcon className="mr-2 h-4 w-4" />Ссылки ({links.length})</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="products">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map(msg => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <Image src={msg.attachedProduct!.images[0].url} alt={msg.attachedProduct!.name} width={32} height={40} className="rounded-sm object-cover" />
                            <p className="font-semibold">{msg.attachedProduct!.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{msg.user}</TableCell>
                      <TableCell>{msg.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="files">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Файл</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map(msg => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Link href={msg.attachment!.url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2">
                           <FileText className="h-4 w-4" />
                           {msg.attachment!.name}
                           <span className="text-muted-foreground text-xs">({msg.attachment!.size})</span>
                        </Link>
                      </TableCell>
                      <TableCell>{msg.user}</TableCell>
                      <TableCell>{msg.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="links">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ссылка</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map(msg => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Link href={msg.attachment!.url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2">
                           <LinkIcon className="h-4 w-4" />
                           {msg.attachment!.name}
                        </Link>
                      </TableCell>
                      <TableCell>{msg.user}</TableCell>
                      <TableCell>{msg.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="pt-4 mt-auto">
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
