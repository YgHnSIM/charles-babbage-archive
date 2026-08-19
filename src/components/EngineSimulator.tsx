import React, { useState, useEffect, useRef } from 'react';

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
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const autoRunTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetPreset = (preset: PolynomialPreset) => {
    setIsAutoRunning(false);
    setSelectedPreset(preset);
    setCurrentStep(0);
    setHistory([{ ...preset.initialValues }]);
  };

  const handleStep = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 450);

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

  // Auto-run continuous rotation loop
  useEffect(() => {
    if (isAutoRunning) {
      autoRunTimerRef.current = setInterval(() => {
        handleStep();
      }, 750);
    } else {
      if (autoRunTimerRef.current) {
        clearInterval(autoRunTimerRef.current);
        autoRunTimerRef.current = null;
      }
    }

    return () => {
      if (autoRunTimerRef.current) {
        clearInterval(autoRunTimerRef.current);
      }
    };
  }, [isAutoRunning, selectedPreset]);

  // Stop auto-run when reaching step limit to avoid infinite calculation
  useEffect(() => {
    if (currentStep >= 50 && isAutoRunning) {
      setIsAutoRunning(false);
    }
  }, [currentStep, isAutoRunning]);

  const toggleAutoRun = () => {
    setIsAutoRunning((prev) => !prev);
  };

  const latest = history[history.length - 1];

  return (
    <div className="bg-[#141820] border border-[#2a3442] rounded-xl p-4 sm:p-6 shadow-2xl text-gray-200">
      {/* Top Header & Preset Selectors */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl transition-transform duration-500 inline-block ${
                isRotating || isAutoRunning ? 'rotate-180 text-brass-400' : 'text-brass-500'
              }`}
            >
              ⚙️
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-brass-300 break-keep">
              차분기관 유한차분법(Method of Differences)<br className="hidden sm:inline" /> 인터랙티브 시뮬레이터
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1 break-keep">
            곱셈이나 나눗셈 없이 오직 '덧셈 톱니바퀴의 회전'만으로 다항식 함수표를 오차 없이 연속 생성합니다.
          </p>
        </div>

        {/* Preset Selector Buttons - Mobile Wrapped & >=44px Touch Targets */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => resetPreset(p)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-initial flex items-center justify-center text-center touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-brass-500 text-iron-950 font-bold shadow-md shadow-brass-500/20 border border-brass-400'
                    : 'bg-[#1e2530] text-gray-300 border border-gray-700/60 hover:text-white hover:bg-[#252f3d]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gear Columns View */}
        <div className="lg:col-span-2 bg-[#0d1015] border border-gray-800/80 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <span className="text-xs font-mono text-brass-400 tracking-wider uppercase bg-brass-950/40 px-2.5 py-1 rounded border border-brass-500/30">
                수식: {selectedPreset.formula}
              </span>
              <span className="text-xs text-gray-400 font-mono bg-[#181d26] px-2.5 py-1 rounded border border-gray-700/60">
                누적 계산 스텝: <strong className="text-brass-300">{currentStep}회</strong>
              </span>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="sm:hidden flex items-center justify-between text-[11px] text-gray-400 mb-2 font-mono px-1">
              <span>⚙️ 기계 기어 열 (Gear Columns)</span>
              <span className="text-brass-400/90 flex items-center gap-1">
                <span>↔ 가로 스크롤</span>
              </span>
            </div>

            {/* Gear Columns Rack - Responsive with overflow-x-auto */}
            <div className="overflow-x-auto pb-3 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-brass-600/40 scrollbar-track-iron-900">
              <div
                className={`grid gap-2.5 sm:gap-3 text-center mb-2 ${
                  selectedPreset.degree === 3
                    ? 'grid-cols-5 min-w-[500px] sm:min-w-0'
                    : 'grid-cols-4 min-w-[420px] sm:min-w-0'
                }`}
              >
                {/* Column 1: x Input */}
                <div className="bg-[#181d26] border border-gray-700/70 rounded-lg p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600/50" />
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase font-mono mb-1">인수 (x)</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wider my-1">{latest.x}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">입력값 휠</div>
                </div>

                {/* Column 2: f(x) Output Result */}
                <div className="bg-brass-950/50 border-2 border-brass-500/60 rounded-lg p-2.5 sm:p-3 shadow-lg shadow-brass-500/10 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brass-400 to-amber-300" />
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-brass-300 uppercase font-mono font-bold mb-1">
                      f(x) [출력]
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-brass-200 tracking-wider my-1 drop-shadow">
                      {latest.f}
                    </div>
                  </div>
                  <div className="text-[10px] text-brass-300/90 mt-1 font-mono">← Δ¹ 덧셈 누적</div>
                </div>

                {/* Column 3: Delta 1 */}
                <div className="bg-[#181d26] border border-blue-500/40 rounded-lg p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/50" />
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-blue-400 uppercase font-mono mb-1">1차 차분 (Δ¹)</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-blue-400 tracking-wider my-1">{latest.d1}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">← Δ² 덧셈 누적</div>
                </div>

                {/* Column 4: Delta 2 */}
                {selectedPreset.degree === 3 ? (
                  <div className="bg-[#181d26] border border-purple-500/40 rounded-lg p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500/50" />
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-purple-400 uppercase font-mono mb-1">2차 차분 (Δ²)</div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400 tracking-wider my-1">{latest.d2}</div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">← Δ³ 덧셈 누적</div>
                  </div>
                ) : (
                  <div className="bg-[#181d26] border border-emerald-500/40 rounded-lg p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/50" />
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-400 uppercase font-mono mb-1">2차 차분 (Δ² 상수)</div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-wider my-1">{latest.d2}</div>
                    </div>
                    <div className="text-[10px] text-emerald-400/90 mt-1 font-mono">기계 불변 상수</div>
                  </div>
                )}

                {/* Column 5: Delta 3 (Degree 3 only) */}
                {selectedPreset.degree === 3 && (
                  <div className="bg-[#181d26] border border-emerald-500/40 rounded-lg p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/50" />
                    <div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-400 uppercase font-mono mb-1">3차 차분 (Δ³ 상수)</div>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-wider my-1">{latest.d3}</div>
                    </div>
                    <div className="text-[10px] text-emerald-400/90 mt-1 font-mono">기계 불변 상수</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Buttons ("연산 1스텝 실행", "연속 회전", "초기화") - Min 44px Touch Targets */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-gray-800">
            {/* Step execution button */}
            <button
              onClick={handleStep}
              disabled={isRotating || isAutoRunning}
              className="min-h-[44px] flex-1 py-3 px-4 bg-gradient-to-r from-brass-600 via-brass-500 to-amber-500 hover:from-brass-500 hover:to-amber-400 text-iron-950 font-bold rounded-lg shadow-lg shadow-brass-500/15 flex items-center justify-center gap-2 transition-all touch-manipulation active:scale-[0.98] disabled:opacity-50"
            >
              <span className={`text-base ${isRotating ? 'animate-spin' : ''}`}>⚙️</span>
              <span className="text-xs sm:text-sm font-bold">연산 1스텝 실행</span>
            </button>

            {/* Continuous auto rotation button */}
            <button
              onClick={toggleAutoRun}
              className={`min-h-[44px] px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation active:scale-[0.98] border ${
                isAutoRunning
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20 animate-pulse'
                  : 'bg-[#1e2530] border-amber-500/40 text-amber-300 hover:bg-[#283242]'
              }`}
            >
              <span>{isAutoRunning ? '⏸️' : '▶️'}</span>
              <span>{isAutoRunning ? '회전 일시정지' : '연속 회전'}</span>
            </button>

            {/* Reset button */}
            <button
              onClick={() => resetPreset(selectedPreset)}
              className="min-h-[44px] px-4 py-3 bg-[#1e2530] hover:bg-[#283242] border border-gray-700/70 text-gray-300 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <span>🔄</span>
              <span>초기화</span>
            </button>
          </div>
        </div>

        {/* Right: History & Explanation */}
        <div className="bg-[#0d1015] border border-gray-800/80 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>🖨️ 수표 인쇄 기록</span>
                <span className="text-[10px] text-gray-500 font-normal">(Stereotype Output)</span>
              </h4>
              <span className="text-[10px] text-brass-400 font-mono">{history.length}행 출력됨</span>
            </div>

            {/* History Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto -mx-1 px-1 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              <div className="min-w-[260px] text-xs font-mono space-y-1">
                <div
                  className={`grid ${
                    selectedPreset.degree === 3 ? 'grid-cols-5' : 'grid-cols-4'
                  } text-gray-500 border-b border-gray-800 pb-1.5 mb-1 font-semibold text-[11px]`}
                >
                  <span>x</span>
                  <span className="text-brass-300">f(x)</span>
                  <span className="text-blue-400">Δ¹</span>
                  <span className="text-emerald-400">Δ²</span>
                  {selectedPreset.degree === 3 && <span className="text-emerald-400">Δ³</span>}
                </div>
                {history.map((row, idx) => {
                  const isLatest = idx === history.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`grid ${
                        selectedPreset.degree === 3 ? 'grid-cols-5' : 'grid-cols-4'
                      } py-1 px-1.5 rounded transition-colors ${
                        isLatest ? 'bg-brass-500/20 text-brass-200 font-bold border-l-2 border-brass-400' : 'text-gray-400 hover:bg-gray-800/40'
                      }`}
                    >
                      <span>{row.x}</span>
                      <span className="text-brass-300 font-semibold">{row.f}</span>
                      <span className="text-blue-300">{row.d1}</span>
                      <span className="text-emerald-300">{row.d2}</span>
                      {selectedPreset.degree === 3 && <span className="text-emerald-300">{row.d3}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-400 leading-relaxed bg-[#141820]/80 p-3 rounded-lg border border-gray-800/60">
            <p className="font-semibold text-brass-400 mb-1 flex items-center gap-1">
              <span>💡 배비지의 핵심 아이디어:</span>
            </p>
            <p className="break-keep">{selectedPreset.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

