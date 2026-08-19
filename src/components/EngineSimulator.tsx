import React, { useState } from 'react';

interface PolynomialPreset {
  id: string;
  name: string;
  formula: string;
  degree: number;
  initialValues: { x: number; f: number; d1: number; d2?: number; d3?: number };
  constantDiff: number;
  description: string;
}

const PRESETS: PolynomialPreset[] = [
  {
    id: 'euler-prime',
    name: '오일러 소수 다항식',
    formula: 'f(x) = x² + x + 41',
    degree: 2,
    initialValues: { x: 0, f: 41, d1: 2, d2: 2 },
    constantDiff: 2,
    description: 'x=0부터 39까지 40개의 연속된 소수를 생성하는 2차 다항식입니다. 2차 차분(Δ²)이 항상 2로 고정됩니다.'
  },
  {
    id: 'cubic-nav',
    name: '항해용 3차 다항식',
    formula: 'f(x) = x³ - 2x + 5',
    degree: 3,
    initialValues: { x: 0, f: 5, d1: -1, d2: 6, d3: 6 },
    constantDiff: 6,
    description: '19세기 해상 천문 항해표(Nautical Almanac)에 사용된 3차 다항식입니다. 3차 차분(Δ³)이 6으로 일정합니다.'
  },
  {
    id: 'squares',
    name: '제곱수 수열',
    formula: 'f(x) = x²',
    degree: 2,
    initialValues: { x: 0, f: 0, d1: 1, d2: 2 },
    constantDiff: 2,
    description: '가장 기본적인 제곱수 수표입니다. 차분 1호의 기본 시연에 활용되었습니다.'
  }
];

interface HistoryRow {
  x: number;
  f: number;
  d1: number;
  d2?: number;
  d3?: number;
}

