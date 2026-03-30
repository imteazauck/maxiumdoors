import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "../data/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  priceLabel: string;
  unitPrice: number;
  quantity: number;
  colour?: string;
  quoteRef?: string;
  doorRef?: string;
  details?: string[];
};

type AddToCartInput = {
  product: Product;
  quantity?: number;
  colour?: string;
};

type AddConfiguredItemInput = {
  quoteRef: string;
  doorRef: string;
  name: string;
  unitPrice: number;
  quantity: number;
  details: string[];
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isBasketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  addItem: (input: AddToCartInput) => void;
  addConfiguredItem: (input: AddConfiguredItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const openBasket = useCallback(() => {
    setIsBasketOpen(true);
  }, []);

  const closeBasket = useCallback(() => {
    setIsBasketOpen(false);
  }, []);

  const addItem = useCallback(({ product, quantity = 1, colour }: AddToCartInput) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.productId === product.id && item.colour === colour,
      );

      if (existing) {
        return current.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...current,
        {
          id: `${product.id}-${colour ?? "default"}`,
          productId: product.id,
          name: product.name,
          priceLabel: product.price,
          unitPrice: product.basePrice,
          quantity,
          colour,
        },
      ];
    });

    setIsBasketOpen(true);
  }, []);

  const addConfiguredItem = useCallback(
    ({ quoteRef, doorRef, name, unitPrice, quantity, details }: AddConfiguredItemInput) => {
      setItems((current) => [
        ...current,
        {
          id: `${quoteRef}-${doorRef}-${crypto.randomUUID()}`,
          productId: "configured-door",
          name,
          priceLabel: `£${unitPrice.toFixed(2)}`,
          unitPrice,
          quantity,
          quoteRef,
          doorRef,
          details,
        },
      ]);

      setIsBasketOpen(false);
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.id !== id);
      }

      return current.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsBasketOpen(false);
  }, []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isBasketOpen,
      openBasket,
      closeBasket,
      addItem,
      addConfiguredItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [
    items,
    isBasketOpen,
    openBasket,
    closeBasket,
    addItem,
    addConfiguredItem,
    removeItem,
    updateQuantity,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}