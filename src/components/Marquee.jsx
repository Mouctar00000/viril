import React from 'react';

export default function Marquee() {
  const items = [
    'Maroquinerie',
    'Montres',
    'Bracelets',
    'Petite maroquinerie',
    'E-books',
    'Soins',
  ];

  const fullList = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full border-y border-white/10 bg-[#0A0C16] overflow-hidden py-4 select-none">
      <div className="animate-marquee flex items-center">
        {fullList.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14 font-sans text-[10.5px] uppercase tracking-[0.3em] text-[#9AA0B4] whitespace-nowrap"
          >
            <span>{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D1B992] opacity-80 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