export default function EngineSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<PolynomialPreset>(PRESETS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([
    { ...selectedPreset.initialValues }
  ]);
  const [isRotating, setIsRotating] = useState(false);

  const resetPreset = (preset: PolynomialPreset) => {
    setSelectedPreset(preset);
    setCurrentStep(0);
    setHistory([{ ...preset.initialValues }]);
  };

  const handleStep = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    setHistory((prev) => {
      const last = prev[prev.length - 1];
      const nextX = last.x + 1;

      if (selectedPreset.degree === 2) {
        // Degree 2: d2 is constant
        const d2 = last.d2 ?? selectedPreset.constantDiff;
        const nextD1 = last.d1 + d2;
        const nextF = last.f + nextD1;
        return [...prev, { x: nextX, f: nextF, d1: nextD1, d2 }];
      } else {
        // Degree 3: d3 is constant
        const d3 = last.d3 ?? selectedPreset.constantDiff;
        const nextD2 = (last.d2 ?? 0) + d3;
        const nextD1 = last.d1 + nextD2;
        const nextF = last.f + nextD1;
        return [...prev, { x: nextX, f: nextF, d1: nextD1, d2: nextD2, d3 }];
      }
    });

    setCurrentStep((prev) => prev + 1);
  };

  const latest = history[history.length - 1];

  return (
    <div className="bg-[#141820] border border-[#2a3442] rounded-xl p-6 shadow-2xl text-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl transition-transform duration-500 ${isRotating ? 'rotate-180 text-brass-400' : 'text-brass-500'}`}>
              ⚙️
            </span>
            <h3 className="font-display font-bold text-xl text-brass-300 break-keep">
              차분기관 유한차분법(Method of Differences)<br className="hidden sm:inline" /> 인터랙티브 시뮬레이터
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1 break-keep">
            곱셈이나 나눗셈 없이 오직 '덧셈 톱니바퀴의 회전'만으로 다항식 함수표를 오차 없이 연속 생성합니다.
          </p>
        </div>

        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => resetPreset(p)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                selectedPreset.id === p.id
                  ? 'bg-brass-500 text-iron-950 font-bold shadow'
                  : 'bg-[#1e2530] text-gray-400 hover:text-white hover:bg-[#252f3d]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gear Columns View */}
        <div className="lg:col-span-2 bg-[#0d1015] border border-gray-800/80 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-brass-400 tracking-wider uppercase">
              수식: {selectedPreset.formula}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              누적 계산 스텝: {currentStep}회
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center mb-6">
            <div className="bg-[#181d26] border border-gray-700/60 rounded p-3">
              <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">인수 (x)</div>
              <div className="text-2xl font-bold font-mono text-white">{latest.x}</div>
              <div className="text-[10px] text-gray-500 mt-1">입력값</div>
            </div>

            <div className="bg-brass-950/40 border border-brass-500/40 rounded p-3 shadow-inner">
              <div className="text-[10px] text-brass-300 uppercase font-mono mb-1">함수값 f(x) [출력]</div>
              <div className="text-2xl font-bold font-mono text-brass-300">{latest.f}</div>
              <div className="text-[10px] text-brass-400/80 mt-1">← Δ¹ 덧셈 누적</div>
            </div>

            <div className="bg-[#181d26] border border-gray-700/60 rounded p-3">
              <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">1차 차분 (Δ¹)</div>
              <div className="text-2xl font-bold font-mono text-blue-400">{latest.d1}</div>
              <div className="text-[10px] text-gray-500 mt-1">← Δ² 덧셈 누적</div>
            </div>

            {selectedPreset.degree === 3 ? (
              <div className="bg-[#181d26] border border-gray-700/60 rounded p-3">
                <div className="text-[10px] text-gray-400 uppercase font-mono mb-1">2차 차분 (Δ²)</div>
                <div className="text-2xl font-bold font-mono text-purple-400">{latest.d2}</div>
                <div className="text-[10px] text-gray-500 mt-1">← Δ³ 덧셈 누적</div>
              </div>
            ) : (
              <div className="bg-[#181d26] border border-emerald-500/30 rounded p-3">
                <div className="text-[10px] text-emerald-400 uppercase font-mono mb-1">2차 차분 (Δ² 상수)</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{latest.d2}</div>
                <div className="text-[10px] text-emerald-500/80 mt-1">기계 불변 상수</div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStep}
              disabled={isRotating}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-brass-600 to-brass-500 hover:from-brass-500 hover:to-brass-400 text-iron-950 font-bold rounded-lg shadow-lg shadow-brass-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span className={isRotating ? 'animate-spin' : ''}>⚙️</span>
              <span>크랭크 회전 (다음 값 덧셈 계산)</span>
            </button>
            <button
              onClick={() => resetPreset(selectedPreset)}
              className="px-4 py-3 bg-[#1e2530] hover:bg-[#283242] text-gray-300 rounded-lg text-sm transition-colors"
            >
              초기화
            </button>
          </div>
        </div>

        {/* Right: History & Explanation */}
        <div className="bg-[#0d1015] border border-gray-800/80 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              수표 인쇄 기록 (Stereotype Output)
            </h4>
            <div className="max-h-48 overflow-y-auto pr-1 text-xs font-mono space-y-1">
              <div className="grid grid-cols-4 text-gray-500 border-b border-gray-800 pb-1 mb-1 font-semibold text-[11px]">
                <span>x</span>
                <span>f(x)</span>
                <span>Δ¹</span>
                <span>Δ²</span>
              </div>
              {history.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-4 py-0.5 px-1 rounded ${
                    idx === history.length - 1 ? 'bg-brass-500/20 text-brass-200 font-bold' : 'text-gray-400'
                  }`}
                >
                  <span>{row.x}</span>
                  <span className="text-brass-300">{row.f}</span>
                  <span className="text-blue-300">{row.d1}</span>
                  <span className="text-emerald-300">{row.d2}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-400 leading-relaxed">
            <p className="font-semibold text-brass-400 mb-1">배비지의 핵심 아이디어:</p>
            {selectedPreset.description}
          </div>
        </div>
      </div>
    </div>
  );
}
