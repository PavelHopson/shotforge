import React from 'react';
import { ArrowRight, Aperture, Clock, Zap, Star } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden mesh-bg">
      {/* Glow orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(107,163,255,0.12) 0%, transparent 70%)' }} />
      <div className="absolute top-40 right-1/4 w-[300px] h-[300px] rounded-full -z-10 pointer-events-none animate-float" style={{ background: 'radial-gradient(circle, rgba(74,127,212,0.08) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sf-900/30 border border-sf-700/30 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-sf-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-sf-300 tracking-wide">21 стиль · Gemini 3 Pro · Face Fusion</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-sf-50 mb-6 max-w-4xl mx-auto leading-[1.08] animate-slide-up">
          Профессиональная{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sf-400 via-sf-300 to-sf-400" style={{ backgroundSize: '200% auto', animation: 'shimmer 4s ease infinite' }}>
            фотосессия
          </span>
          <br className="hidden sm:block" />
          за 3 минуты
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-dim mb-10 max-w-xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Загрузите селфи — AI-режиссёр создаст студийные снимки в любом стиле. От Old Money до Cyberpunk.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onStart}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 animate-glow"
            style={{ background: 'linear-gradient(135deg, #4A7FD4, #6BA3FF)', boxShadow: '0 4px 20px rgba(107,163,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(107,163,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(107,163,255,0.3)'; }}
          >
            Начать сессию
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-dim text-sm border border-glass-border hover:border-sf-700/50 hover:text-sf-300 transition-all bg-glass">
            <Star className="w-3.5 h-3.5" />
            Примеры работ
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { icon: <Aperture className="w-5 h-5" />, title: 'Гиперреализм', desc: '21 стиль от Vogue до LEGO' },
            { icon: <Clock className="w-5 h-5" />, title: '180 секунд', desc: 'GPU-обработка в реальном времени' },
            { icon: <Zap className="w-5 h-5" />, title: 'AI Режиссёр', desc: 'Gemini подбирает свет и ракурс' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-glass border border-glass-border hover:border-sf-800/50 transition-all animate-slide-up"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-sf-900/40 border border-sf-800/40 flex items-center justify-center text-sf-400 mb-1">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm text-sf-100">{f.title}</h3>
              <p className="text-xs text-dim">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
