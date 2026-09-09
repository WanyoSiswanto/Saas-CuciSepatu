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
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
        <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
        <p className="font-medium">Belum ada dokumentasi foto untuk sepatu ini.</p>
      </div>
    );
  }

  // If only before photo exists
  if (beforePhoto && !afterPhoto) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-800">Dokumentasi Kondisi Awal Masuk</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px]">
            BEFORE ONLY
          </span>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforePhoto.photoUrl}
            alt="Before condition"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-amber-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
            Kondisi Awal (Before)
          </div>
          {beforePhoto.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent p-3 text-xs text-white">
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
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Dokumentasi Hasil Perawatan
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            {shoeBrand} {shoeModel}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'slider' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'side-by-side' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none border border-slate-200 bg-slate-100 cursor-ew-resize shadow-md"
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
            <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
              AFTER (BERSIH) ✨
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
              <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                BEFORE (KOTOR)
              </div>
            </div>

            {/* Slider Handle Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-blue-700 shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-blue-500/20">
                ↔
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
            <span>← Geser kiri untuk melihat hasil bersih</span>
            <span>Geser kanan untuk melihat noda awal →</span>
          </div>
        </div>
      ) : (
        /* Side by side layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {beforePhoto && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beforePhoto.photoUrl}
                alt="Before condition"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow">
                BEFORE
              </div>
              {beforePhoto.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 p-2.5 text-[11px] text-white">
                  {beforePhoto.caption}
                </div>
              )}
            </div>
          )}
          {afterPhoto && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterPhoto.photoUrl}
                alt="After condition"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-extrabold shadow">
                AFTER
              </div>
              {afterPhoto.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 p-2.5 text-[11px] text-white">
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
