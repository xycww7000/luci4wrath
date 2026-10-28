
import React from 'react';

export const HeroVideo: React.FC = () => {
  return (
    <section
      className="relative w-full bg-black flex items-center justify-center overflow-hidden"
      style={{
        padding: '24px 16px',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}images/lyf4-wraith.png`}
        alt="LUCI4WRATH"
        loading="eager"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '650px',
          height: 'auto',
          maxHeight: '650px',
          objectFit: 'contain',
          margin: '0 auto',
        }}
      />
    </section>
  );
};
