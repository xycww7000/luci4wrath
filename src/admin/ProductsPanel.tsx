import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { Product } from '../data/products';
import { useCatalog, saveCatalog, isVisible } from '../lib/catalog';
import { ProductForm } from './ProductForm';

export const ProductsPanel: React.FC = () => {
  const { products, categories } = useCatalog();
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState('');

  const persist = (next: Product[]): boolean => {
    const ok = saveCatalog({ products: next, categories });
    setError(ok ? '' : 'Sem espaço no navegador para salvar. Remova fotos ou use links de imagem (URL).');
    return ok;
  };

  const handleSave = (product: Product) => {
    const exists = products.some((p) => p.id === product.id);
    const next = exists ? products.map((p) => (p.id === product.id ? product : p)) : [product, ...products];
    if (persist(next)) setEditing(null);
  };

  const handleDelete = (product: Product) => {
    if (!window.confirm(`Excluir "${product.name}"? Essa ação não pode ser desfeita.`)) return;
    persist(products.filter((p) => p.id !== product.id));
  };

  const toggleVisible = (product: Product) => {
    persist(products.map((p) => (p.id === product.id ? { ...p, visible: !isVisible(p) } : p)));
  };

  const filtered = products.filter((p) => {
    const matchQuery = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchQuery && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm uppercase tracking-[0.25em] text-white">Produtos</h2>
          <p className="text-[11px] text-zinc-500 mt-1">
            {products.length} peças cadastradas · {products.filter(isVisible).length} visíveis na loja
          </p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200"
        >
          <Plus className="w-4 h-4" /> Nova peça
        </button>
      </div>

      {error && <div className="border border-rose-500/40 bg-rose-950/30 p-3 text-[11px] text-rose-300">{error}</div>}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar peça pelo nome..."
            className="w-full bg-zinc-950 border border-white/15 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-950 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="border border-white/10 divide-y divide-white/10">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500">Nenhuma peça encontrada.</div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3 bg-zinc-950/60 hover:bg-zinc-950">
            <img src={p.images[0]} alt={p.name} className="w-14 h-[70px] object-cover bg-black border border-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs text-white truncate">{p.name}</h3>
                {!isVisible(p) && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-white/20 text-zinc-400">Oculta</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {p.category} · R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · {p.images.length} foto(s)
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleVisible(p)}
                className="p-2 text-zinc-400 hover:text-white"
                title={isVisible(p) ? 'Ocultar da loja' : 'Mostrar na loja'}
              >
                {isVisible(p) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditing(p)} className="p-2 text-zinc-400 hover:text-white" title="Editar">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p)} className="p-2 text-zinc-400 hover:text-rose-400" title="Excluir">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductForm
          initial={editing === 'new' ? null : editing}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};
