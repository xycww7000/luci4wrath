import React, { useState } from 'react';
import { Product } from '../data/products';
import { ImageField } from './ImageField';
import { X } from 'lucide-react';

interface ProductFormProps {
  initial: Product | null;
  categories: string[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const splitList = (value: string) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const money = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inputClass =
  'w-full bg-black border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white';
const labelClass = 'block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5';

export const ProductForm: React.FC<ProductFormProps> = ({ initial, categories, onSave, onCancel }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? categories[0] ?? '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [color, setColor] = useState(initial?.color ?? '');
  const [badge, setBadge] = useState(initial?.badge ?? '');
  const [sizes, setSizes] = useState(initial ? initial.sizes.join(', ') : 'P, M, G, GG');
  const [fits, setFits] = useState(initial ? initial.fits.join(', ') : 'Regular fit');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [productionTime, setProductionTime] = useState(initial?.details.productionTime ?? '15 a 20 dias úteis');
  const [fabric, setFabric] = useState(initial?.details.fabric ?? '100% algodão');
  const [weight, setWeight] = useState(initial?.details.weight ?? '180g');
  const [visible, setVisible] = useState(initial ? initial.visible !== false : true);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(String(price).replace(',', '.'));
    const problems: string[] = [];
    if (!name.trim()) problems.push('Informe o nome da peça.');
    if (!category) problems.push('Selecione uma categoria (crie uma na aba Categorias se necessário).');
    if (!priceNumber || priceNumber <= 0) problems.push('Informe um preço válido.');
    if (images.length === 0) problems.push('Adicione pelo menos uma foto.');
    if (problems.length) {
      setErrors(problems);
      return;
    }

    const product = {
      ...(initial ?? {}),
      id: initial?.id ?? `prod-${Date.now()}`,
      slug: initial?.slug ?? `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
      name: name.trim(),
      category,
      price: priceNumber,
      installments: `3x de R$ ${money(priceNumber / 3)} sem juros`,
      freeShipping: false,
      color: color.trim() || 'Preta',
      badge: badge.trim() || undefined,
      images,
      fits: splitList(fits).length ? splitList(fits) : ['Regular fit'],
      sizes: splitList(sizes).length ? splitList(sizes) : ['Único'],
      description,
      details: {
        ...(initial?.details ?? {}),
        productionTime: productionTime.trim(),
        fabric: fabric.trim(),
        weight: weight.trim(),
      },
      visible,
    } as Product;

    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto font-mono text-white">
      <div className="min-h-full flex items-start justify-center p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-zinc-950 border border-white/15">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-sm uppercase tracking-[0.25em]">
              {initial ? 'Editar peça' : 'Nova peça'}
            </h2>
            <button type="button" onClick={onCancel} className="p-1.5 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {errors.length > 0 && (
              <div className="border border-rose-500/40 bg-rose-950/30 p-3 text-[11px] text-rose-300 space-y-1">
                {errors.map((er) => (
                  <p key={er}>• {er}</p>
                ))}
              </div>
            )}

            {/* Basic info */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nome da peça *</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Camiseta [NOME]" />
              </div>
              <div>
                <label className={labelClass}>Categoria *</label>
                <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.length === 0 && <option value="">Sem categorias</option>}
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Preço (R$) *</label>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="160,00"
                />
              </div>
              <div>
                <label className={labelClass}>Cor</label>
                <input className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} placeholder="Preta" />
              </div>
              <div>
                <label className={labelClass}>Selo (opcional)</label>
                <input className={inputClass} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Ex: Pronta Entrega" />
              </div>
            </section>

            {/* Variants */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className={labelClass}>Tamanhos (separe por vírgula)</label>
                <input className={inputClass} value={sizes} onChange={(e) => setSizes(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Modelagens (separe por vírgula)</label>
                <input className={inputClass} value={fits} onChange={(e) => setFits(e.target.value)} placeholder="Baby tee, Boxy, Oversized" />
              </div>
            </section>

            {/* Details */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className={labelClass}>Prazo de produção</label>
                <input className={inputClass} value={productionTime} onChange={(e) => setProductionTime(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tecido</label>
                <input className={inputClass} value={fabric} onChange={(e) => setFabric(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Gramatura</label>
                <input className={inputClass} value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>Descrição</label>
                <textarea
                  rows={6}
                  className={inputClass}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={'• Malha: 100% algodão\n• Gramatura: 180g\n• Estampa em DTG'}
                />
              </div>
            </section>

            {/* Photos */}
            <section className="space-y-2">
              <label className={labelClass}>Fotos * (a primeira é a capa)</label>
              <ImageField images={images} onChange={setImages} />
            </section>

            {/* Visibility */}
            <label className="flex items-center gap-3 text-xs cursor-pointer select-none">
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="w-4 h-4 accent-white" />
              <span>Visível na loja</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 p-5 border-t border-white/10">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 text-xs uppercase text-zinc-400 hover:text-white">
              Cancelar
            </button>
            <button type="submit" className="px-7 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200">
              Salvar peça
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
