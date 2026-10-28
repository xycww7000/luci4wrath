import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';

interface ImageFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
}

/** Redimensiona a imagem para caber em maxSide e devolve um data URL JPEG (economiza espaço). */
function fileToDataUrl(file: File, maxSide = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas indisponível'));
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Imagem inválida'));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const ImageField: React.FC<ImageFieldProps> = ({ images, onChange }) => {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const addUrl = () => {
    const clean = url.trim();
    if (!clean) return;
    onChange([...images, clean]);
    setUrl('');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const converted: string[] = [];
      for (const file of Array.from(files)) {
        converted.push(await fileToDataUrl(file));
      }
      onChange([...images, ...converted]);
    } catch {
      setError('Não foi possível ler uma das imagens.');
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group bg-black border border-white/15">
              <img src={img} alt={`Foto ${idx + 1}`} className="w-full aspect-[4/5] object-cover" />
              <span className="absolute top-1 left-1 bg-black/80 text-[9px] px-1.5 py-0.5 text-zinc-300">
                {idx === 0 ? 'Capa' : idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 p-1 bg-black/80 text-zinc-300 hover:text-rose-400"
                aria-label="Remover foto"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => move(idx, -1)} className="bg-black/80 text-[10px] px-1.5 text-zinc-300 hover:text-white">
                  ←
                </button>
                <button type="button" onClick={() => move(idx, 1)} className="bg-black/80 text-[10px] px-1.5 text-zinc-300 hover:text-white">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add by URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Cole a URL da imagem (https://...)"
          className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
        />
        <button
          type="button"
          onClick={addUrl}
          className="px-3 py-2 bg-zinc-800 hover:bg-white hover:text-black text-white text-xs border border-white/20 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> URL
        </button>
      </div>

      {/* Upload from computer */}
      <label className="flex items-center justify-center gap-2 border border-dashed border-white/25 py-3 text-xs text-zinc-400 hover:text-white hover:border-white/50 cursor-pointer transition-colors">
        <Upload className="w-4 h-4" />
        <span>{busy ? 'Processando imagens...' : 'Enviar fotos do computador'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
};
