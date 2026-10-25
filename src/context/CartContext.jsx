import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'viril_cart_v2';
const FAV_KEY = 'viril_favorites_v1';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAV_KEY);
      return saved ? JSON.parse(saved) : ['art-1', 'art-3'];
    } catch {
      return ['art-1', 'art-3'];
    }
  });

  // Navigation stage: TOUJOURS 'initial' à chaque actualisation (F5 / Rafraîchir)
  const [navStage, setNavStage] = useState('initial');

  const unlockNav = (targetId = 'boutique') => {
    setNavStage('unlocked');

    setTimeout(() => {
      if (targetId === 'boutique') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
          window.history.pushState(null, '', '#boutique');
        } catch {
          window.location.hash = '#boutique';
        }
      } else {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = '#' + targetId;
        }
      }
    }, 50);
  };

  useEffect(() => {
    // Réinitialisation stricte à l'accueil en haut de page à chaque chargement/actualisation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        // ignore
      }
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      if (window.location.hash) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Erreur sauvegarde panier", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Erreur sauvegarde favoris", e);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const addToCart = (item) => {
    const cartKey = item.cartKey || `${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${item.engravingText || ''}`;
    const newItem = { ...item, cartKey };

    setCart((prev) => {
      const existing = prev.find((i) => (i.cartKey && i.cartKey === cartKey) || (!i.cartKey && i.id === item.id));
      if (existing) {
        return prev.map((i) =>
          ((i.cartKey && i.cartKey === cartKey) || (!i.cartKey && i.id === item.id))
            ? { ...i, qty: i.qty + (item.qty || 1) }
            : i
        );
      }
      return [...prev, { ...newItem, qty: item.qty || 1 }];
    });

    setBump(true);
    setTimeout(() => setBump(false), 500);
    setIsCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const match = item.cartKey ? item.cartKey === key : item.id === key;
          if (match) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) =>
      prev.filter((item) => (item.cartKey ? item.cartKey !== key : item.id !== key))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        bump,
        totalCount,
        totalAmount,
        formatMoney,
        favorites,
        toggleFavorite,
        isFavorite,
        navStage,
        setNavStage,
        unlockNav,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé au sein de CartProvider');
  }
  return context;
}
