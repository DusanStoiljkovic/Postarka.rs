"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type CartItem = {
  productId: number;
  slug: string;
  kind: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stockCap: number | null;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "postarka:cart";
const EMPTY_CART: CartItem[] = [];

// Minimal external store so the cart survives reloads via localStorage
// without ever calling setState from inside an effect body (React flags
// that as a footgun even when, as here, it's just SSR-safe hydration).
let cache: CartItem[] = EMPTY_CART;
let subscribers: Array<() => void> = [];

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function writeStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

function setCart(items: CartItem[]) {
  cache = items;
  writeStorage(items);
  subscribers.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  if (subscribers.length === 0) {
    const fresh = readStorage();
    if (fresh !== cache) {
      cache = fresh;
      queueMicrotask(() => subscribers.forEach((cb) => cb()));
    }
  }
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity) => {
    const cap = item.stockCap ?? Infinity;
    const existing = cache.find((i) => i.productId === item.productId);
    const next = existing
      ? cache.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(cap, i.quantity + quantity) }
            : i,
        )
      : [...cache, { ...item, quantity: Math.min(cap, quantity) }];
    setCart(next);
  }, []);

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    (productId, quantity) => {
      const next = cache
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(0, Math.min(i.stockCap ?? Infinity, quantity)) }
            : i,
        )
        .filter((i) => i.quantity > 0);
      setCart(next);
    },
    [],
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId) => {
    setCart(cache.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setCart(EMPTY_CART), []);

  const totalCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.quantity * i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalCount, subtotal, addItem, setQuantity, removeItem, clear }),
    [items, totalCount, subtotal, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
