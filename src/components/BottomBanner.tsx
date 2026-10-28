
import React from 'react';

export const BottomBanner: React.FC = () => {
  return (
    <section
      style={{
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}images/lyf4-wraith.png`}
        alt="LUCI4WRATH"
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '520px',
          height: 'auto',
          maxHeight: '600px',
          objectFit: 'contain',
          margin: '0 auto',
          flexShrink: 1,
        }}
      />
    </section>
  );
};
