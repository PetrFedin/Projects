type Listener = () => void;
const listeners = new Set<Listener>();
let label: string | null = null;

export function setWorkshop2ArticleBreadcrumbLabel(next: string | null): void {
  if (label === next) return;
  label = next;
  listeners.forEach((l) => l());
}

export function getWorkshop2ArticleBreadcrumbLabel(): string | null {
  return label;
}

export function subscribeWorkshop2ArticleBreadcrumb(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
