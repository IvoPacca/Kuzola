/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, Flame, Info, ChevronRight, HelpCircle, UserCheck } from 'lucide-react';
import { Orientation } from './types';
import PhotoEditor from './components/PhotoEditor';
import AdminModal from './components/AdminModal';

export default function App() {
  const [orientation, setOrientation] = useState<Orientation>('vertical');
  
  // Custom templates uploaded via double-click on logo (saved in localStorage)
  const [customVerticalFrame, setCustomVerticalFrame] = useState<string | null>(null);
  const [customHorizontalFrame, setCustomHorizontalFrame] = useState<string | null>(null);
  
  // State to manage the secret admin modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load custom templates on mount from localStorage (instantly) and then from the backend server
  useEffect(() => {
    // 1. Initial quick load from localStorage for fast initial state
    try {
      const savedV = localStorage.getItem('kuzola_custom_vertical');
      const savedH = localStorage.getItem('kuzola_custom_horizontal');
      if (savedV) setCustomVerticalFrame(savedV);
      if (savedH) setCustomHorizontalFrame(savedH);
    } catch (e) {
      console.error('Error loading custom frames from localStorage:', e);
    }

    // 2. Query server for the official stored frames so they stay in sync
    const fetchOfficialFrames = async () => {
      try {
        const res = await fetch('/api/frames');
        if (res.ok) {
          const data = await res.json();
          const timestamp = Date.now();
          // If server has custom vertical/horizontal frames, use them with cache-busting
          if (data.vertical) {
            setCustomVerticalFrame(`${data.vertical}?t=${timestamp}`);
          } else {
            // Only clear if server says there are no official custom frames and we didn't have one
            setCustomVerticalFrame(null);
          }
          if (data.horizontal) {
            setCustomHorizontalFrame(`${data.horizontal}?t=${timestamp}`);
          } else {
            setCustomHorizontalFrame(null);
          }
        }
      } catch (err) {
        console.error('Failed to load official frames from backend server:', err);
      }
    };

    fetchOfficialFrames();
  }, []);

  // Update templates, save in localStorage, and persist on server
  const handleUpdateFrames = async (vertical: string | null, horizontal: string | null) => {
    setCustomVerticalFrame(vertical);
    setCustomHorizontalFrame(horizontal);
    
    // Save to LocalStorage
    try {
      if (vertical) {
        localStorage.setItem('kuzola_custom_vertical', vertical);
      } else {
        localStorage.removeItem('kuzola_custom_vertical');
      }

      if (horizontal) {
        localStorage.setItem('kuzola_custom_horizontal', horizontal);
      } else {
        localStorage.removeItem('kuzola_custom_horizontal');
      }
    } catch (e) {
      console.error('Error saving custom frames to localStorage:', e);
    }

    // Save/persist on backend server
    try {
      await fetch('/api/frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vertical', image: vertical }),
      });

      await fetch('/api/frames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'horizontal', image: horizontal }),
      });
    } catch (err) {
      console.error('Error uploading custom frames to backend server:', err);
    }
  };

  // Helper trigger for double click
  const triggerAdminPanel = () => {
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-between font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative">
      {/* Decorative Background Glowing Orbs & Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-950/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* HEADER SECTION with glassmorphism */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40 transition-all h-20 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          
          {/* Logo & Brand with Double Click Action */}
          <div 
            onDoubleClick={triggerAdminPanel}
            className="flex items-center gap-4 cursor-pointer group select-none py-1.5 px-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
            title="Dê 2 cliques rápidos aqui para carregar molduras personalizadas"
            id="logo-brand-container"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 rounded-lg blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-red-600/20 text-white">
                <Flame className="h-6 w-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans font-black text-lg tracking-tight text-white uppercase">
                  Kuzola <span className="text-red-500">Mukucala</span>
                </h1>
                <span className="text-[9px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest hidden xs:inline-block">
                  Camp
                </span>
              </div>
              <p className="text-xs text-white/50 font-medium">
                Acampamento Oficial &bull; Editor de Memórias
              </p>
            </div>
          </div>

          {/* Quick Stats or Mode Info */}
          <div className="flex items-center gap-3">
            {/* Custom Template Indicators */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block mr-2">
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Status do Sistema</p>
                <p className="text-xs text-white/70 font-semibold">
                  {customVerticalFrame || customHorizontalFrame ? 'Molduras Customizadas Ativas' : 'Molduras Originais Ativas'}
                </p>
              </div>
              <div 
                onClick={triggerAdminPanel}
                className={`cursor-pointer flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-semibold gap-1.5 transition-all active:scale-95 ${
                  customVerticalFrame || customHorizontalFrame 
                    ? 'bg-green-950/20 border-green-500/30 text-green-400' 
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:border-white/30'
                }`}
                title="Configurar Molduras Administrativas"
                id="btn-status-system"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${customVerticalFrame || customHorizontalFrame ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
                <span className="uppercase tracking-widest text-[10px]">Configurar</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN APPLICATION CONTAINER */}
      <main className="flex-grow py-6 sm:py-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/10 via-transparent to-transparent">
        
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
              <Compass className="h-3.5 w-3.5" />
              Amor que Constrói
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white mb-3">
              Guarde suas Melhores Memórias
            </h2>
            <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Adicione as molduras oficiais do Acampamento <strong className="text-white">Kuzola Mukucala</strong> às suas fotos. Escolha entre orientação vertical ou horizontal, ajuste a imagem perfeitamente e faça download gratuito em alta resolução!
            </p>
          </motion.div>
        </div>

        {/* Dynamic Editor Panel */}
        <PhotoEditor
          orientation={orientation}
          setOrientation={setOrientation}
          customVerticalFrame={customVerticalFrame}
          customHorizontalFrame={customHorizontalFrame}
          onLogoDoubleClick={triggerAdminPanel}
        />

        {/* STEP-BY-STEP USER GUIDE with Frosted Glass styling */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 shadow-xl">
            <h3 className="font-sans text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Info className="h-5 w-5 text-red-500" />
              Como Criar sua Foto Personalizada:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/10 border border-red-500/30 text-xs font-bold text-red-500 font-mono">
                    01
                  </span>
                  <h4 className="font-semibold text-sm text-gray-200 tracking-wide uppercase">Escolha o Formato</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed pl-10">
                  Selecione <strong className="text-white/80">Vertical</strong> para fotos de celular ou posts em redes sociais, ou <strong className="text-white/80">Horizontal</strong> para fotos de grupo e paisagens.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/10 border border-red-500/30 text-xs font-bold text-red-500 font-mono">
                    02
                  </span>
                  <h4 className="font-semibold text-sm text-gray-200 tracking-wide uppercase">Envie sua Foto</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed pl-10">
                  Clique na área de upload ou arraste o seu arquivo. A foto será carregada automaticamente por trás da linda moldura do acampamento.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/10 border border-red-500/30 text-xs font-bold text-red-500 font-mono">
                    03
                  </span>
                  <h4 className="font-semibold text-sm text-gray-200 tracking-wide uppercase">Ajuste e Baixe!</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed pl-10">
                  Arraste diretamente na foto ou use os botões e sliders para mover, aproximar ou girar. Depois de ajustar tudo, é só clicar em <strong className="text-white/80">Baixar Foto</strong>!
                </p>
              </div>
            </div>

            {/* Admin Notice */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Área Administrativa do Acampamento</h5>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Você quer usar suas próprias molduras de design externo? Dê <strong className="text-red-400">dois cliques rápidos (double click)</strong> no logo do acampamento no topo da tela para acessar o painel de upload administrativo e enviar arquivos PNG transparentes.
                  </p>
                </div>
              </div>
              <button 
                onClick={triggerAdminPanel}
                className="shrink-0 text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                id="btn-admin-panel-link"
              >
                Acessar Painel <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION with Frosted styling */}
      <footer className="border-t border-white/10 bg-black/20 py-6 text-center text-xs text-white/40 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="tracking-wide">
            &copy; 2026 <span className="text-white/60 font-semibold">Acampamento Kuzola Mukucala</span>. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/40">
            <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-red-500 animate-pulse" /> Amor que Constrói</span>
            <span className="text-white/10">|</span>
            <span>Aventura & Fé</span>
          </div>
        </div>
      </footer>

      {/* THE SECRET ADMIN DRAWER / MODAL */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        customVerticalFrame={customVerticalFrame}
        customHorizontalFrame={customHorizontalFrame}
        onUpdateFrames={handleUpdateFrames}
      />
    </div>
  );
}
