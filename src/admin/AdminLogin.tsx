import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ADMIN_PASSWORD } from './config';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-zinc-950 border border-white/15 p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <Lock className="w-7 h-7 mx-auto text-zinc-400" />
          <h1 className="text-lg uppercase tracking-[0.3em]">cia4w admin</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider">Área restrita</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-wider text-zinc-400">Senha</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full bg-black border border-white/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white"
          />
          {error && <p className="text-[11px] text-rose-400">Senha incorreta.</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
        >
          Entrar
        </button>

        <a href="#/" className="block text-center text-[11px] text-zinc-500 hover:text-white uppercase tracking-wider">
          ← Voltar para a loja
        </a>
      </form>
    </div>
  );
};
