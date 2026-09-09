'use client';

import React, { useState } from 'react';
import { ItemPhoto } from '@/types';
import { Columns2, Sliders, Image as ImageIcon } from 'lucide-react';

interface PhotoComparisonProps {
  photos: ItemPhoto[];
  shoeBrand?: string;
  shoeModel?: string;
}

export function PhotoComparison({ photos, shoeBrand, shoeModel }: PhotoComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const beforePhoto = photos.find(p => p.photoType === 'BEFORE');
  const afterPhoto = photos.find(p => p.photoType === 'AFTER');

  if (!beforePhoto && !afterPhoto) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-zinc-400 text-xs">
        <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
        <p>Belum ada dokumentasi foto untuk sepatu ini.</p>
      </div>
    );
  }

  // If only before photo exists
  if (beforePhoto && !afterPhoto) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium text-white">Dokumentasi Kondisi Awal Masuk</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            BEFORE ONLY
          </span>
        </div>
        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforePhoto.photoUrl}
            alt="Before condition"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold text-white">
            Kondisi Awal (Before)
          </div>
          {beforePhoto.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-xs text-zinc-200">
              {beforePhoto.caption}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Both Before & After photos exist!
  return (
    <div className="space-y-3">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Dokumentasi Hasil Perawatan
          </h4>
          <p className="text-[11px] text-zinc-500">
            {shoeBrand} {shoeModel}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
              viewMode === 'slider' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${
              viewMode === 'side-by-side' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Berdampingan</span>
          </button>
        </div>
      </div>

      {viewMode === 'slider' && beforePhoto && afterPhoto ? (
        <div className="space-y-2">
          {/* Interactive Split Slider */}
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden select-none border border-white/10 bg-zinc-950 cursor-ew-resize"
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              setSliderPosition((x / rect.width) * 100);
            }}
            onTouchMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
              setSliderPosition((x / rect.width) * 100);
            }}
          >
            {/* After Image (Background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterPhoto.photoUrl}
              alt="After treatment"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 z-10 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-bold text-emerald-300 border border-emerald-500/30">
              AFTER (BERSIH)
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforePhoto.photoUrl}
                alt="Before condition"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-bold text-amber-300 border border-amber-500/30">
                BEFORE (KOTOR)
              </div>
            </div>

            {/* Slider Handle Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-[10px]">
                ↔
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span>← Geser kiri untuk melihat hasil bersih</span>
            <span>Geser kanan untuk melihat noda awal →</span>
          </div>
        </div>
      ) : (
        /* Side by side layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beforePhoto && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforePhoto.photoUrl}
                alt="Before condition"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded text-xs font-bold text-amber-300 border border-amber-500/30">
                BEFORE
              </div>
              {beforePhoto.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 p-2.5 text-[11px] text-zinc-300">
                  {beforePhoto.caption}
                </div>
              )}
            </div>
          )}
          {afterPhoto && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterPhoto.photoUrl}
                alt="After condition"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-emerald-950/80 px-2.5 py-1 rounded text-xs font-bold text-emerald-300 border border-emerald-500/30">
                AFTER
              </div>
              {afterPhoto.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 p-2.5 text-[11px] text-zinc-300">
                  {afterPhoto.caption}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
