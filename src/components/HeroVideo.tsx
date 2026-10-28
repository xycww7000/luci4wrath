import React from 'react';

export const HeroVideo: React.FC = () => {
  return (
    <section className="relative w-full bg-black select-none flex items-center justify-center">
      <img
        src="/images/lyf4-wraith.png"
        alt="cia4w"
        className="block w-full max-w-[560px] md:max-w-[720px] h-auto object-contain"
      />
    </section>
  );
};
