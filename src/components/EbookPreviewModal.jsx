import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function EbookPreviewModal({ ebook, isOpen, onClose, onDirectCheckout }) {
  const { addToCart, formatMoney } = useCart();
  const [activeTab, setActiveTab] = useState('presentation'); // 'presentation' | 'sommaire' | 'extrait'

  if (!isOpen || !ebook) return null;

  const detailsMap = {
    e1: {
      pages: 148,
      readTime: '3h 30min',
      format: 'PDF Haute Résolution + Fiches mobiles',
      rating: '5.0/5 (242 avis)',
      synopsis:
        "Comment capter instantanément l'attention dès les 5 premières secondes d'une interaction. Vous apprendrez à développer une présence magnétique naturelle, à poser une voix baryton affirmée et à maîtriser l'art du silence stratégique.",
      summary: [
        { chap: '01', title: 'La Présence Non-Verbale', desc: 'Regard pénétrant, ancrage au sol, gestuelle ouverte et contrôle de l\'espace.' },
        { chap: '02', title: 'L\'Éloquence Hypnotique', desc: 'Le rythme verbal, l\'élimination des tics de langage et l\'art du storytelling percutant.' },
        { chap: '03', title: 'Le Cadre Social & L\'Autorité', desc: 'Comment maintenir son cadre sans agressivité et devenir la référence respectée du groupe.' },
        { chap: '04', title: 'L\'Arsenal Quotidien', desc: 'Exercices pratiques de 7 minutes par jour pour décupler votre impact relationnel.' }
      ],
      excerpt:
        "« Le charisme ne commence pas quand vous ouvrez la bouche. Il commence au moment précis où vous entrez dans la pièce. Votre colonne vertébrale, la détente de vos épaules et la lenteur intentionnelle de vos mouvements envoient un signal neurologique immédiat à votre entourage : cet homme est en paix avec son autorité. »"
    },
    e2: {
      pages: 92,
      readTime: '2h 15min',
      format: 'PDF Interactif + Plan d\'action 30 jours',
      rating: '4.8/5 (138 avis)',
      synopsis:
        "Le manifeste sans concession pour bannir la complaisance, dompter la distraction numérique et reconnecter avec l'énergie brute de l'action masculine.",
      summary: [
        { chap: '01', title: 'L\'Anatomie de la Complaisance', desc: 'Identifier les pièges modernes qui érodent la volonté masculine.' },
        { chap: '02', title: 'Dopamine & Clarté Mentale', desc: 'La cure de détoxification pour retrouver un focus laser et une énergie inaltérable.' },
        { chap: '03', title: 'La Forge de la Discipline', desc: 'Routines matinales impitoyables et transformation physique ciblée.' },
        { chap: '04', title: 'Les 7 Lois de l\'Homme d\'Impact', desc: 'Principes directeurs pour bâtir une vie d\'indépendance et de respect.' }
      ],
      excerpt:
        "« L'homme moderne s'excuse d'exister. Il adoucit ses opinions, hésite avant d'agir et cherche l'approbation constante. La virilité authentique n'est pas le bruit ou l'arrogance : c'est la responsabilité totale de son destin et le courage d'affronter l'inconfort chaque jour. »"
    },
    e3: {
      pages: 176,
      readTime: '4h 10min',
      format: 'PDF + Guides de conversation audio retranscrits',
      rating: '4.9/5 (210 avis)',
      synopsis:
        "La psychologie féminine décryptée avec rigueur et élégance. Apprenez à installer une tension magnétique authentique, de la première approche jusqu'à l'intimité complice.",
      summary: [
        { chap: '01', title: 'L\'Attraction Instinctive', desc: 'Les leviers psychologiques et évolutifs qui déclenchent le désir chez la femme.' },
        { chap: '02', title: 'La Maîtrise de la Conversation', desc: 'Taquinerie calibrée, double sens subtil et gestion du mystère.' },
        { chap: '03', title: 'L\'Escalade Tactile Fluide', desc: 'Transiter d\'une discussion amicale à une connexion intime sans jamais forcer.' },
        { chap: '04', title: 'Sortir de la Friendzone & Conclure', desc: 'Cas d\'études concrets et réponses aux situations imprévues.' }
      ],
      excerpt:
        "« La séduction n'est pas un jeu de persuasion ; c'est un jeu de résonance émotionnelle. Si vous cherchez à impressionner par vos possessions ou vos flatteries, vous perdez la partie. Soyez l'expérience passionnante qu'elle désire vivre. »"
    },
    e4: {
      pages: 110,
      readTime: '2h 45min',
      format: 'PDF + Journal de suivi hebdomadaire',
      rating: '4.9/5 (185 avis)',
      synopsis:
        "Le protocole complet de transmutation énergétique. Libérez-vous de l'addiction pornographique et redirigez toute votre puissance vitale vers vos projets professionnels et sportifs.",
      summary: [
        { chap: '01', title: 'La Neurochimie du Piège', desc: 'Comprendre comment le flux pornographique reprogramme le cerveau à votre détriment.' },
        { chap: '02', title: 'Désamorcer les Déclencheurs', desc: 'Cartographie des heures à risque et techniques d\'interruption instantanée.' },
        { chap: '03', title: 'La Transmutation de l\'Énergie', desc: 'Canaliser la libido vers l\'effort physique, l\'apprentissage et l\'ambition.' },
        { chap: '04', title: 'Le Protocole 90 Jours', desc: 'Feuille de route quotidienne pour reconstruire un système dopaminergique neuf.' }
      ],
      excerpt:
        "« Chaque fois que vous cédez à la facilité d'un écran, vous cédez une part de votre magnétisme et de votre détermination. Votre force sexuelle est votre combustible créatif le plus précieux. Ne le dispersez plus : investissez-le dans votre empire. »"
    },
    e5: {
      pages: 88,
      readTime: '2h 00min',
      format: 'PDF Guide Pratique illustré',
      rating: '4.9/5 (195 avis)',
      synopsis:
        "Guide d'anatomie sensorielle et d'intimité masculine supérieure. Tout ce que l'homme doit maîtriser pour orchestrer une montée progressive de la tension, procurer des sensations inoubliables et marquer l'esprit et le corps de sa partenaire.",
      summary: [
        { chap: '01', title: 'L\'Anticipation Psychologique', desc: 'Faire monter le désir avant même le premier contact physique.' },
        { chap: '02', title: 'La Cartographie Sensorielle', desc: 'Les zones érogènes méconnues et la finesse du toucher progressif.' },
        { chap: '03', title: 'Les Rythmes & Techniques Clés', desc: 'Variations d\'intensité, maîtrise de l\'endurance et lecture des réactions.' },
        { chap: '04', title: 'L\'Empreinte Inoubliable', desc: 'Démystifier les mécanismes d\'extase et s\'ancrer dans sa mémoire.' }
      ],
      excerpt:
        "« Un amant exceptionnel n'est pas celui qui performe avec précipitation, mais celui qui écoute avec ses mains, ses yeux et son souffle. L'attention absolue que vous portez à l'autre est le préliminaire le plus puissant qui soit. »"
    }
  };

  const details = detailsMap[ebook.id] || detailsMap['e5'];

  const handleBuy = () => {
    addToCart({
      id: ebook.id,
      name: ebook.title,
      price: ebook.price,
    });
    onClose();
  };

  const handleInstantCheckout = () => {
    onClose();
    if (onDirectCheckout) {
      onDirectCheckout(ebook);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#0A0C16] text-white border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#04050A]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D1B992]/10 border border-[#D1B992]/30 flex items-center justify-center text-[#D1B992] flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D1B992] font-semibold block">
                Aperçu Exclusif // Éditions VIRIL
              </span>
              <h3 className="font-sans font-bold text-base sm:text-lg text-white leading-tight">
                {ebook.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#D1B992] hover:border-[#D1B992] transition-all cursor-pointer flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-[#0A0C16]">
          {[
            { id: 'presentation', label: 'Présentation' },
            { id: 'sommaire', label: 'Sommaire détaillé' },
            { id: 'extrait', label: 'Extrait offert' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 text-xs sm:text-[13px] uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#D1B992] text-[#D1B992]'
                  : 'border-transparent text-[#9AA0B4] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'presentation' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Cover + Info Split */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* 3D Realistic Book Stage */}
                <div className="w-32 sm:w-40 aspect-[9/13.5] rounded-2xl bg-white overflow-hidden p-3 flex-shrink-0 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <img
                    src={ebook.image}
                    alt={ebook.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.2)]"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#D1B992] font-semibold">
                      Auteur : {ebook.author || 'Dit Kelisse'}
                    </span>
                    <h4 className="font-sans font-bold text-lg sm:text-xl text-white leading-tight mt-0.5">
                      {ebook.title}
                    </h4>
                    {ebook.subtitle && (
                      <p className="font-sans text-xs text-[#9AA0B4] italic mt-1 leading-relaxed">
                        « {ebook.subtitle} »
                      </p>
                    )}
                  </div>

                  {/* Key Specs Pills */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <span className="block font-mono text-xs text-[#D1B992] font-semibold">{details.pages || ebook.pages} pages</span>
                      <span className="text-[9px] uppercase text-[#5E6479]">Volume</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <span className="block font-mono text-xs text-[#D1B992] font-semibold">{details.readTime || ebook.readTime}</span>
                      <span className="text-[9px] uppercase text-[#5E6479]">Lecture</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <span className="block font-mono text-xs text-[#D1B992] font-semibold">PDF HD</span>
                      <span className="text-[9px] uppercase text-[#5E6479]">Format</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <span className="block font-mono text-xs text-[#D1B992] font-semibold">{ebook.rating || '4.9'} / 5</span>
                      <span className="text-[9px] uppercase text-[#5E6479]">Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="font-sans text-xs uppercase tracking-widest text-[#9AA0B4] mb-2 font-semibold">
                  Objectif de transformation
                </h4>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-[#FAF8F5]">
                  {details.synopsis}
                </p>
              </div>

              {/* Guarantees */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D1B992]/10 to-transparent border border-[#D1B992]/20 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-[#D1B992] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#9AA0B4] leading-relaxed">
                  <strong className="text-white font-medium block mb-0.5">Livraison numérique instantanée</strong>
                  Téléchargement immédiat de votre e-book au format PDF optimisé pour smartphone, tablette et ordinateur dès confirmation.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sommaire' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-[#9AA0B4]">
                Structure modulaire conçue pour une application concrète au quotidien :
              </p>
              <div className="space-y-3">
                {details.summary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#D1B992]/10 text-[#D1B992] font-semibold">
                        {item.chap}
                      </span>
                      <h5 className="font-sans font-medium text-sm sm:text-base text-white">
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-xs text-[#9AA0B4] pl-10">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'extrait' && (
            <div className="space-y-4 animate-fade-in">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D1B992] block">
                Extrait offert — Chapitre 1
              </span>
              <div className="p-6 rounded-2xl border border-white/10 bg-[#04050A] relative overflow-hidden">
                <blockquote className="font-serif italic text-base sm:text-lg text-[#FAF8F5] leading-relaxed">
                  {details.excerpt}
                </blockquote>
              </div>
              <p className="text-[11px] text-[#5E6479] text-center italic">
                Extrait protégé par les droits d'auteur Éditions VIRIL — Auteur Dit Kelisse. Tous droits réservés.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-[#04050A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#9AA0B4] uppercase tracking-wider">Prix :</span>
            <span className="font-sans font-bold text-2xl text-[#D1B992]">
              {formatMoney(ebook.price)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleBuy}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.04] text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all text-center cursor-pointer"
            >
              Ajouter au panier
            </button>

            <button
              onClick={handleInstantCheckout}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#D1B992] text-[#04050A] font-semibold text-xs uppercase tracking-wider hover:bg-[#DFCAA0] hover:shadow-[0_0_20px_rgba(209,185,146,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Commander direct</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
