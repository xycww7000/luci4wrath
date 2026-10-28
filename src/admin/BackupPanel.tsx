import React, { useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { exportCatalog, importCatalog, resetCatalog } from '../lib/catalog';

export const BackupPanel: React.FC = () => {
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handleExport = () => {
    const blob = new Blob([exportCatalog()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cia4w-catalogo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'Backup exportado.', ok: true });
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const ok = importCatalog(text);
    setMessage(
      ok
        ? { text: 'Catálogo importado com sucesso.', ok: true }
        : { text: 'Arquivo inválido. Use um backup exportado por este painel.', ok: false }
    );
  };

  const handleReset = () => {
    if (!window.confirm('Restaurar o catálogo original? Todas as alterações feitas no painel serão perdidas.')) return;
    resetCatalog();
    setMessage({ text: 'Catálogo original restaurado.', ok: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm uppercase tracking-[0.25em] text-white">Backup</h2>
        <p className="text-[11px] text-zinc-500 mt-1">
          Os dados são salvos neste navegador. Exporte um backup para levar as alterações para outro computador ou navegador.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 text-[11px] border ${
            message.ok ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20' : 'border-rose-500/40 text-rose-300 bg-rose-950/30'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={handleExport} className="p-5 border border-white/15 bg-zinc-950 hover:border-white/40 text-left space-y-2">
          <Download className="w-5 h-5 text-zinc-300" />
          <p className="text-xs text-white uppercase tracking-wider">Exportar catálogo</p>
          <p className="text-[11px] text-zinc-500">Baixa um arquivo .json com todas as peças e categorias.</p>
        </button>

        <label className="p-5 border border-white/15 bg-zinc-950 hover:border-white/40 text-left space-y-2 cursor-pointer">
          <Upload className="w-5 h-5 text-zinc-300" />
          <p className="text-xs text-white uppercase tracking-wider">Importar catálogo</p>
          <p className="text-[11px] text-zinc-500">Carrega um backup .json e substitui o catálogo atual.</p>
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              handleImport(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>

        <button onClick={handleReset} className="p-5 border border-white/15 bg-zinc-950 hover:border-rose-500/50 text-left space-y-2">
          <RotateCcw className="w-5 h-5 text-zinc-300" />
          <p className="text-xs text-white uppercase tracking-wider">Restaurar original</p>
          <p className="text-[11px] text-zinc-500">Volta ao catálogo inicial da loja.</p>
        </button>
      </div>
    </div>
  );
};
