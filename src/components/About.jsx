import React from 'react';

export default function About() {
  const values = [
    {
      num: '01',
      title: 'Qualité premium',
      desc: 'Des matériaux soigneusement sélectionnés et des finitions impeccables. Aucun compromis sur la qualité.',
    },
    {
      num: '02',
      title: 'Authenticité',
      desc: "Une marque née d'une histoire vraie, portée par des valeurs fortes et une mission claire.",
    },
    {
      num: '03',
      title: 'Masculinité moderne',
      desc: 'Allier force et élégance, puissance et raffinement : la virilité réinventée.',
    },
    {
      num: '04',
      title: 'Design intemporel',
      desc: 'Des pièces qui traversent les tendances, conçues pour durer et sublimer votre style.',
    },
  ];

  const processSteps = [
    {
      num: '1. Inspiration et recherche',
      desc: 'Analyse approfondie des tendances masculines, étude des matériaux nobles et définition des symboles de virilité à incarner.',
    },
    {
      num: '2. Conception et design',
      desc: "Création de concepts visuels innovants et développement d'éléments qui expriment la force et l'élégance masculines.",
    },
    {
      num: '3. Fabrication et qualité',
      desc: 'Réalisation minutieuse avec des artisans qualifiés, sélection rigoureuse des matériaux et contrôle qualité exigeant.',
    },
    {
      num: '4. Livraison et satisfaction',
      desc: "Emballage soigné, digne d'un produit premium, expédition sécurisée et accompagnement client pour une expérience mémorable.",
    },
  ];

  return (
    <section id="apropos" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-16 bg-[#04050A] border-t border-white/10 overflow-hidden">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D1B992]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Story & Values Grid (Matching Screenshot 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start mb-24">
          
          {/* Left Column: Notre Histoire */}
          <div className="space-y-6">
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D1B992] font-medium">
              Notre histoire
            </p>

            <h2 className="font-sans font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.1]">
              Une histoire de transformation, d'authenticité et de{' '}
              <span className="font-serif italic text-[#D1B992] font-normal">virilité</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed">
              Pendant longtemps, j'ai été un homme que l'on ne respectait pas, regardé de haut, notamment par les femmes. Je pensais que c'était mon destin, jusqu'au jour où j'ai atteint mon point de rupture.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed">
              J'avais alors deux options : abandonner, ou choisir de m'émanciper. J'ai choisi de me reconstruire, et c'est ainsi que j'ai fait mes premiers pas vers la virilité.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed">
              À partir de ce moment, j'ai travaillé sur moi-même. Le changement a été si profond que j'ai voulu partager cette expérience avec le plus grand nombre.
            </p>

            <p className="font-sans text-sm sm:text-base text-[#9AA0B4] leading-relaxed">
              Une idée s'est alors imposée : pourquoi ne pas créer une marque d'accessoires, <strong className="text-white font-medium">VIRILACCESSORIES</strong>, afin que chaque homme puisse porter la virilité au quotidien ?
            </p>
          </div>

          {/* Right Column: Nos Valeurs */}
          <div className="lg:pl-8">
            <h3 className="font-sans font-medium text-xl sm:text-2xl text-white mb-6">
              Nos valeurs
            </h3>

            <div className="divide-y divide-white/10">
              {values.map((val) => (
                <div key={val.num} className="py-5 grid grid-cols-[auto_1fr] gap-5 items-start">
                  <span className="font-mono text-xs text-[#D1B992] font-semibold pt-1">
                    {val.num}
                  </span>
                  <div>
                    <h4 className="font-sans font-medium text-base sm:text-lg text-white mb-1.5">
                      {val.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#9AA0B4] leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Process Steps (Matching Screenshot 3) */}
        <div>
          <h3 className="font-sans font-medium text-2xl sm:text-3xl text-white text-center mb-12">
            Notre processus créatif
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-[#04050A] hover:border-[#D1B992]/40 transition-all duration-300"
              >
                <span className="block font-mono text-xs text-[#D1B992] font-semibold mb-3">
                  {step.num}
                </span>
                <p className="font-sans text-xs sm:text-[13.5px] text-[#9AA0B4] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
