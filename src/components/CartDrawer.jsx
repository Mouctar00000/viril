import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, PhoneCall } from 'lucide-react';

export default function CartDrawer({ onOpenCheckoutModal }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeFromCart,
    totalCount,
    totalAmount,
    formatMoney,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let itemsList = cart
      .map((item, idx) => {
        const specs = [
          item.selectedColor ? `Coloris: ${item.selectedColor}` : null,
          item.selectedSize ? `Taille: ${item.selectedSize}` : null,
          item.hasEngraving && item.engravingText ? `Gravure: « ${item.engravingText} »` : null
        ].filter(Boolean).join(', ');
        const specStr = specs ? ` (${specs})` : '';
        return `${idx + 1}. ${item.name}${specStr} x${item.qty} = ${formatMoney(item.price * item.qty)}`;
      })
      .join('\n');

    const message = encodeURIComponent(
      `Bonjour VIRILACCESSORIES,\nJe souhaite passer commande sur votre boutique :\n\n${itemsList}\n\n*Total : ${formatMoney(totalAmount)}*\n\nMerci de m'indiquer les modalités de livraison à Yaoundé / Cameroun.`
    );

    window.open(`https://wa.me/237651024975?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-[#04050A]/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] bg-[#04050A] border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-400"
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-white/10">
          <h2 className="font-sans font-medium text-xl text-white flex items-center gap-2">
            <span>Panier</span>
            <span className="text-xs text-[#9AA0B4]">({totalCount})</span>
          </h2>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-[#D1B992] hover:border-[#D1B992] transition-all"
            aria-label="Fermer le panier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-[#5E6479]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 stroke-white/20" />
              <p className="font-sans text-base text-[#9AA0B4] mb-1">Votre panier est vide</p>
              <span className="text-xs text-[#5E6479]">Découvrez nos e-books et accessoires.</span>
            </div>
          ) : (
              <div
                key={item.cartKey || item.id}
                className="grid grid-cols-[68px_1fr_auto] gap-3.5 py-4 border-b border-white/10 items-center animate-fade-in"
              >
                {/* Thumb */}
                <div className="w-[68px] h-20 rounded-xl border border-white/10 bg-[#04050A] p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-[#D1B992]/70" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="font-sans font-medium text-sm text-white leading-snug truncate">
                    {item.name}
                  </h4>

                  {/* Custom Configuration Specs (Color, Size, Engraving) */}
                  {(item.selectedColor || item.selectedSize || item.hasEngraving) && (
                    <div className="text-[10.5px] text-[#9AA0B4] space-y-0.5 mt-0.5">
                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full border border-white/30"
                            style={{ backgroundColor: item.selectedColorHex || '#D1B992' }}
                          />
                          <span>{item.selectedColor}</span>
                          {item.selectedSize && <span>• {item.selectedSize}</span>}
                        </div>
                      )}
                      {item.hasEngraving && item.engravingText && (
                        <div className="text-[#D4AF37] font-mono text-[10px]">
                          Gravure: « {item.engravingText} »
                        </div>
                      )}
                    </div>
                  )}

                  <div className="font-mono text-xs text-[#D1B992] font-semibold my-1.5">
                    {formatMoney(item.price)}
                  </div>

                  {/* Quantity */}
                  <div className="inline-flex items-center border border-white/15 rounded-full overflow-hidden bg-white/[0.03]">
                    <button
                      onClick={() => updateQty(item.cartKey || item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-[#9AA0B4] hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="min-w-[26px] text-center font-mono text-xs text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartKey || item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#9AA0B4] hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.cartKey || item.id)}
                  className="p-2 text-[#5E6479] hover:text-red-400 transition-colors"
                  aria-label="Retirer l'article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#04050A] space-y-4">
            <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-[#9AA0B4]">
              <span>Sous-total</span>
              <strong className="font-sans text-2xl font-semibold text-white tracking-normal">
                {formatMoney(totalAmount)}
              </strong>
            </div>

            <p className="text-[11px] text-[#5E6479] leading-relaxed">
              Expédition sécurisée à Yaoundé et dans tout le Cameroun.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onOpenCheckoutModal) onOpenCheckoutModal();
                }}
                className="btn-main btn--solid w-full cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Commander en ligne (Orange / MTN / Cash)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3 px-4 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Assistance WhatsApp directe</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
