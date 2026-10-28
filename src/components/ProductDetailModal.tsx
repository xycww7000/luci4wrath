
import React, { useState } from 'react';
import { Product } from '../data/products';
import {
  X,
  Check,
  Ruler,
  ArrowRight,
  Minus,
  Plus,
  Share2
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
  if (!product) return null;

  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFit, setSelectedFit] = useState(
    product.fits[0] || 'Regular fit'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] || product.sizes[0] || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'cuidados'>('desc');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAddToCart = () => {
    addItem(product, selectedFit, selectedSize, quantity);
    setAddedSuccess(true);

    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | LUCI4WRATH`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <>
      {/* ANIMACOES EXCLUSIVAS LUCI4WRATH */}
      <style>
        {`
          @keyframes luciBackdrop {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes luciModalEntrance {
            from {
              opacity: 0;
              transform: translateY(35px) scale(0.95);
              filter: blur(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes luciImageEntrance {
            from {
              opacity: 0;
              transform: scale(1.08);
              filter: brightness(0.6);
            }
            to {
              opacity: 1;
              transform: scale(1);
              filter: brightness(1);
            }
          }

          @keyframes luciTextEntrance {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes luciSuccess {
            0% {
              transform: scale(0.96);
            }
            50% {
              transform: scale(1.03);
            }
            100% {
              transform: scale(1);
            }
          }

          .luci-backdrop {
            animation: luciBackdrop 0.35s ease-out both;
          }

          .luci-modal {
            animation: luciModalEntrance 0.6s
              cubic-bezier(0.16, 1, 0.3, 1) both;
            will-change: transform, opacity;
          }

          .luci-image {
            animation: luciImageEntrance 0.55s
              cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .luci-image-container {
            overflow: hidden;
          }

          .luci-image-container:hover .luci-image {
            transform: scale(1.045);
          }

          .luci-image {
            transition: transform 0.65s
              cubic-bezier(0.16, 1, 0.3, 1);
          }

          .luci-text {
            animation: luciTextEntrance 0.6s ease-out both;
          }

          .luci-delay-1 {
            animation-delay: 0.12s;
          }

          .luci-delay-2 {
            animation-delay: 0.2s;
          }

          .luci-delay-3 {
            animation-delay: 0.28s;
          }

          .luci-buy-button {
            position: relative;
            overflow: hidden;
            transition:
              background 0.3s ease,
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .luci-buy-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(255,255,255,0.13);
          }

          .luci-buy-button:active:not(:disabled) {
            transform: scale(0.98);
          }

          .luci-success {
            animation: luciSuccess 0.4s ease-out;
          }

          .luci-thumbnail {
            transition:
              opacity 0.3s ease,
              transform 0.3s ease,
              border-color 0.3s ease;
          }

          .luci-thumbnail:hover {
            transform: translateY(-3px);
          }

          .luci-option {
            transition: all 0.25s ease;
          }

          .luci-option:hover {
            transform: translateY(-2px);
          }

          @media (prefers-reduced-motion: reduce) {
            .luci-backdrop,
            .luci-modal,
            .luci-image,
            .luci-text,
            .luci-success {
              animation: none !important;
            }

            .luci-image,
            .luci-buy-button,
            .luci-thumbnail,
            .luci-option {
              transition: none !important;
            }

            .luci-image-container:hover .luci-image {
              transform: none;
            }
          }
        `}
      </style>

      {/* BACKDROP */}
      <div
        className="luci-backdrop fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 md:p-6"
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          className="luci-modal relative w-full max-w-5xl bg-black border border-white/20 text-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 text-zinc-400 hover:text-white bg-black/80 hover:bg-zinc-900 border border-white/20 rounded-full transition-all duration-300 hover:rotate-90"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN - GALLERY */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950/60 overflow-y-auto">

            {/* MAIN PRODUCT IMAGE */}
            <div className="luci-image-container relative w-full pb-[115%] bg-black border border-white/10 mb-4">
              <img
                key={selectedImage}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="luci-image absolute inset-0 w-full h-full object-cover object-center"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] uppercase font-mono font-bold px-2 py-0.5 tracking-wider">
                  {product.badge}
                </span>
              )}

              {/* EDITORIAL DETAIL */}
              <div className="absolute bottom-3 left-3 pointer-events-none">
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/70 bg-black/40 px-2 py-1">
                  LUCI4WRATH / EXCLUSIVE
                </span>
              </div>
            </div>

            {/* THUMBNAILS */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`luci-thumbnail relative flex-shrink-0 w-16 h-20 border ${
                      selectedImage === idx
                        ? 'border-white opacity-100 ring-1 ring-white'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {img.includes('medidas') && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-mono uppercase text-center py-0.5 text-zinc-300">
                        Medidas
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - DETAILS */}
          <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[85vh] flex flex-col justify-between space-y-6">

            <div className="space-y-5">

              {/* CATEGORY AND SHARE */}
              <div className="luci-text luci-delay-1 flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-3">
                <span>LUCI4WRATH / {product.category}</span>

                <button
                  onClick={handleShare}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">
                    Compartilhar
                  </span>
                </button>
              </div>

              {/* PRODUCT TITLE AND PRICE */}
              <div className="luci-text luci-delay-2">
                <h1 className="text-2xl sm:text-3xl font-normal text-white font-heading tracking-wide">
                  {product.name}
                </h1>

                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl font-mono font-medium text-white">
                    R$ {product.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-mono mt-1">
                  ou {product.installments}
                </p>
              </div>

              {/* PRODUCTION NOTICE */}
              <div className="luci-text luci-delay-3 bg-zinc-950 border border-white/20 p-3 rounded text-xs font-mono text-zinc-300 space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{product.details.productionTime}</span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Produção artesanal limitada. Todas as peças passam por acabamento manual exclusivo LUCI4WRATH.
                </p>
              </div>

              {/* FIT SELECTION */}
              {product.fits.length > 1 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Modelagem:{' '}
                      <strong className="text-white">
                        {selectedFit}
                      </strong>
                    </span>

                    <button
                      onClick={onOpenSizeGuide}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Tabela de medidas</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.fits.map((fit) => (
                      <button
                        key={fit}
                        onClick={() => setSelectedFit(fit)}
                        className={`luci-option px-3 py-1.5 text-xs font-mono border ${
                          selectedFit === fit
                            ? 'bg-white text-black font-semibold border-white shadow-sm'
                            : 'bg-black text-zinc-300 border-white/20 hover:border-white/50'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZE SELECTION */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Tamanho:{' '}
                    <strong className="text-white">
                      {selectedSize}
                    </strong>
                  </span>

                  {product.fits.length === 1 && (
                    <button
                      onClick={onOpenSizeGuide}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white underline flex items-center gap-1"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Guia de tamanhos</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`luci-option min-w-[44px] h-10 px-3 flex items-center justify-center text-xs font-mono border ${
                        selectedSize === size
                          ? 'bg-white text-black font-bold border-white shadow-sm'
                          : 'bg-black text-zinc-300 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY AND BUY BUTTON */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">

                {/* QUANTITY */}
                <div className="flex items-center border border-white/30 w-32 justify-between bg-black">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono text-sm px-2 text-white">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* BUY BUTTON */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className={`luci-buy-button flex-1 py-3.5 px-6 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-widest border border-white flex items-center justify-center gap-2 shadow-lg ${
                    addedSuccess ? 'luci-success' : ''
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Adicionado ao Carrinho!</span>
                    </>
                  ) : (
                    <>
                      <span>Adicionar ao Carrinho</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>

              {/* PRODUCT INFORMATION TABS */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex border-b border-white/10 text-xs font-mono uppercase tracking-wider">

                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2 px-3 border-b-2 transition-colors ${
                      activeTab === 'desc'
                        ? 'border-white text-white font-bold'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Descrição
                  </button>

                  <button
                    onClick={() => setActiveTab('cuidados')}
                    className={`pb-2 px-3 border-b-2 transition-colors ${
                      activeTab === 'cuidados'
                        ? 'border-white text-white font-bold'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Cuidados
                  </button>
                </div>

                <div className="pt-3 text-xs text-zinc-300 font-mono leading-relaxed">
                  {activeTab === 'desc' && (
                    <div
                      key="descricao"
                      className="luci-text space-y-2 whitespace-pre-line"
                    >
                      {product.description}
                    </div>
                  )}

                  {activeTab === 'cuidados' && (
                    <ul
                      key="cuidados"
                      className="luci-text space-y-1.5 list-disc list-inside text-zinc-300"
                    >
                      <li>
                        Lavar à mão ou na máquina em ciclo delicado pelo avesso.
                      </li>
                      <li>
                        Não usar alvejantes ou cloro sob hipótese alguma.
                      </li>
                      <li>
                        Secar à sombra em varal (não utilizar secadora).
                      </li>
                      <li>
                        Não passar o ferro diretamente sobre as estampas, strass ou spikes.
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM BRANDING */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
              <span>Produção artesanal LUCI4WRATH</span>
              <span>LUCI4WRATH Official Store</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
