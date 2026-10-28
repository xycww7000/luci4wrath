import React from 'react';

export const BottomBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-black select-none flex items-center justify-center border-t border-white/10">
      <img
        src="/images/lyf4-wraith.png"
        alt="cia4w"
        loading="lazy"
        className="block w-full max-w-[560px] md:max-w-[720px] h-auto object-contain"
      />
    </section>
  );
};
