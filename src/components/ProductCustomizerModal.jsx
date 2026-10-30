import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, ShoppingBag, PhoneCall, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export default function ProductCustomizerModal({ product, isOpen, onClose }) {
  const { addToCart, formatMoney } = useCart();

  const [prevId, setPrevId] = useState(product?.id);
  const [selectedMaterial, setSelectedMaterial] = useState(() => product?.materials?.[0] || 'Standard');
  const [selectedSize, setSelectedSize] = useState(() => product?.sizes?.[0] || 'Taille Unique');
  const [selectedColor, setSelectedColor] = useState(() => product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [hasEngraving, setHasEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState('serif');
  const [engravingPosition, setEngravingPosition] = useState('fermoir');
  const [activeView, setActiveView] = useState('face'); // 'face' | 'dos' | 'macro'
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Synchronize state during render when a different product is opened
  if (product && product.id !== prevId) {
    setPrevId(product.id);
    setSelectedMaterial(product.materials?.[0] || 'Standard');
    setSelectedSize(product.sizes?.[0] || 'Taille Unique');
    setSelectedColor(product.colors?.[0] || null);
    setQuantity(1);
    setHasEngraving(false);
    setEngravingText('');
    setActiveView('face');
    setIsAddedSuccess(false);
  }

  if (!isOpen || !product) return null;

  // Price calculations (Inspired by "Rincian biaya" in Screenshot 2)
  const basePrice = product.price;
  const isEngravingFree = basePrice >= 50000;
  const engravingPrice = hasEngraving ? (isEngravingFree ? 0 : 3500) : 0;
  const unitTotal = basePrice + engravingPrice;
  const subTotal = unitTotal * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: unitTotal,
      basePrice: product.price,
      image: product.image,
      selectedMaterial,
      selectedSize,
      selectedColor: selectedColor?.name || 'Standard',
      selectedColorHex: selectedColor?.hex || '#D1B992',
      hasEngraving,
      engravingText: hasEngraving ? engravingText.trim().toUpperCase() : '',
      engravingFont,
      engravingPosition,
      qty: quantity,
      cartKey: `${product.id}-${selectedColor?.name || ''}-${selectedSize}-${hasEngraving ? engravingText.trim() : ''}`
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D1B992', '#D4AF37', '#FFFFFF', '#0A0C16']
    });

    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 900);
  };

  const handleOrderWhatsApp = () => {
    const details = [
      `Produit : *${product.name}*`,
      `Matériau : ${selectedMaterial}`,
      `Taille / Dimension : ${selectedSize}`,
      `Coloris : ${selectedColor?.name || 'Standard'}`,
      `Quantité : ${quantity} pièce(s)`,
      hasEngraving && engravingText.trim()
        ? `Gravure sur-mesure : « *${engravingText.trim().toUpperCase()}* » (${engravingPosition})`
        : 'Gravure : Sans gravure',
      `Prix unitaire : ${formatMoney(unitTotal)}`,
      `*Total : ${formatMoney(subTotal)}*`
    ].join('\n');

    const message = encodeURIComponent(
      `Bonjour VIRILACCESSORIES,\nJe souhaite commander cette pièce sur-mesure configurée sur votre site :\n\n${details}\n\nMerci de m'indiquer la confirmation de disponibilité et le délai de remise à Yaoundé / Cameroun.`
    );

    window.open(`https://wa.me/237651024975?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0A0C16] text-white border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden max-h-[94vh] flex flex-col my-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`Personnaliser ${product.name}`}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#04050A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0">
              <img
                src="/images/logo-white.png"
                alt="VIRIL Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
              />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D1B992] block">
                Atelier de Personnalisation Sur-Mesure
              </span>
              <h3 className="font-sans font-medium text-lg sm:text-2xl text-white leading-tight">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#D1B992] hover:border-[#D1B992] transition-all cursor-pointer"
            aria-label="Fermer la modale"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Product Visualizer (Inspired by Screenshot 2 Depan/Belakang) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Product Visual Frame with Paint Backdrop Accent */}
              <div className="relative w-full aspect-square rounded-2xl border border-white/10 bg-[#04050A] p-6 overflow-hidden flex items-center justify-center shadow-inner group">
                
                {/* Organic Luxury Paint Stroke / Fluid Glow Backdrop (Inspired by Screenshot 3 & 2) */}
                <div 
                  className={`absolute -inset-4 opacity-50 blur-2xl rounded-full transition-all duration-700 pointer-events-none ${
                    product.paintBgShape || 'bg-[#D1B992]/20'
                  }`} 
                />

                {/* Subtle Radial Vignette */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

                {/* Main Product Visual: 3D Video Animation or Static Image */}
                {product.video ? (
                  <video
                    src={product.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    webkit-playsinline="true"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    className="relative z-10 w-full h-full object-cover rounded-xl filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
                  />
                )}

                {/* Live Engraving Overlay Preview Badge (If custom text entered) */}
                {hasEngraving && engravingText.trim() && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 py-2 px-3 rounded-lg bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-center shadow-lg animate-fade-in">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-0.5">
                      Aperçu gravure laser // {engravingPosition === 'fermoir' ? 'Fermoir' : 'Intérieur'}
                    </span>
                    <span className={`text-sm sm:text-base tracking-[0.25em] text-white font-bold ${
                      engravingFont === 'serif' ? 'font-serif italic' : 'font-mono'
                    }`}>
                      « {engravingText.trim().toUpperCase()} »
                    </span>
                  </div>
                )}

                {/* Active Color Tag */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-[#9AA0B4]">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: selectedColor?.hex || '#D1B992' }}
                  />
                  <span>{selectedColor?.name || 'Finition Standard'}</span>
                </div>
              </div>

              {/* View Angles Selector (Depan / Belakang / Finitions - Inspired by Screenshot 2) */}
              <div className="flex items-center justify-center gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={() => setActiveView('face')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
                    activeView === 'face'
                      ? 'border-[#D1B992] bg-[#D1B992]/10 text-[#D1B992]'
                      : 'border-white/10 bg-white/[0.02] text-[#9AA0B4] hover:border-white/20'
                  }`}
                >
                  Vue Face
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('dos')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
                    activeView === 'dos'
                      ? 'border-[#D1B992] bg-[#D1B992]/10 text-[#D1B992]'
                      : 'border-white/10 bg-white/[0.02] text-[#9AA0B4] hover:border-white/20'
                  }`}
                >
                  Vue Dos / Intérieur
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('macro')}
                  className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
                    activeView === 'macro'
                      ? 'border-[#D1B992] bg-[#D1B992]/10 text-[#D1B992]'
                      : 'border-white/10 bg-white/[0.02] text-[#9AA0B4] hover:border-white/20'
                  }`}
                >
                  Détail Macro
                </button>
              </div>

              {/* Trust Badges */}
              <div className="w-full mt-5 p-3.5 rounded-xl border border-white/10 bg-[#04050A] space-y-2 text-[11px] text-[#9AA0B4]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D1B992] flex-shrink-0" />
                  <span>Certificat d'authenticité VIRILACCESSORIES inclus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                  <span>Écrin cadeau prestige en velours noir offert</span>
                </div>
              </div>
            </div>

            {/* Right Column: Configurator Controls & Cost Breakdown (Inspired by Screenshot 2) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Option 1: Pilih jenis / Type de cuir & matériau */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-[#9AA0B4] mb-2 flex items-center justify-between">
                  <span>Modèle & Matériau noble</span>
                  <span className="text-[10px] text-[#D1B992] font-mono">100% Authentique</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/15 text-white text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {product.materials?.map((mat, idx) => (
                      <option key={idx} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9AA0B4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Option 2: Pilih Size / Dimension */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-[#9AA0B4] mb-2">
                  Format / Taille recommandée
                </label>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#04050A] border border-white/15 text-white text-xs sm:text-sm focus:border-[#D1B992] focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {product.sizes?.map((sz, idx) => (
                      <option key={idx} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9AA0B4] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Option 3: Pilih warna / Nuancier de Couleurs (Inspired by Screenshot 2 Color Swatches) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-sans text-xs uppercase tracking-wider text-[#9AA0B4]">
                    Finition & Nuance
                  </label>
                  <span className="font-sans text-xs text-white font-medium">
                    {selectedColor?.name || 'Standard'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {product.colors?.map((col, idx) => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                        className={`group relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'border-[#D1B992] scale-110 shadow-[0_0_15px_rgba(209,185,146,0.4)]'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 4: Pcs / Quantité */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-[#9AA0B4] mb-2">
                  Quantité (Pièces)
                </label>
                <div className="inline-flex items-center border border-white/15 rounded-xl bg-[#04050A] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-base font-semibold"
                    aria-label="Diminuer"
                  >
                    -
                  </button>
                  <span className="min-w-[48px] text-center font-mono text-sm text-white font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-base font-semibold"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Option 5: Tambahan sablon / Personnalisation & Gravure Laser (Inspired by Screenshot 2) */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#04050A] space-y-4">
                <div className="flex items-start gap-3 cursor-pointer select-none" onClick={() => setHasEngraving(!hasEngraving)}>
                  <input
                    type="checkbox"
                    id="hasEngraving"
                    checked={hasEngraving}
                    onChange={(e) => setHasEngraving(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#D1B992] cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="hasEngraving" className="font-sans font-medium text-xs sm:text-sm text-white block cursor-pointer">
                      Personnalisation Haute Précision (Gravure Laser)
                    </label>
                    <span className="text-[11px] text-[#9AA0B4] block">
                      {isEngravingFree ? (
                        <strong className="text-[#D1B992]">OFFERTE sur cette création</strong>
                      ) : (
                        '+ 3 500 FCFA (ou offerte dès 50 000 FCFA)'
                      )}
                    </span>
                  </div>
                </div>

                {hasEngraving && (
                  <div className="pt-2 border-t border-white/10 space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-[11px] text-[#9AA0B4] mb-1.5">
                        Texte ou Monogramme à graver (Max 12 caractères)
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder={product.engravingPlaceholder || 'Ex: V.A. ou vos initiales'}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0A0C16] border border-white/15 text-white placeholder-[#5E6479] text-base sm:text-xs font-mono uppercase tracking-widest focus:border-[#D1B992] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#9AA0B4] uppercase tracking-wider mb-1">
                          Style Typographique
                        </label>
                        <select
                          value={engravingFont}
                          onChange={(e) => setEngravingFont(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0A0C16] border border-white/15 text-white text-base sm:text-xs focus:border-[#D1B992] focus:outline-none cursor-pointer"
                        >
                          <option value="serif">Serif Royal (Italique)</option>
                          <option value="sans">Sans-Serif Minimaliste</option>
                          <option value="mono">Monospace Technique</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#9AA0B4] uppercase tracking-wider mb-1">
                          Emplacement
                        </label>
                        <select
                          value={engravingPosition}
                          onChange={(e) => setEngravingPosition(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0A0C16] border border-white/15 text-white text-base sm:text-xs focus:border-[#D1B992] focus:outline-none cursor-pointer"
                        >
                          <option value="fermoir">Sur le fermoir métallique</option>
                          <option value="interieur">À l'intérieur de la pièce</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rincian Biaya (Price Breakdown Card - Direct Inspiration from Screenshot 2) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#04050A] to-[#0A0C16] border border-white/10 space-y-2.5 text-xs">
                <div className="font-sans font-medium text-xs uppercase tracking-wider text-[#D1B992] pb-1 border-b border-white/10">
                  Détails du tarif // Récépissé
                </div>

                <div className="flex justify-between text-[#9AA0B4]">
                  <span>{product.name} ({quantity}x)</span>
                  <span className="font-mono text-white">{formatMoney(basePrice * quantity)}</span>
                </div>

                {hasEngraving && (
                  <div className="flex justify-between text-[#9AA0B4]">
                    <span>Option gravure sur-mesure ({quantity}x)</span>
                    <span className="font-mono text-[#D1B992]">
                      {isEngravingFree ? 'OFFERTE' : formatMoney(engravingPrice * quantity)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#9AA0B4]">
                  <span>Écrin velours noir & emballage cadeau</span>
                  <span className="font-mono text-[#D1B992]">INCLUS</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm sm:text-base font-sans">
                  <span className="font-medium text-white">Montant Total :</span>
                  <span className="font-mono font-bold text-lg sm:text-xl text-[#D1B992]">
                    {formatMoney(subTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-full bg-[#D1B992] text-[#04050A] font-semibold text-xs uppercase tracking-widest hover:bg-[#DFCAA0] hover:shadow-[0_0_25px_rgba(209,185,146,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isAddedSuccess ? 'Ajouté avec succès !' : 'Ajouter au panier avec cette configuration'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Finaliser immédiatement via Concierge WhatsApp</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
