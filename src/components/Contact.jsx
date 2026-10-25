import React, { useState } from 'react';
import { ArrowRight, Check, PhoneCall } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 5000);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Bonjour VIRILACCESSORIES,\nJe souhaite vous contacter.\nNom: ${formData.name || 'Client'}\nSujet: ${formData.subject || 'Renseignement'}\nMessage: ${formData.message || 'Bonjour, je souhaite en savoir plus sur vos collections.'}`
    );
    window.open(`https://wa.me/237651024975?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#04050A] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Contact Info (Matching Screenshot 2) */}
          <div className="space-y-6 reveal-on-scroll">
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
              Contact
            </p>

            <h2 className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
              Restons en{' '}
              <span className="font-serif italic text-[#D1B992] font-normal">ligne directe.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed max-w-lg">
              Une question ? Un projet ? Notre équipe se tient à votre disposition pour répondre à toutes vos questions et vous guider dans le choix de vos accessoires premium.
            </p>

            <div className="space-y-5 pt-3">
              <div>
                <span className="block font-sans text-[11px] uppercase tracking-[0.15em] text-[#D1B992] font-medium mb-1">
                  Adresse
                </span>
                <p className="font-sans text-sm sm:text-base text-white">
                  Yaoundé, Cameroun (région du Centre)
                </p>
              </div>

              <div>
                <span className="block font-sans text-[11px] uppercase tracking-[0.15em] text-[#D1B992] font-medium mb-1">
                  E-mail
                </span>
                <p className="font-sans text-sm sm:text-base text-white">
                  virilaccessories@gmail.com
                </p>
              </div>

              <div>
                <span className="block font-sans text-[11px] uppercase tracking-[0.15em] text-[#D1B992] font-medium mb-1">
                  Téléphone
                </span>
                <p className="font-sans text-sm sm:text-base text-white">
                  +237 651 02 49 75 (WhatsApp disponible)
                </p>
              </div>

              <div>
                <span className="block font-sans text-[11px] uppercase tracking-[0.15em] text-[#D1B992] font-medium mb-1">
                  Horaires
                </span>
                <p className="font-sans text-sm sm:text-base text-white leading-relaxed">
                  Lundi au samedi, de 9h00 à 19h00<br />
                  <span className="text-[#5E6479]">Fermé le dimanche</span>
                </p>
              </div>
            </div>

            {/* Social Links Circles (Matching Screenshot 2) */}
            <div className="flex items-center gap-3.5 pt-4">
              <a
                href="https://www.instagram.com/virilaccessories"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center font-sans text-xs text-white hover:bg-[#D1B992] hover:text-[#04050A] hover:border-[#D1B992] transition-all"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://www.tiktok.com/@virilaccessories"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center font-sans text-xs text-white hover:bg-[#D1B992] hover:text-[#04050A] hover:border-[#D1B992] transition-all"
                aria-label="TikTok"
              >
                TK
              </a>
              <a
                href="https://www.facebook.com/share/1CWGRTesDg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center font-sans text-xs text-white hover:bg-[#D1B992] hover:text-[#04050A] hover:border-[#D1B992] transition-all"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://wa.me/237651024975"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center font-sans text-xs text-white hover:bg-[#D1B992] hover:text-[#04050A] hover:border-[#D1B992] transition-all"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form (Matching Screenshot 2) */}
          <div className="bg-[#0A0C16] p-6 sm:p-10 rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] reveal-on-scroll reveal-delay-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block font-sans text-xs font-medium text-[#9AA0B4] mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#04050A] border border-white/10 rounded-lg px-4 py-3.5 font-sans text-sm text-white placeholder-[#5E6479] outline-none focus:border-[#D1B992] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-sans text-xs font-medium text-[#9AA0B4] mb-2">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#04050A] border border-white/10 rounded-lg px-4 py-3.5 font-sans text-sm text-white placeholder-[#5E6479] outline-none focus:border-[#D1B992] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block font-sans text-xs font-medium text-[#9AA0B4] mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+237..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#04050A] border border-white/10 rounded-lg px-4 py-3.5 font-sans text-sm text-white placeholder-[#5E6479] outline-none focus:border-[#D1B992] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-sans text-xs font-medium text-[#9AA0B4] mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#04050A] border border-white/10 rounded-lg px-4 py-3.5 font-sans text-sm text-white outline-none focus:border-[#D1B992] transition-colors"
                  >
                    <option value="" disabled>Sélectionnez un sujet</option>
                    <option value="info">Demande d'information</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Question sur un produit</option>
                    <option value="livraison">Suivi de livraison</option>
                    <option value="retour">Retour ou échange</option>
                    <option value="partenariat">Proposition de partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-sans text-xs font-medium text-[#9AA0B4] mb-2">
                  Votre message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#04050A] border border-white/10 rounded-lg px-4 py-3.5 font-sans text-sm text-white placeholder-[#5E6479] outline-none focus:border-[#D1B992] transition-colors resize-y"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-main btn--solid flex-1 cursor-pointer"
                >
                  <span>Envoyer le message</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="btn-main btn--line cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D1B992]" />
                  <span>WhatsApp direct</span>
                </button>
              </div>

              {submitted && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-sans text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4" />
                  <span>Merci — votre message a bien été envoyé. Notre équipe vous répond sous 24h.</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
