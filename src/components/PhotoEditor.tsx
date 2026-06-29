/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Sliders, 
  RotateCcw, 
  Image as ImageIcon,
  CheckCircle,
  Sparkles,
  Move,
  Grid
} from 'lucide-react';
import { Orientation, ImageAdjustments } from '../types';
import { DEFAULT_VERTICAL_SVG, DEFAULT_HORIZONTAL_SVG, svgToDataUrl as toUrl } from './DefaultFrames';

interface PhotoEditorProps {
  orientation: Orientation;
  setOrientation: (o: Orientation) => void;
  customVerticalFrame: string | null;
  customHorizontalFrame: string | null;
  onLogoDoubleClick: () => void;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  x: 0,
  y: 0,
  scale: 1.0,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export default function PhotoEditor({
  orientation,
  setOrientation,
  customVerticalFrame,
  customHorizontalFrame,
  onLogoDoubleClick,
}: PhotoEditorProps) {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isHoveredCanvas, setIsHoveredCanvas] = useState(false);

  // Resolution parameters based on orientation
  const canvasWidth = orientation === 'vertical' ? 1200 : 1080;
  const canvasHeight = orientation === 'vertical' ? 1500 : 1080;

  // Center of cutout window
  // Vertical cutout: left 80, top 140, width 1040, height 1160. Center is (600, 720)
  // Horizontal cutout (now 1080x1080): left 70, top 120, width 940, height 810. Center is (540, 525)
  const cutoutCenterX = orientation === 'vertical' ? 600 : 540;
  const cutoutCenterY = orientation === 'vertical' ? 720 : 525;

