import { useSyncExternalStore } from 'react';
import { PRODUCTS, Product } from '../data/products';

export const DEFAULT_CATEGORIES = ['Camisetas', 'Moletons', 'Calças', 'Acessórios'];

const KEY_PRODUCTS = 'cia4w_catalog_products';
const KEY_CATEGORIES = 'cia4w_catalog_categories';

export interface CatalogSnapshot {
  products: Product[];
  categories: string[];
}

let cache: CatalogSnapshot | null = null;
const listeners = new Set<() => void>();

function readStorage(): CatalogSnapshot {
  try {
    const p = localStorage.getItem(KEY_PRODUCTS);
    const c = localStorage.getItem(KEY_CATEGORIES);
    return {
      products: p ? (JSON.parse(p) as Product[]) : PRODUCTS,
      categories: c ? (JSON.parse(c) as string[]) : DEFAULT_CATEGORIES,
    };
  } catch {
    return { products: PRODUCTS, categories: DEFAULT_CATEGORIES };
  }
}

export function getCatalog(): CatalogSnapshot {
  if (!cache) cache = readStorage();
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Salva o catálogo inteiro. Retorna false se o armazenamento estiver cheio. */
export function saveCatalog(snapshot: CatalogSnapshot): boolean {
  try {
    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(snapshot.products));
    localStorage.setItem(KEY_CATEGORIES, JSON.stringify(snapshot.categories));
    cache = snapshot;
    emit();
    return true;
  } catch {
    return false;
  }
}

export function resetCatalog() {
  try {
    localStorage.removeItem(KEY_PRODUCTS);
    localStorage.removeItem(KEY_CATEGORIES);
  } catch {
    // ignore
  }
  cache = null;
  emit();
}

export function exportCatalog(): string {
  return JSON.stringify(getCatalog(), null, 2);
}

export function importCatalog(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data.products) || !Array.isArray(data.categories)) return false;
    return saveCatalog({ products: data.products, categories: data.categories });
  } catch {
    return false;
  }
}

export const isVisible = (p: Product) => p.visible !== false;

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY_PRODUCTS || e.key === KEY_CATEGORIES) {
      cache = null;
      emit();
    }
  });
}

export function useCatalog(): CatalogSnapshot {
  return useSyncExternalStore(subscribeCatalog, getCatalog, getCatalog);
}
