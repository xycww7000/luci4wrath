import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useCatalog, saveCatalog } from '../lib/catalog';

export const CategoriesPanel: React.FC = () => {
  const { products, categories } = useCatalog();
  const [newName, setNewName] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const countOf = (cat: string) => products.filter((p) => p.category === cat).length;

  const persist = (nextProducts: typeof products, nextCategories: string[]): boolean => {
    const ok = saveCatalog({ products: nextProducts, categories: nextCategories });
    setError(ok ? '' : 'Sem espaço no navegador para salvar.');
    return ok;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setError('Essa categoria já existe.');
      return;
    }
    if (persist(products, [...categories, name])) setNewName('');
  };

  const handleRename = (idx: number) => {
    const name = editValue.trim();
    const oldName = categories[idx];
    if (!name) return;
    if (name !== oldName && categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setError('Já existe uma categoria com esse nome.');
      return;
    }
    const nextCategories = categories.map((c, i) => (i === idx ? name : c));
    const nextProducts = products.map((p) => (p.category === oldName ? { ...p, category: name } : p));
    if (persist(nextProducts, nextCategories)) setEditingIdx(null);
  };

  const handleDelete = (cat: string) => {
    const count = countOf(cat);
    if (count > 0) {
      setError(`"${cat}" tem ${count} peça(s). Mova ou exclua essas peças antes de remover a categoria.`);
      return;
    }
    if (!window.confirm(`Remover a categoria "${cat}"?`)) return;
    persist(products, categories.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm uppercase tracking-[0.25em] text-white">Categorias</h2>
        <p className="text-[11px] text-zinc-500 mt-1">As categorias aparecem no menu, no rodapé e nos filtros da loja.</p>
      </div>

      {error && <div className="border border-rose-500/40 bg-rose-950/30 p-3 text-[11px] text-rose-300">{error}</div>}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nome da nova categoria (ex: Jaquetas)"
          className="flex-1 bg-zinc-950 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
        />
        <button type="submit" className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </form>

      <div className="border border-white/10 divide-y divide-white/10">
        {categories.length === 0 && <div className="p-6 text-center text-xs text-zinc-500">Nenhuma categoria.</div>}
        {categories.map((cat, idx) => (
          <div key={`${cat}-${idx}`} className="flex items-center gap-3 p-3 bg-zinc-950/60">
            {editingIdx === idx ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(idx);
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
                className="flex-1 bg-black border border-white/30 px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white">{cat}</p>
                <p className="text-[11px] text-zinc-500">{countOf(cat)} peça(s)</p>
              </div>
            )}

            {editingIdx === idx ? (
              <>
                <button onClick={() => handleRename(idx)} className="p-2 text-zinc-300 hover:text-white" title="Salvar">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingIdx(null)} className="p-2 text-zinc-500 hover:text-white" title="Cancelar">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditValue(cat);
                  }}
                  className="p-2 text-zinc-400 hover:text-white"
                  title="Renomear"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat)} className="p-2 text-zinc-400 hover:text-rose-400" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
