
import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  User,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../lib/catalog';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenAuth: () => void;
  onOpenTracking: () => void;
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  activeView: 'home' | 'produtos' | 'contato';
  setActiveView: (view: 'home' | 'produtos' | 'contato') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMenu,
  onOpenAuth,
  onOpenTracking,
  currentCategory,
  onSelectCategory,
  activeView,
  setActiveView,
}) => {
  const { openCart, itemCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { categories: catalogCategories } = useCatalog();

  const categories = [
    { label: 'Todos os produtos', value: 'all' },
    ...catalogCategories.map((c) => ({
      label: c,
      value: c,
    })),
  ];

  const goHome = () => {
    setActiveView('home');
    onSelectCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full min-w-0 bg-black/95 backdrop-blur-md border-b border-white/10">

      {/* BARRA SUPERIOR */}
      <div className="w-full bg-zinc-950 border-b border-white/5 px-3 py-2 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-700" />

          <span className="min-w-0 text-[8px] min-[375px]:text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.08em] sm:tracking-widest text-zinc-200">
            DROP 01 // LUCI4WRATH ONLINE — PEÇAS LIMITADAS
          </span>

          <span className="hidden md:inline text-zinc-500">
            •
          </span>

          <span className="hidden md:inline text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            PRODUÇÃO ARTESANAL / SÃO PAULO
          </span>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-5 lg:px-8">

        {/* CABEÇALHO RESPONSIVO */}
        <div className="grid grid-cols-[44px_minmax(0,1fr)_88px] md:grid-cols-[1fr_auto_1fr] items-center w-full min-w-0 h-[68px] sm:h-20 md:h-24 gap-1">

          {/* ESQUERDA */}
          <div className="flex items-center justify-start min-w-0">

            {/* MENU CELULAR */}
            <button
              type="button"
              onClick={onOpenMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center shrink-0 text-white/90 hover:text-white transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* BUSCA COMPUTADOR */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 text-white/80 hover:text-white group transition-colors px-2 py-1.5 rounded border border-transparent hover:border-white/10"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />

              <span className="text-xs uppercase tracking-widest font-mono text-zinc-400 group-hover:text-white">
                Buscar
              </span>
            </button>
          </div>

          {/* LOGO CENTRAL */}
          <div className="flex items-center justify-center min-w-0 w-full overflow-hidden">

            <button
              type="button"
              onClick={goHome}
              className="flex items-center justify-center w-full min-w-0 max-w-full focus:outline-none"
              aria-label="Ir para o início da LUCI4WRATH"
            >
              {/* MOBILE: tamanho próprio, sem scale */}
              <span className="md:hidden block w-full min-w-0 text-center font-black font-heading uppercase tracking-[-0.065em] text-white text-[clamp(13px,4.4vw,23px)] leading-none whitespace-nowrap">
                LUCI<span className="text-zinc-400">4</span>WRATH
              </span>

              {/* DESKTOP: logo original */}
              <div className="hidden md:flex items-center justify-center">
                <Logo size="md" />
              </div>
            </button>
          </div>

          {/* DIREITA */}
          <div className="flex items-center justify-end gap-0 sm:gap-2 md:gap-4 min-w-0">

            {/* LUPA CELULAR */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="md:hidden w-10 h-10 flex items-center justify-center shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* CONTA COMPUTADOR */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors py-1.5 px-2 rounded border border-transparent hover:border-white/10"
              aria-label="Conta"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span className="text-[11px]">Conta</span>
            </button>

            {/* CARRINHO */}
            <button
              type="button"
              onClick={openCart}
              className="relative w-11 h-11 flex items-center justify-center shrink-0 text-white hover:text-zinc-200 focus:outline-none transition-transform active:scale-95 group"
              aria-label="Carrinho de compras"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform" />

              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MENU COMPUTADOR */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-2.5 border-t border-white/5 text-xs font-mono uppercase tracking-[0.2em]">

          <button
            type="button"
            onClick={goHome}
            className={`transition-colors py-1 px-2 border-b-2 ${
              activeView === 'home' && currentCategory === 'all'
                ? 'text-white border-white'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            Início
          </button>

          {/* PRODUTOS */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setActiveView('produtos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1 transition-colors py-1 px-2 border-b-2 ${
                activeView === 'produtos' || currentCategory !== 'all'
                  ? 'text-white border-white'
                  : 'text-zinc-400 hover:text-white border-transparent'
              }`}
            >
              <span>Produtos</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[2] opacity-70" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-zinc-950 border border-white/15 shadow-2xl py-2 mt-1 z-50">

                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.value}
                    onClick={() => {
                      onSelectCategory(cat.value);
                      setActiveView('produtos');
                      setDropdownOpen(false);

                      const el = document.getElementById(
                        'catalogo-section'
                      );

                      if (el) {
                        el.scrollIntoView({
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`block w-full text-left px-4 py-2 text-[11px] tracking-wider transition-colors ${
                      currentCategory === cat.value
                        ? 'bg-white text-black font-semibold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CONTATO */}
          <button
            type="button"
            onClick={() => {
              setActiveView('contato');
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
            className={`transition-colors py-1 px-2 border-b-2 ${
              activeView === 'contato'
                ? 'text-white border-white'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            Contato
          </button>

          {/* RASTREAMENTO */}
          <button
            type="button"
            onClick={onOpenTracking}
            className="text-zinc-400 hover:text-white transition-colors py-1 px-2 border-b-2 border-transparent"
          >
            Rastrear Pedido
          </button>
        </nav>
      </div>
    </header>
  );
};
