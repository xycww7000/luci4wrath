
import React from 'react';

export const BottomBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-black select-none flex items-center justify-center border-t border-white/10">
      <img
        src={`${import.meta.env.BASE_URL}images/lyf4-wraith.png`}
        alt="LUCI4WRATH"
        loading="lazy"
        className="block w-full max-w-[560px] md:max-w-[720px] h-auto object-contain"
      />
    </section>
  );
};
