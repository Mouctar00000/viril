import React, { useState } from 'react';
import { X, Check, Truck, ArrowRight, PhoneCall, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({ isOpen, onClose, directItem = null }) {
  const { cart, totalAmount, formatMoney, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('whatsapp'); // 'whatsapp' | 'orange' | 'mtn' | 'cash'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Yaoundé',
    neighborhood: '',
    notes: '',
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  // If a directItem is provided, use it, otherwise use cart items
  const items = directItem
    ? [{ id: directItem.id, name: directItem.name || directItem.title, price: directItem.price, qty: 1 }]
    : cart;

  const calculatedTotal = directItem
    ? directItem.price
    : totalAmount;

  const paymentOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Direct',
      badge: 'Recommandé & Rapide',
      desc: 'Finalisation et confirmation immédiate avec notre concierge sur WhatsApp.',
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
          <PhoneCall className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'orange',
      name: 'Orange Money Cameroun',
      badge: '+237 651 02 49 75',
      desc: 'Transfert direct sécurisé. Validation instantanée après saisie de la référence.',
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#FF6600]/20 border border-[#FF6600]/40 flex items-center justify-center text-[#FF6600]">
          <Smartphone className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money (MoMo)',
      badge: '+237 651 02 49 75',
      desc: 'Paiement sans frais via MoMo Cameroun avec confirmation SMS.',
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/40 flex items-center justify-center text-[#FFCC00]">
          <Smartphone className="w-4 h-4" />
        </div>
      ),
    },
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      badge: 'Yaoundé & Douala',
      desc: 'Réglez en espèces ou Mobile Money directement à la réception de votre colis.',
      icon: (
        <div className="w-8 h-8 rounded-full bg-[#D1B992]/20 border border-[#D1B992]/40 flex items-center justify-center text-[#D1B992]">
          <Truck className="w-4 h-4" />
        </div>
      ),
    },
  ];

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const generatedId = 'VIRIL-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedId);
    setOrderComplete(true);

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#D1B992', '#FFFFFF', '#0A0C16', '#DFCAA0'],
    });

    if (!directItem) {
      clearCart();
    }
  };

  const handleConfirmOnWhatsApp = () => {
    let itemsText = items
      .map((item, idx) => {
        const specs = [
          item.selectedColor ? `Coloris: ${item.selectedColor}` : null,
          item.selectedSize ? `Taille: ${item.selectedSize}` : null,
          item.hasEngraving && item.engravingText ? `Gravure: « ${item.engravingText} »` : null
        ].filter(Boolean).join(', ');
        const specStr = specs ? ` [${specs}]` : '';
        return `${idx + 1}. ${item.name}${specStr} (x${item.qty}) : ${formatMoney(item.price * item.qty)}`;
      })
      .join('\n');

    const methodLabel = paymentOptions.find((p) => p.id === paymentMethod)?.name || paymentMethod;

    const message = encodeURIComponent(
      `Bonjour VIRILACCESSORIES,\nJe viens de valider ma commande *${orderNumber}* sur le site :\n\n` +
      `👤 *Client :* ${formData.name}\n` +
      `📞 *Téléphone :* ${formData.phone}\n` +
      `📍 *Ville / Quartier :* ${formData.city} (${formData.neighborhood || 'Centre'})\n` +
      `💳 *Mode de règlement :* ${methodLabel}\n\n` +
      `🛍️ *Articles :*\n${itemsText}\n\n` +
      `💰 *Total à régler : ${formatMoney(calculatedTotal)}*\n\n` +
      (formData.notes ? `📝 *Note :* ${formData.notes}\n\n` : '') +
      `Merci de confirmer la prise en charge de ma commande.`
    );

    window.open(`https://wa.me/237651024975?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#0A0C16] text-white border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-white/10 flex items-center justify-between bg-[#04050A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center p-2">
              <img
                src="/images/logo-white.png"
                alt="VIRIL Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D1B992]">
                Passerelle de Commande Sécurisée
              </span>
              <h3 className="font-sans font-medium text-lg sm:text-xl text-white">
                Finaliser votre acquisition
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#D1B992] hover:border-[#D1B992] transition-all"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {!orderComplete ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Order Recap Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#04050A] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#9AA0B4] border-b border-white/5 pb-2">
                  <span>Articles sélectionnés ({items.length})</span>
                  <span>Sous-total</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-white/5 last:border-0">
                      <div className="truncate max-w-[260px] sm:max-w-xs">
                        <span className="text-white font-medium">{item.name}</span>{' '}
                        <span className="text-[#5E6479]">x{item.qty}</span>
                        {(item.selectedColor || item.selectedSize || item.hasEngraving) && (
                          <span className="block text-[10px] text-[#9AA0B4] truncate">
                            {item.selectedColor ? item.selectedColor : ''}
                            {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                            {item.hasEngraving && item.engravingText ? ` • Gravure: « ${item.engravingText} »` : ''}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[#D1B992] font-semibold flex-shrink-0">
                        {formatMoney(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between font-sans">
                  <span className="text-sm font-medium text-white">Total à régler :</span>
                  <span className="text-lg sm:text-xl font-bold text-[#D1B992]">
                    {formatMoney(calculatedTotal)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9AA0B4] mb-3">
                  Mode de règlement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        paymentMethod === opt.id
                          ? 'border-[#D1B992] bg-[#D1B992]/5 shadow-[0_0_15px_rgba(209,185,146,0.2)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      {opt.icon}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-sans font-medium text-xs sm:text-[13px] text-white truncate">
                            {opt.name}
                          </span>
                        </div>
                        <span className="inline-block font-mono text-[9.5px] text-[#D1B992] mb-1">
                          {opt.badge}
                        </span>
                        <p className="text-[11px] text-[#9AA0B4] leading-snug line-clamp-2">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Coordinates */}
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#9AA0B4]">
                  Vos coordonnées de livraison
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nom complet *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/10 text-white placeholder-[#5E6479] text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Numéro WhatsApp (ex: 651024975) *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/10 text-white placeholder-[#5E6479] text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/10 text-white text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors"
                    >
                      <option value="Yaoundé">Yaoundé (Livraison Express)</option>
                      <option value="Douala">Douala (Livraison 24h-48h)</option>
                      <option value="Bafoussam">Bafoussam</option>
                      <option value="Garoua">Garoua</option>
                      <option value="Autre Cameroun">Autre ville au Cameroun</option>
                      <option value="International">International (Diaspora / E-books)</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Quartier ou repère de livraison"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/10 text-white placeholder-[#5E6479] text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Instructions particulières (facultatif)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#04050A] border border-white/10 text-white placeholder-[#5E6479] text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full py-4 rounded-full bg-[#D1B992] text-[#04050A] font-semibold text-xs uppercase tracking-widest hover:bg-[#DFCAA0] hover:shadow-[0_0_25px_rgba(209,185,146,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Confirmer ma commande ({formatMoney(calculatedTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Success Screen */
            <div className="py-8 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#D1B992]/20 border border-[#D1B992] mx-auto flex items-center justify-center text-[#D1B992] shadow-[0_0_25px_rgba(209,185,146,0.45)]">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D1B992] block mb-1">
                  Commande enregistrée avec succès
                </span>
                <h4 className="font-sans font-medium text-2xl text-white mb-2">
                  Référence : {orderNumber}
                </h4>
                <p className="font-sans text-sm text-[#9AA0B4] max-w-md mx-auto">
                  Merci pour votre confiance, <strong className="text-white">{formData.name}</strong>. Notre concierge prépare votre expédition pour <strong className="text-white">{formData.city}</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#04050A] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-[#9AA0B4]">
                  <span>Montant total :</span>
                  <span className="font-mono text-[#D1B992] font-semibold">{formatMoney(calculatedTotal)}</span>
                </div>
                <div className="flex justify-between text-[#9AA0B4]">
                  <span>Moyen de paiement :</span>
                  <span className="text-white">{paymentOptions.find((p) => p.id === paymentMethod)?.name}</span>
                </div>
                <div className="flex justify-between text-[#9AA0B4]">
                  <span>Téléphone client :</span>
                  <span className="text-white">{formData.phone}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleConfirmOnWhatsApp}
                  className="w-full max-w-md mx-auto py-3.5 rounded-full bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Envoyer la confirmation sur WhatsApp (+237)</span>
                </button>

                <button
                  onClick={onClose}
                  className="block mx-auto text-xs text-[#9AA0B4] hover:text-white transition-colors underline pt-2"
                >
                  Retourner à la boutique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
