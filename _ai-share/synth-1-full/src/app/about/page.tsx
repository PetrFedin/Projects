<<<<<<< HEAD
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-4 text-center">
=======
import { cn } from '@/lib/utils';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

export default function AboutPage() {
  return (
    <div className={cn(registryFeedLayout.pageShell, 'text-center')}>
>>>>>>> recover/cabinet-wip-from-stash
      <h1 className="font-headline text-sm font-bold">О нас</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
        Syntha - это платформа, которая объединяет моду и технологии, чтобы помочь вам выразить свою
        индивидуальность.
      </p>
    </div>
  );
}
