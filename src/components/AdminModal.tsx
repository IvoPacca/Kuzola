/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, RotateCcw, Image, Check, Sparkles } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  customVerticalFrame: string | null;
  customHorizontalFrame: string | null;
  onUpdateFrames: (vertical: string | null, horizontal: string | null) => void;
}

export default function AdminModal({
  isOpen,
  onClose,
  customVerticalFrame,
  customHorizontalFrame,
  onUpdateFrames,
}: AdminModalProps) {
  const [vPreview, setVPreview] = useState<string | null>(customVerticalFrame);
  const [hPreview, setHPreview] = useState<string | null>(customHorizontalFrame);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const vInputRef = useRef<HTMLInputElement>(null);
  const hInputRef = useRef<HTMLInputElement>(null);

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'vertical' | 'horizontal') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'vertical') {
        setVPreview(result);
      } else {
        setHPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onUpdateFrames(vPreview, hPreview);
    setCopiedSuccess(true);
    setTimeout(() => {
      setCopiedSuccess(false);
      onClose();
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja restaurar as molduras padrão do Acampamento Kuzola Mukucala?')) {
      setVPreview(null);
      setHPreview(null);
      onUpdateFrames(null, null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-slate-950/85 backdrop-blur-xl text-white shadow-2xl shadow-red-600/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-red-500 animate-pulse" />
                <div>
                  <h3 className="font-sans text-xl font-bold tracking-tight">Gerenciador de Molduras</h3>
                  <p className="text-xs text-white/50">Defina os arquivos PNG transparentes para o site</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
                id="btn-close-admin-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-white/70 leading-relaxed">
                Olá Organizador! Aqui você pode alterar as molduras padrão de forma simples. Faça upload de imagens no formato <strong className="text-red-400 font-semibold">PNG transparente</strong>. Se desejar voltar aos designs originais do Kuzola, basta clicar no botão de reset abaixo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vertical Slot */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm tracking-wider uppercase text-red-400">Moldura Vertical</span>
                      <span className="text-xs text-white/40">Proporção 4:5</span>
                    </div>
                    
                    <div 
                      onClick={() => vInputRef.current?.click()}
                      className="group relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-[#020617]/50 transition-all hover:border-red-500 hover:bg-white/5"
                    >
                      {vPreview ? (
                        <div className="relative h-full w-full p-2 flex items-center justify-center">
                          <img 
                            src={vPreview} 
                            alt="Vertical Preview" 
                            className="max-h-full max-w-full object-contain rounded"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="rounded-full bg-white/5 p-3 text-white/50 group-hover:text-red-400 transition-colors">
                            <Image className="h-6 w-6" />
                          </div>
                          <span className="mt-2 text-xs font-medium text-white/70">Nenhuma moldura personalizada</span>
                          <span className="mt-1 text-[10px] text-white/40">Clique para enviar PNG (1200x1500)</span>
                        </div>
                      )}
                      <input 
                        ref={vInputRef}
                        type="file" 
                        accept="image/png" 
                        className="hidden" 
                        onChange={(e) => handleFrameUpload(e, 'vertical')}
                        id="input-upload-frame-vertical"
                      />
                    </div>
                  </div>

                  {vPreview && (
                    <button
                      onClick={() => setVPreview(null)}
                      className="mt-3 w-full rounded-xl bg-red-950/40 py-1.5 text-xs font-semibold text-red-400 border border-red-900/60 hover:bg-red-900/60 transition-colors"
                      id="btn-remove-custom-vertical"
                    >
                      Remover Personalizada
                    </button>
                  )}
                </div>

                {/* Horizontal Slot */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm tracking-wider uppercase text-red-400">Moldura Horizontal</span>
                      <span className="text-xs text-white/40">Proporção 1:1</span>
                    </div>

                    <div 
                      onClick={() => hInputRef.current?.click()}
                      className="group relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-[#020617]/50 transition-all hover:border-red-500 hover:bg-white/5"
                    >
                      {hPreview ? (
                        <div className="relative h-full w-full p-2 flex items-center justify-center">
                          <img 
                            src={hPreview} 
                            alt="Horizontal Preview" 
                            className="max-h-full max-w-full object-contain rounded"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="rounded-full bg-white/5 p-3 text-white/50 group-hover:text-red-400 transition-colors">
                            <Image className="h-6 w-6" />
                          </div>
                          <span className="mt-2 text-xs font-medium text-white/70">Nenhuma moldura personalizada</span>
                          <span className="mt-1 text-[10px] text-white/40">Clique para enviar PNG (1080x1080)</span>
                        </div>
                      )}
                      <input 
                        ref={hInputRef}
                        type="file" 
                        accept="image/png" 
                        className="hidden" 
                        onChange={(e) => handleFrameUpload(e, 'horizontal')}
                        id="input-upload-frame-horizontal"
                      />
                    </div>
                  </div>

                  {hPreview && (
                    <button
                      onClick={() => setHPreview(null)}
                      className="mt-3 w-full rounded-xl bg-red-950/40 py-1.5 text-xs font-semibold text-red-400 border border-red-900/60 hover:bg-red-900/60 transition-colors"
                      id="btn-remove-custom-horizontal"
                    >
                      Remover Personalizada
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-black/40 px-6 py-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-red-400 transition-colors"
                id="btn-reset-frames"
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar Originais do Kuzola
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                  id="btn-cancel-admin"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all text-white shadow-lg shadow-red-900/40"
                  id="btn-save-admin"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      Salvo!
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
