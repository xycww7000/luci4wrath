
import React, { useState, useEffect } from 'react';
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

  return (
    <ProductDetailContent
      key={product.id}
      product={product}
      onClose={onClose}
      onOpenSizeGuide={onOpenSizeGuide}
    />
  );
};

interface ContentProps {
  product: Product;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

const ProductDetailContent: React.FC<ContentProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addItem(product, selectedFit, selectedSize, quantity);
    setAddedSuccess(true);

    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${product.name} | LUCI4WRATH`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado!');
      }
    } catch {
      // Compartilhamento cancelado
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes luciBackdrop {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes luciModalOpen {
            from {
              opacity: 0;
              transform: translateY(22px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes luciPhotoOpen {
            from {
              opacity: 0;
              transform: scale(1.035);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .luci-backdrop {
            animation: luciBackdrop 0.25s ease-out both;
          }

          .luci-modal {
            animation: luciModalOpen 0.4s
              cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .luci-image {
            animation: luciPhotoOpen 0.35s ease-out both;
          }

          .luci-buy-button {
            transition:
              background 0.3s ease,
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .luci-buy-button:hover:not(:disabled) {
            box-shadow: 0 6px 24px rgba(255,255,255,0.14);
          }

          .luci-buy-button:active:not(:disabled) {
            transform: scale(0.98);
          }

          .luci-option {
            transition: all 0.2s ease;
          }

          @media (max-width: 767px) {
            .luci-modal {
              animation: none !important;
              transform: none !important;
            }

            .luci-image {
              animation: none !important;
              transform: none !important;
              object-fit: contain !important;
            }

            .luci-photo-container {
              height: min(34dvh, 280px) !important;
              min-height: 180px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .luci-backdrop,
            .luci-modal,
            .luci-image {
              animation: none !important;
            }

            .luci-buy-button,
            .luci-option {
              transition: none !important;
            }
          }
        `}
      </style>

      {/* FUNDO DO MODAL */}
      <div
        className="luci-backdrop fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden"
        onClick={onClose}
      >

        {/* JANELA PRINCIPAL */}
        <div
          className="luci-modal relative w-full max-w-5xl h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[92dvh] bg-black text-white border border-white/20 shadow-2xl overflow-y-auto overscroll-contain md:overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes de ${product.name}`}
        >

          {/* BOTAO FECHAR */}
          <button
            type="button"
            onClick={onClose}
            className="fixed md:absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/90 border border-white/30 rounded-full text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fechar produto"
          >
            <X className="w-5 h-5" />
          </button>

          {/* GALERIA */}
          <div className="w-full shrink-0 md:shrink md:w-1/2 p-3 sm:p-6 bg-zinc-950/60 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-3 md:overflow-y-auto">

            {/* FOTO PRINCIPAL */}
            <div className="luci-photo-container relative w-full h-[34dvh] min-h-[180px] max-h-[280px] md:h-auto md:min-h-0 md:max-h-none md:aspect-[4/5] bg-black border border-white/10 overflow-hidden">

              <img
                key={selectedImage}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="luci-image absolute inset-0 w-full h-full object-contain md:object-cover object-center"
              />

              {product.badge && (
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-mono font-bold uppercase px-2 py-1 tracking-wider">
                  {product.badge}
                </span>
              )}

              <span className="absolute bottom-2 left-2 bg-black/70 text-white/80 text-[9px] font-mono uppercase tracking-widest px-2 py-1">
                LUCI4WRATH / EXCLUSIVE
              </span>
            </div>

            {/* MINIATURAS */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {product.images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`Ver foto ${idx + 1}`}
                    className={`relative shrink-0 w-12 h-14 sm:w-16 sm:h-20 border transition-all ${
                      selectedImage === idx
                        ? 'border-white opacity-100'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMACOES DO PRODUTO */}
          <div className="w-full min-w-0 shrink-0 md:shrink md:w-1/2 p-4 sm:p-7 flex flex-col gap-5 md:overflow-y-auto md:max-h-[85dvh]">

            {/* CATEGORIA */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider">

              <span className="break-words">
                LUCI4WRATH / {product.category}
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>

            {/* NOME E PRECO */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-3xl font-heading text-white leading-tight break-words">
                {product.name}
              </h1>

              <p className="text-2xl font-mono font-medium text-white">
                R$ {product.price.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>

              <p className="text-xs font-mono text-zinc-400">
                ou {product.installments}
              </p>
            </div>

            {/* PRODUCAO */}
            <div className="bg-zinc-950 border border-white/20 p-3 text-xs font-mono text-zinc-300 space-y-2">
              <div className="flex items-start gap-2 text-white font-semibold">
                <span className="mt-1 w-2 h-2 shrink-0 rounded-full bg-white animate-pulse" />
                <span>{product.details.productionTime}</span>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400">
                Produção artesanal limitada. Todas as peças passam por acabamento manual exclusivo LUCI4WRATH.
              </p>
            </div>

            {/* MODELAGEM */}
            {product.fits.length > 1 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase text-zinc-300">
                    Modelagem:{' '}
                    <strong className="text-white">
                      {selectedFit}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 underline hover:text-white"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Tabela de medidas
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.fits.map((fit) => (
                    <button
                      type="button"
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`luci-option px-3 py-2 text-xs font-mono border ${
                        selectedFit === fit
                          ? 'bg-white text-black font-semibold border-white'
                          : 'bg-black text-zinc-300 border-white/20 hover:border-white/60'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAMANHOS */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-zinc-300">
                  Tamanho:{' '}
                  <strong className="text-white">
                    {selectedSize}
                  </strong>
                </span>

                {product.fits.length === 1 && (
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-[11px] font-mono underline text-zinc-400 hover:text-white"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Guia de tamanhos
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`luci-option min-w-[44px] h-11 px-3 flex items-center justify-center text-xs font-mono border ${
                      selectedSize === size
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black text-zinc-300 border-white/20 hover:border-white/60'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTIDADE E CARRINHO */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">

              {/* QUANTIDADE */}
              <div className="flex items-center justify-between w-32 h-12 shrink-0 border border-white/30 bg-black">

                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="font-mono text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-zinc-400 hover:text-white"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* BOTAO CARRINHO */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="luci-buy-button min-w-0 w-full sm:flex-1 min-h-12 px-4 bg-white hover:bg-zinc-200 text-black border border-white flex items-center justify-center gap-2 font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider disabled:opacity-80"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <span>Adicionar ao Carrinho</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </div>

            {/* DESCRICAO E CUIDADOS */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex gap-4 border-b border-white/10 font-mono text-xs uppercase tracking-wider">

                <button
                  type="button"
                  onClick={() => setActiveTab('desc')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'desc'
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500'
                  }`}
                >
                  Descrição
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cuidados')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'cuidados'
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500'
                  }`}
                >
                  Cuidados
                </button>
              </div>

              <div className="pt-4 text-xs font-mono text-zinc-300 leading-relaxed">

                {activeTab === 'desc' && (
                  <div className="whitespace-pre-line break-words">
                    {product.description}
                  </div>
                )}

                {activeTab === 'cuidados' && (
                  <ul className="space-y-2 list-disc list-inside">
                    <li>
                      Lavar à mão ou na máquina em ciclo delicado pelo avesso.
                    </li>
                    <li>
                      Não usar alvejantes ou cloro.
                    </li>
                    <li>
                      Secar à sombra, sem utilizar secadora.
                    </li>
                    <li>
                      Não passar ferro diretamente sobre estampas, strass ou spikes.
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* RODAPE DO PRODUTO */}
            <div className="border-t border-white/10 pt-4 pb-6 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
              <span>Produção artesanal LUCI4WRATH</span>
              <span>LUCI4WRATH Official Store</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
