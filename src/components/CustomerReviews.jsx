import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

const RATING_LABELS = {
  1: 'Insatisfait',
  2: 'Mitigé',
  3: 'Satisfait',
  4: 'Très satisfait',
  5: 'Exceptionnel — Haut de gamme'
};

export default function CustomerReviews() {
  const { unlockNav } = useCart();

  // Reviews state from backend
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [stackedIndex, setStackedIndex] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam bot trap

  // Submission UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch approved reviews from persistent backend
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.warn('Impossible de charger les avis depuis le serveur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Anti-spam bot check
    if (honeypot.trim() !== '') {
      setErrorMessage('Requête invalide.');
      return;
    }

    // Client-side validations
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Veuillez renseigner votre nom complet (au moins 2 caractères).');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Veuillez sélectionner une note de 1 à 5 étoiles.');
      return;
    }

    if (!trimmedComment || trimmedComment.length < 10) {
      setErrorMessage('Veuillez rédiger un avis détaillé (au moins 10 caractères).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          rating,
          comment: trimmedComment,
          website: honeypot
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Une erreur est survenue lors de l'enregistrement de votre avis.");
      }

      // Success: Reset form
      setName('');
      setComment('');
      setRating(5);
      setSuccessMessage(result.message || 'Votre avis a été publié avec succès. Merci !');

      // Add to list
      if (result.review) {
        setReviews((prev) => [result.review, ...prev.filter((r) => r.id !== result.review.id)]);
      } else {
        fetchReviews();
      }

      // Celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D1B992', '#DFCAA0', '#FFFFFF']
        });
      } catch {
        // silent
      }

      // Auto-hide success message after 7 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 7000);
    } catch (err) {
      setErrorMessage(err.message || 'Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute average rating if reviews exist
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section id="avis-clients" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#04050A] border-t border-white/10 overflow-hidden">
      
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D1B992]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10 reveal-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D1B992]" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
                Témoignages & Expériences Clients
              </span>
            </div>

            <h2 className="font-sans font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1]">
              Avis Clients &{' '}
              <span className="font-serif italic text-[#D1B992] font-normal">
                retours d'excellence.
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed max-w-2xl mt-3">
              Découvrez les retours authentiques de nos clients et partagez votre propre appréciation de nos pièces de maroquinerie, horlogerie et parures masculines.
            </p>
          </div>

          {/* Rating Summary Pill (Only when reviews exist) */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-4 bg-[#0A0C16] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg flex-shrink-0">
              <div className="text-center border-r border-white/10 pr-4">
                <span className="font-sans font-bold text-3xl sm:text-4xl text-white leading-none block">
                  {averageRating}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9AA0B4] block mt-1">
                  Sur 5.0
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(averageRating))
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#9AA0B4] font-medium">
                  {reviews.length} {reviews.length > 1 ? 'avis vérifiés' : 'avis vérifié'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Two-Column Grid: Left = Submission Form, Right = Approved Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Customer Review Submission Form (Matching Screenshot functionality in Luxury Theme) */}
          <div className="lg:col-span-5 bg-[#0A0C16] border border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden reveal-on-scroll">
            <div className="mb-6">
              <span className="font-mono text-xs text-[#D1B992] tracking-widest uppercase block mb-1">
                Partagez votre avis
              </span>
              <h3 className="font-sans font-medium text-2xl text-white tracking-tight">
                Déposer un témoignage
              </h3>
              <p className="font-sans text-xs text-[#9AA0B4] mt-1">
                Votre avis permet de guider la communauté des gentlemen VIRIL ACCESSORIES.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating Interactive Selector (Touch-friendly & visually clear) */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-[#FAF8F5] font-medium mb-2.5">
                  Votre note globale <span className="text-[#D1B992]">*</span>
                </label>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#04050A] border border-white/10">
                  <div className="flex items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label="Sélection de la note par étoiles">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isActive = (hoverRating || rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-transform active:scale-90 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D1B992]"
                          aria-label={`${starVal} étoile${starVal > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-200 ${
                              isActive
                                ? 'fill-[#D4AF37] text-[#D4AF37] scale-105 filter drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                                : 'text-white/25 hover:text-white/60'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-mono text-xs font-semibold text-[#D1B992] ml-auto px-2 py-1 rounded bg-white/5 border border-white/10">
                    {rating} / 5
                  </span>
                </div>

                <p className="text-[11px] text-[#9AA0B4] mt-1.5 italic">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Customer Name */}
              <div>
                <label htmlFor="review-name" className="block font-sans text-xs uppercase tracking-wider text-[#FAF8F5] font-medium mb-2">
                  Votre nom complet ou signature <span className="text-[#D1B992]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="review-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Christian M. ou David Nguema"
                    className="w-full bg-[#04050A] border border-white/10 rounded-xl px-4 py-3 pl-10 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D1B992] transition-all"
                    maxLength={70}
                  />
                  <User className="w-4 h-4 text-[#9AA0B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Customer Review Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="review-comment" className="block font-sans text-xs uppercase tracking-wider text-[#FAF8F5] font-medium">
                    Partagez votre expérience <span className="text-[#D1B992]">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#9AA0B4]">
                    {comment.length} / 1500
                  </span>
                </div>
                <textarea
                  id="review-comment"
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Qualité des finitions, tenue des accessoires, sensation au porter, accueil à Yaoundé..."
                  className="w-full bg-[#04050A] border border-white/10 rounded-xl p-3.5 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D1B992] transition-all resize-y min-h-[110px]"
                  maxLength={1500}
                />
              </div>

              {/* Anti-spam hidden honeypot (Invisible to real users, catches automated bots) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="review-website">Ne pas remplir</label>
                <input
                  id="review-website"
                  type="text"
                  tabIndex="-1"
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Clear Public Visibility Notice */}
              <div className="rounded-xl border border-white/10 bg-[#04050A]/70 p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#D1B992] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#9AA0B4] leading-relaxed">
                  <strong className="text-white font-medium block">Visibilité publique :</strong>
                  En soumettant votre avis, vous acceptez qu'il soit affiché publiquement sur le site VIRIL ACCESSORIES avec votre nom et la date après modération.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3.5 rounded-xl border border-[#D1B992]/40 bg-[#D1B992]/10 text-[#D1B992] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-main btn--solid btn-light-sweep text-xs tracking-[0.18em] uppercase font-bold py-4 px-6 cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(209,185,146,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <span>PUBLIER L'AVIS</span>
                    <Send className="w-3.5 h-3.5 text-black group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Approved Public Reviews Display */}
          <div className="lg:col-span-7 space-y-6 reveal-on-scroll reveal-delay-1">
            
            <div className="flex flex-wrap sm:flex-nowrap items-baseline justify-between gap-3 pb-2">
              <h3 className="font-sans font-medium text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2.5 whitespace-nowrap">
                <MessageSquare className="w-5 h-5 text-[#D1B992]" />
                <span>Avis Publiés ({reviews.length})</span>
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D1B992] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] shadow-[0_0_8px_#D1B992] animate-pulse" />
                <span>100% retour client réel</span>
              </div>
            </div>

            {isLoading ? (
              <div className="p-6 sm:p-7 rounded-2xl border border-white/5 bg-[#0A0C16] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full luxury-skeleton-shimmer" />
                    <div className="space-y-1.5">
                      <div className="w-32 h-3.5 rounded luxury-skeleton-shimmer" />
                      <div className="w-20 h-2.5 rounded luxury-skeleton-shimmer" />
                    </div>
                  </div>
                  <div className="w-24 h-3.5 rounded luxury-skeleton-shimmer" />
                </div>
                <div className="w-full h-14 rounded-xl luxury-skeleton-shimmer" />
              </div>
            ) : reviews.length === 0 ? (
              /* High-end invitation when no reviews yet */
              <div className="p-10 sm:p-14 text-center rounded-[2rem] border border-white/10 bg-[#0A0C16] shadow-lg flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-[#D1B992]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-medium text-lg sm:text-xl text-white mb-2">
                  Soyez le premier à partager votre expérience
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#9AA0B4] max-w-md leading-relaxed mb-6">
                  Aucun avis n'a encore été publié pour cette sélection. Remplissez le formulaire ci-contre pour inaugurer notre livre d'or d'excellence.
                </p>
                <div className="flex text-[#D4AF37]/50 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ) : reviews.length >= 4 && !isReviewsExpanded ? (
              /* Apple Notification-Grouped Stacked Cards Layout (Inspired by Screenshot 4) */
              <div className="space-y-4">
                <div className="relative pt-2 pb-4">
                  {/* Active Top Card */}
                  {(() => {
                    const currentRev = reviews[stackedIndex % reviews.length];
                    const initials = (currentRev?.name || 'C')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <article className="p-5 sm:p-6 rounded-2xl border border-white/15 bg-[#0C0E1B] hover:border-[#D1B992]/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-20">
                        {/* Top Header Row of Review Card */}
                        <div className="flex items-center justify-between gap-4 mb-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Monogram Avatar with notification badge */}
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D1B992]/20 to-white/10 border border-white/15 flex items-center justify-center text-xs font-mono font-bold text-white shadow-inner">
                                {initials}
                              </div>
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#25D366] border-2 border-[#0A0C16] flex items-center justify-center text-[8px] text-black font-bold">
                                ✓
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-sans font-medium text-sm sm:text-base text-white truncate">
                                  {currentRev?.name}
                                </h4>
                                {currentRev?.verifiedCustomer && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-[#D1B992] font-medium flex-shrink-0" title="Client vérifié VIRIL ACCESSORIES">
                                    <CheckCircle2 className="w-3 h-3 text-[#D1B992]" />
                                    <span className="hidden sm:inline">Vérifié</span>
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] text-[#5E6479] block">
                                {currentRev?.date || 'Récemment'}
                              </span>
                            </div>
                          </div>

                          {/* Stack Count Badge & Stars */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="px-2 py-0.5 rounded-full bg-[#D1B992]/15 border border-[#D1B992]/30 text-[9.5px] font-mono text-[#D1B992] tracking-wider uppercase font-semibold">
                              +{reviews.length - 1} autres avis
                            </span>
                            <div className="flex text-[#D4AF37]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Number(currentRev?.rating)
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Review Comment Body */}
                        <p className="font-sans text-xs sm:text-sm text-[#FAF8F5] leading-relaxed pl-2 border-l-2 border-[#D1B992]">
                          « {currentRev?.comment} »
                        </p>

                        {/* Interactive Stack Flipping Controls */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10.5px] font-mono text-[#9AA0B4]">
                          <span>Avis {((stackedIndex % reviews.length) + 1)} sur {reviews.length}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStackedIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                              className="w-7 h-7 rounded-full border border-white/10 bg-white/5 hover:border-[#D1B992] hover:text-[#D1B992] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                              aria-label="Avis précédent"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setStackedIndex((prev) => (prev + 1) % reviews.length)}
                              className="w-7 h-7 rounded-full border border-white/10 bg-white/5 hover:border-[#D1B992] hover:text-[#D1B992] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                              aria-label="Avis suivant"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })()}

                  {/* Under-layer 1 (Grouped notification depth effect) */}
                  <div className="relative -mt-2 mx-3 h-3 rounded-b-2xl border-b border-x border-white/10 bg-[#090B15] shadow-md opacity-80 pointer-events-none z-10" />

                  {/* Under-layer 2 (Grouped notification depth effect) */}
                  <div className="relative -mt-1 mx-6 h-3 rounded-b-2xl border-b border-x border-white/5 bg-[#05060E] shadow-md opacity-40 pointer-events-none z-0" />
                </div>

                {/* Expand / View All Reviews Button */}
                <button
                  type="button"
                  onClick={() => setIsReviewsExpanded(true)}
                  className="w-full py-3 px-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#D1B992]/40 text-xs font-mono uppercase tracking-wider text-[#D1B992] hover:bg-[#D1B992]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                >
                  <Layers className="w-4 h-4 text-[#D1B992] group-hover:scale-110 transition-transform" />
                  <span>Afficher tous les avis ({reviews.length})</span>
                  <ChevronDown className="w-4 h-4 text-[#D1B992] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              /* Approved Reviews Cards List (Expanded or < 4 reviews) */
              <div className="space-y-4">
                <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                  {reviews.map((rev) => {
                    const initials = (rev.name || 'C')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <article
                        key={rev.id}
                        className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0A0C16] hover:border-[#D1B992]/30 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative group"
                      >
                        {/* Top Header Row of Review Card */}
                        <div className="flex items-center justify-between gap-4 mb-3.5">
                          <div className="flex items-center gap-3">
                            {/* Monogram Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D1B992]/20 to-white/10 border border-white/15 flex items-center justify-center text-xs font-mono font-bold text-white shadow-inner">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-sans font-medium text-sm sm:text-base text-white">
                                  {rev.name}
                                </h4>
                                {rev.verifiedCustomer && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-[#D1B992] font-medium" title="Client vérifié VIRIL ACCESSORIES">
                                    <CheckCircle2 className="w-3 h-3 text-[#D1B992]" />
                                    <span className="hidden sm:inline">Vérifié</span>
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] text-[#5E6479]">
                                {rev.date || 'Récemment'}
                              </span>
                            </div>
                          </div>

                          {/* Star Rating Display */}
                          <div className="flex text-[#D4AF37]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Number(rev.rating)
                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                    : 'text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Review Comment Body */}
                        <p className="font-sans text-xs sm:text-sm text-[#FAF8F5] leading-relaxed pl-2 border-l-2 border-[#D1B992]/40">
                          « {rev.comment} »
                        </p>
                      </article>
                    );
                  })}
                </div>

                {reviews.length >= 4 && (
                  <button
                    type="button"
                    onClick={() => setIsReviewsExpanded(false)}
                    className="w-full py-2.5 px-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#D1B992]/40 text-xs font-mono uppercase tracking-wider text-[#9AA0B4] hover:text-[#D1B992] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span>Réduire l'affichage (mode compact)</span>
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

        {/* 2. Prominent “VOIR LA COLLECTION” Call-to-Action Banner (Requirement 2) */}
        <div className="mt-20 sm:mt-28 rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-[#070913] via-[#0D1022] to-[#070913] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] reveal-on-scroll">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D1B992]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#D1B992]" />
              <span className="font-sans text-[10.5px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
                Vestiaire Exécutif & Parures d'Exception
              </span>
            </div>

            <h3 className="font-sans font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              Prêt à sublimer{' '}
              <span className="font-serif italic text-[#D1B992] font-normal">
                votre allure ?
              </span>
            </h3>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#9AA0B4] leading-relaxed max-w-xl mx-auto pb-4">
              Explorez l'intégralité de nos pièces en cuir de crocodile, gardes-temps squelettes et bijoux masculins haute joaillerie.
            </p>

            {/* Official VOIR LA COLLECTION Button */}
            <div>
              <button
                type="button"
                id="btn-voir-la-collection-bottom"
                onClick={() => unlockNav('boutique')}
                className="btn-main btn--solid btn-light-sweep text-xs sm:text-sm tracking-[0.2em] uppercase font-bold py-4 sm:py-5 px-8 sm:px-14 cursor-pointer inline-flex items-center gap-3.5 shadow-[0_0_35px_rgba(209,185,146,0.45)] hover:scale-105 transition-all duration-300 group"
              >
                <span>VOIR LA COLLECTION</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
