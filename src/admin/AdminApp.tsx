import React, { useState } from 'react';
import { Package, Tags, Database, LogOut, ExternalLink } from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { ProductsPanel } from './ProductsPanel';
import { CategoriesPanel } from './CategoriesPanel';
import { BackupPanel } from './BackupPanel';
import { ADMIN_SESSION_KEY } from './config';

type Tab = 'products' | 'categories' | 'backup';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'products', label: 'Produtos', icon: <Package className="w-4 h-4" /> },
  { id: 'categories', label: 'Categorias', icon: <Tags className="w-4 h-4" /> },
  { id: 'backup', label: 'Backup', icon: <Database className="w-4 h-4" /> },
];

export const AdminApp: React.FC = () => {
  const [authed, setAuthed] = useState<boolean>(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1');
  const [tab, setTab] = useState<Tab>('products');

  if (!authed) {
    return (
      <AdminLogin
        onSuccess={() => {
          sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
          setAuthed(true);
        }}
      />
    );
  }

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-60 md:min-h-screen bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col">
        <div className="p-5 border-b border-white/10 hidden md:block">
          <p className="text-sm uppercase tracking-[0.3em]">cia4w</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">painel admin</p>
        </div>

        <nav className="flex md:flex-col flex-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-5 py-4 text-xs uppercase tracking-wider whitespace-nowrap border-b-2 md:border-b-0 md:border-l-2 transition-colors ${
                tab === t.id
                  ? 'text-white border-white bg-white/5'
                  : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden md:flex flex-col gap-1 p-3 border-t border-white/10">
          <a
            href="#/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ver loja
          </a>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-rose-400">
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl w-full">
        <div className="md:hidden flex justify-between items-center mb-4">
          <a href="#/" className="text-[11px] uppercase tracking-wider text-zinc-400">← Loja</a>
          <button onClick={logout} className="text-[11px] uppercase tracking-wider text-zinc-400">Sair</button>
        </div>

        {tab === 'products' && <ProductsPanel />}
        {tab === 'categories' && <CategoriesPanel />}
        {tab === 'backup' && <BackupPanel />}
      </main>
    </div>
  );
};