  // Update current frame image source when orientation or custom frames change
  useEffect(() => {
    const img = new Image();
    let src = '';

    if (orientation === 'vertical') {
      src = customVerticalFrame || toUrl(DEFAULT_VERTICAL_SVG);
    } else {
      src = customHorizontalFrame || toUrl(DEFAULT_HORIZONTAL_SVG);
    }

    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      setFrameImg(img);
    };
  }, [orientation, customVerticalFrame, customHorizontalFrame]);

  // Handle uploaded photo source change
  useEffect(() => {
    if (!photoSrc) {
      setPhotoImg(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;
    img.onload = () => {
      setPhotoImg(img);
      // Reset adjustments when uploading a new image to ensure best starting layout
      setAdjustments(DEFAULT_ADJUSTMENTS);
    };
  }, [photoSrc]);

  // Main canvas drawing engine
  const drawCanvas = (ctx: CanvasRenderingContext2D, isExport: boolean) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw photo if exists
    if (photoImg) {
      ctx.save();

      // Set adjustments (brightness, contrast, saturation)
      const b = adjustments.brightness;
      const c = adjustments.contrast;
      const s = adjustments.saturation;
      ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;

      // Translate to the cutout's center so scaling and rotation occur around the center of the cutout frame
      ctx.translate(cutoutCenterX + adjustments.x, cutoutCenterY + adjustments.y);

      // Rotate around cutout center
      ctx.rotate((adjustments.rotation * Math.PI) / 180);

      // Scale (relative to cutout fit)
      // We calculate ideal starting scale to fit photo snugly within the frame viewport
      const viewportWidth = orientation === 'vertical' ? 1040 : 940;
      const viewportHeight = orientation === 'vertical' ? 1160 : 810;
      
      const scaleX = viewportWidth / photoImg.width;
      const scaleY = viewportHeight / photoImg.height;
      // Fit-cover by default
      const fitScale = Math.max(scaleX, scaleY);
      const finalScale = fitScale * adjustments.scale;

      ctx.scale(finalScale, finalScale);

      // Draw centered at (0, 0)
      ctx.drawImage(photoImg, -photoImg.width / 2, -photoImg.height / 2);
      ctx.restore();
    } else {
      // Draw background placeholder if no photo
      ctx.fillStyle = '#080d20';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw standard hint text
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhuma foto adicionada', canvasWidth / 2, canvasHeight / 2 - 30);
      ctx.font = '24px sans-serif';
      ctx.fillText('Clique ou arraste sua foto na área ao lado', canvasWidth / 2, canvasHeight / 2 + 10);
    }

    // 2. Draw frame on top
    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);
    }
  };

  // Re-render preview canvas whenever image, frame, or adjustments update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCanvas(ctx, false);
  }, [photoImg, frameImg, adjustments, orientation, canvasWidth, canvasHeight]);

  // File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoSrc(result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoSrc(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop / Canvas mouse interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!photoImg) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !photoImg) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Get actual displaying canvas bounds
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const bounds = canvasEl.getBoundingClientRect();

    // Scale movement according to virtual resolution vs viewport display resolution
    const scaleFactor = canvasWidth / bounds.width;

    // Shift coordinates
    setAdjustments(prev => ({
      ...prev,
      x: prev.x + deltaX * scaleFactor,
      y: prev.y + deltaY * scaleFactor,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // D-Pad Incremental Adjustments (Esquerda, Direita, Cima, Baixo)
  const adjustPosition = (direction: 'up' | 'down' | 'left' | 'right', amount = 15) => {
    if (!photoImg) return;
    setAdjustments(prev => {
      let dx = 0;
      let dy = 0;
      if (direction === 'left') dx = -amount;
      if (direction === 'right') dx = amount;
      if (direction === 'up') dy = -amount;
      if (direction === 'down') dy = amount;

      return {
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      };
    });
  };

  // Zoom manipulation
  const adjustZoom = (type: 'in' | 'out' | number) => {
    if (!photoImg) return;
    setAdjustments(prev => {
      let newScale = prev.scale;
      if (type === 'in') newScale = Math.min(4.0, prev.scale + 0.05);
      else if (type === 'out') newScale = Math.max(0.1, prev.scale - 0.05);
      else if (typeof type === 'number') newScale = type;

      return { ...prev, scale: Number(newScale.toFixed(2)) };
    });
  };

  // Rotation manipulation
  const rotatePhoto = (direction: 'cw' | 'ccw' | number) => {
    if (!photoImg) return;
    setAdjustments(prev => {
      let rot = prev.rotation;
      if (direction === 'cw') rot = (prev.rotation + 90) % 360;
      else if (direction === 'ccw') rot = (prev.rotation - 90 + 360) % 360;
      else if (typeof direction === 'number') rot = direction;

      return { ...prev, rotation: rot };
    });
  };

  // Reset to initial settings
  const handleResetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  };

  // Export & Download handler
  const handleDownload = () => {
    if (!photoImg) {
      alert('Por favor, faça upload de uma foto antes de baixar.');
      return;
    }

    // Create high resolution offline canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw full-res
    drawCanvas(ctx, true);

    // Download image
    const link = document.createElement('a');
    link.download = `kuzola-mukucala-${orientation}-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Success feedback
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-4 py-6">
      {/* LEFT COLUMN: INTERACTIVE CANVAS CONTAINER */}
      <div className="lg:col-span-7 flex flex-col items-center">
        {/* Orientation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 shadow-inner">
          <button
            onClick={() => {
              setOrientation('vertical');
              handleResetAdjustments();
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              orientation === 'vertical'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            id="tab-vertical"
          >
            <Grid className="h-4 w-4 rotate-90" />
            Vertical (4:5)
          </button>
          <button
            onClick={() => {
              setOrientation('horizontal');
              handleResetAdjustments();
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              orientation === 'horizontal'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            id="tab-horizontal"
          >
            <Grid className="h-4 w-4" />
            Horizontal (1:1)
          </button>
        </div>

        {/* Stage Wrapper */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full max-w-[500px] lg:max-w-full flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden group"
          style={{
            aspectRatio: orientation === 'vertical' ? '4/5' : '1/1'
          }}
        >
          {/* Real-time Rendering Canvas */}
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onMouseEnter={() => setIsHoveredCanvas(true)}
            onMouseLeave={() => {
              setIsHoveredCanvas(false);
              setIsDragging(false);
            }}
            className={`w-full h-full rounded-xl shadow-lg select-none transition-all ${
              photoImg ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
            }`}
            style={{
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />

          {/* Guide Overlay for Dragging */}
          {photoImg && !isDragging && (
            <div className="absolute top-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Move className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span className="text-[10px] text-gray-200 font-bold uppercase tracking-wider">
                Arraste na foto para mover
              </span>
            </div>
          )}

          {/* Quick Info text when empty */}
          {!photoImg && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-4 rounded-xl border-2 border-dashed border-white/20 bg-[#020617]/90 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-center p-6"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-25 animate-ping" />
                <div className="relative rounded-full bg-white/10 border border-white/20 p-5 text-white/90">
                  <Upload className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Crie sua Foto Memorável!</h3>
              <p className="text-white/50 text-xs max-w-xs leading-relaxed">
                Clique aqui para escolher uma foto de seu celular/computador ou simplesmente arraste-a aqui.
              </p>
            </div>
          )}
        </div>

        {/* Logo click handled silently */}
      </div>

      {/* RIGHT COLUMN: ADJUSTMENT CONTROLS */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* SECTION 1: PHOTO ACTIONS (Uploader & Downloader) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              1. Carregar & Baixar Foto
            </h4>
            {photoImg && (
              <span className="text-[10px] bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Carregada
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 py-4 px-4 text-xs font-bold text-white uppercase tracking-wider transition-all active:scale-[0.98] min-h-[48px]"
              id="btn-upload-photo"
            >
              <Upload className="h-4.5 w-4.5 text-red-500" />
              {photoImg ? 'Substituir Foto' : 'Selecionar Foto'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="file-photo-uploader"
            />

            <button
              onClick={handleDownload}
              disabled={!photoImg}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-4 px-4 text-xs font-bold uppercase tracking-wider transition-all min-h-[48px] ${
                photoImg 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 active:scale-[0.98]' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
              id="btn-download-final"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-300 animate-bounce" />
                  Salvo!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-white" />
                  Baixar Foto
                </>
              )}
            </button>
          </div>

          {photoImg && (
            <button
              onClick={handleResetAdjustments}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 py-2.5 text-[11px] font-bold text-white/60 uppercase tracking-widest transition-all min-h-[40px]"
              id="btn-reset-photo"
            >
              <RotateCcw className="h-3.5 w-3.5 text-red-500/70" />
              Resetar Posição da Foto
            </button>
          )}
        </div>

        {/* SECTION 2: POSITION & SCALE D-PAD ADJUSTMENTS */}
        <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg transition-all ${!photoImg ? 'opacity-40 pointer-events-none' : ''}`}>
          <h4 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-5 flex items-center gap-2">
            <Move className="h-4 w-4" />
            2. Ajustar Posição
          </h4>

          {/* D-PAD and Zoom Controls Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* The Tactical D-PAD */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">D-Pad Manual</span>
              <div className="relative w-28 h-28 flex items-center justify-center bg-white/5 rounded-full border border-white/10 p-2 shadow-inner">
                {/* Center dot */}
                <div className="absolute w-6 h-6 bg-red-600/20 rounded-full border border-red-500/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                </div>
                
                {/* UP */}
                <button
                  onClick={() => adjustPosition('up')}
                  className="absolute top-1 rounded-full p-2 bg-white/10 hover:bg-red-600 text-white transition-all shadow border border-white/10 active:scale-95"
                  title="Mover para Cima"
                  id="dpad-up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                {/* DOWN */}
                <button
                  onClick={() => adjustPosition('down')}
                  className="absolute bottom-1 rounded-full p-2 bg-white/10 hover:bg-red-600 text-white transition-all shadow border border-white/10 active:scale-95"
                  title="Mover para Baixo"
                  id="dpad-down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                {/* LEFT */}
                <button
                  onClick={() => adjustPosition('left')}
                  className="absolute left-1 rounded-full p-2 bg-white/10 hover:bg-red-600 text-white transition-all shadow border border-white/10 active:scale-95"
                  title="Mover para Esquerda"
                  id="dpad-left"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                {/* RIGHT */}
                <button
                  onClick={() => adjustPosition('right')}
                  className="absolute right-1 rounded-full p-2 bg-white/10 hover:bg-red-600 text-white transition-all shadow border border-white/10 active:scale-95"
                  title="Mover para Direita"
                  id="dpad-right"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Slider Scale / Zoom & Rotation */}
            <div className="md:col-span-7 space-y-4">
              {/* Zoom Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><ZoomIn className="h-3.5 w-3.5 text-red-500" /> Redimensionar</span>
                  <span className="text-red-400 font-mono">{Math.round(adjustments.scale * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => adjustZoom('out')} 
                    className="p-1.5 rounded bg-white/10 hover:bg-red-600 transition-colors border border-white/10 text-white/70 hover:text-white"
                    id="zoom-out-btn"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.01"
                    value={adjustments.scale}
                    onChange={(e) => adjustZoom(parseFloat(e.target.value))}
                    className="w-full accent-red-600 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    id="zoom-slider"
                  />
                  <button 
                    onClick={() => adjustZoom('in')} 
                    className="p-1.5 rounded bg-white/10 hover:bg-red-600 transition-colors border border-white/10 text-white/70 hover:text-white"
                    id="zoom-in-btn"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><RotateCw className="h-3.5 w-3.5 text-red-500" /> Rotação Livre</span>
                  <span className="text-red-400 font-mono">{adjustments.rotation}°</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => rotatePhoto('ccw')}
                    className="p-1.5 rounded bg-white/10 hover:bg-red-600 text-xs font-bold text-white/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
                    title="Girar 90° Anti-horário"
                    id="rotate-ccw-btn"
                  >
                    <RotateCw className="h-3.5 w-3.5 scale-x-[-1]" />
                    -90°
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    step="1"
                    value={adjustments.rotation}
                    onChange={(e) => rotatePhoto(parseInt(e.target.value))}
                    className="w-full accent-red-600 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    id="rotate-slider"
                  />
                  <button
                    onClick={() => rotatePhoto('cw')}
                    className="p-1.5 rounded bg-white/10 hover:bg-red-600 text-xs font-bold text-white/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
                    title="Girar 90° Horário"
                    id="rotate-cw-btn"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    +90°
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: IMAGE FILTERS (Brightness, Contrast, Saturation) */}
        <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg transition-all ${!photoImg ? 'opacity-40 pointer-events-none' : ''}`}>
          <h4 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-4 flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            3. Filtros & Realces
          </h4>

          <div className="space-y-4">
            {/* Brightness Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-white/60">
                <span>Brilho</span>
                <span className="font-mono text-red-400">{adjustments.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustments.brightness}
                onChange={(e) => setAdjustments(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                className="w-full accent-red-600 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                id="brightness-slider"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-white/60">
                <span>Contraste</span>
                <span className="font-mono text-red-400">{adjustments.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustments.contrast}
                onChange={(e) => setAdjustments(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                className="w-full accent-red-600 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                id="contrast-slider"
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-white/60">
                <span>Saturação das Cores</span>
                <span className="font-mono text-red-400">{adjustments.saturation}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustments.saturation}
                onChange={(e) => setAdjustments(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                className="w-full accent-red-600 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                id="saturation-slider"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
