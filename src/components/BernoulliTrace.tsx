import React, { useState, useEffect, useRef } from 'react';

interface TraceStep {
  step: number;
  operation: string;
  operands: string;
  resultVar: string;
  readVars: string[];
  writeVar: string;
  formula: string;
  comment: string;
  vars: Record<string, string>;
}

const TRACE_STEPS: TraceStep[] = [
  {
    step: 1,
    operation: '× (곱셈)',
    operands: 'V₂ × V₃',
    resultVar: 'V₄',
    readVars: ['V2', 'V3'],
    writeVar: 'V4',
    formula: '2 × n = 2n',
    comment: '상수 2와 n을 곱하여 2n 계산 (n=4일 때 8)',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '0', V6: '0', V7: '0', V8: '0' }
  },
  {
    step: 2,
    operation: '- (감산)',
    operands: 'V₄ - V₁',
    resultVar: 'V₅',
    readVars: ['V4', 'V1'],
    writeVar: 'V5',
    formula: '2n - 1',
    comment: '2n에서 1을 감산하여 분자 인자 (2n-1) = 7 도출',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '0', V7: '0', V8: '0' }
  },
  {
    step: 3,
    operation: '+ (가산)',
    operands: 'V₄ + V₁',
    resultVar: 'V₆',
    readVars: ['V4', 'V1'],
    writeVar: 'V6',
    formula: '2n + 1',
    comment: '2n에 1을 가산하여 분모 인자 (2n+1) = 9 도출',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '9', V7: '0', V8: '0' }
  },
  {
    step: 4,
    operation: '÷ (나눗셈)',
    operands: 'V₅ ÷ V₆',
    resultVar: 'V₇',
    readVars: ['V5', 'V6'],
    writeVar: 'V7',
    formula: '(2n - 1) / (2n + 1)',
    comment: '분수 항 7/9 계산하여 V₇에 저장',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '9', V7: '7/9', V8: '0' }
  },
  {
    step: 5,
    operation: '÷ (나눗셈)',
    operands: 'V₇ ÷ V₂',
    resultVar: 'V₁₁ (누적기)',
    readVars: ['V7', 'V2'],
    writeVar: 'V11',
    formula: '-(1/2) × (2n-1)/(2n+1)',
    comment: '기본 독립 상수항 -7/18 계산하여 누적기 V₁₁에 저장',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '9', V7: '7/9', V8: '0', V11: '-7/18' }
  },
  {
    step: 6,
    operation: '- (카운터 감소)',
    operands: 'V₃ - V₁',
    resultVar: 'V₃',
    readVars: ['V3', 'V1'],
    writeVar: 'V3',
    formula: 'n - 1',
    comment: '루프 카운터 감소(4→3) 및 베르누이 기저 수열 곱셈 준비',
    vars: { V1: '1', V2: '2', V3: '3', V4: '8', V5: '7', V6: '9', V7: '7/9', V8: '0', V11: '-7/18' }
  },
  {
    step: 7,
    operation: '× (곱셈 누적)',
    operands: 'V₄ × B₁',
    resultVar: 'V₈',
    readVars: ['V4'],
    writeVar: 'V8',
    formula: '2n × B₁ / 2',
    comment: '기존에 계산된 B₁(1/6) 항과 이항계수 곱셈 누적 (2/3 도출)',
    vars: { V1: '1', V2: '2', V3: '3', V4: '8', V5: '7', V6: '9', V7: '7/9', V8: '2/3', V11: '-7/18' }
  },
  {
    step: 8,
    operation: '조건 분기 및 결과 확정',
    operands: 'Zero-Check (V₃=0)',
    resultVar: 'B₇',
    readVars: ['V3', 'V11', 'V8'],
    writeVar: 'B7',
    formula: 'B₇ = -1/30',
    comment: '모든 이전 베르누이 항 기여도를 차감하여 최종 B₇ 계산 완료',
    vars: { V1: '1', V2: '2', V3: '0', V4: '8', V5: '7', V6: '9', V7: '7/9', V8: '2/3', V11: '0', B7: '-1/30 (-0.0333...)' }
  }
];

interface RegisterMeta {
  id: string;
  label: string;
  role: string;
}

const CORE_REGISTERS: RegisterMeta[] = [
  { id: 'V1', label: 'V₁', role: '상수 1' },
  { id: 'V2', label: 'V₂', role: '상수 2' },
  { id: 'V3', label: 'V₃', role: '인수 n' },
  { id: 'V4', label: 'V₄', role: '2n 항' },
  { id: 'V5', label: 'V₅', role: '2n - 1' },
  { id: 'V6', label: 'V₆', role: '2n + 1' },
  { id: 'V7', label: 'V₇', role: '분수항' },
  { id: 'V8', label: 'V₈', role: '이항계수항' }
];

export default function BernoulliTrace() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const step = TRACE_STEPS[currentIdx];

  // Auto-play timer loop
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIdx((prev) => {
          if (prev >= TRACE_STEPS.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying]);

  const toggleAutoPlay = () => {
    if (currentIdx === TRACE_STEPS.length - 1) {
      setCurrentIdx(0);
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying((prev) => !prev);
    }
  };

  return (
    <div className="bg-[#141820] border border-[#2a3442] rounded-xl p-4 sm:p-6 shadow-2xl text-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl text-purple-400">📜</span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-brass-300 break-keep">
              에이다 러브레이스의 1843년<br className="hidden sm:inline" /> Note G 알고리즘 추적기 (The First Program)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1 break-keep">
            해석기관의 변수 카드(Variable Cards)와 연산 카드(Operation Cards)가 베르누이 수(Bernoulli Numbers)를 구하는 과정입니다.
          </p>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
          <span className="text-gray-400">실행 천공카드:</span>
          <span className="px-3 py-1 bg-purple-950/70 border border-purple-500/50 text-purple-300 font-bold rounded-lg text-sm shadow-inner">
            카드 #{step.step} / {TRACE_STEPS.length}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Step Details & Controls */}
        <div className="bg-[#0d1015] border border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Card info tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-brass-500/15 text-brass-300 border border-brass-500/40 font-semibold">
                작전 카드: {step.operation}
              </span>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
                피연산: {step.operands}
              </span>
            </div>

            {/* Formula & Comment Box */}
            <div className="bg-[#181e28] border border-gray-700/60 rounded-lg p-4 mb-4 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
                <span>수학 공식 및 중간 도출식:</span>
                <span className="text-brass-400">결과 저장: {step.resultVar}</span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-bold text-brass-200 mb-2 tracking-wide break-all">
                {step.formula}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed break-keep border-t border-gray-700/60 pt-2">
                {step.comment}
              </p>
            </div>
          </div>

          {/* Step Controls: 이전, 다음 스텝, 자동 실행, 초기화 (Min 44px Touch Targets) */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-3 border-t border-gray-800">
            {/* Previous Step */}
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIdx((p) => Math.max(0, p - 1));
              }}
              disabled={currentIdx === 0}
              className="min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#1e2530] hover:bg-[#283242] disabled:opacity-30 disabled:pointer-events-none rounded-lg text-xs sm:text-sm text-gray-300 font-medium transition-all active:scale-95 flex items-center justify-center gap-1 border border-gray-700/60 touch-manipulation flex-1 sm:flex-initial"
            >
              <span>← 이전</span>
            </button>

            {/* Next Step */}
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIdx((p) => Math.min(TRACE_STEPS.length - 1, p + 1));
              }}
              disabled={currentIdx === TRACE_STEPS.length - 1}
              className="min-h-[44px] flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 hover:from-purple-600 hover:to-pink-500 disabled:opacity-30 disabled:pointer-events-none text-white font-bold rounded-lg text-xs sm:text-sm shadow-md shadow-purple-900/30 transition-all active:scale-95 flex items-center justify-center gap-1 touch-manipulation"
            >
              <span>다음 스텝 실행 →</span>
            </button>

            {/* Auto Play Toggle */}
            <button
              onClick={toggleAutoPlay}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 border touch-manipulation flex-1 sm:flex-initial ${
                isAutoPlaying
                  ? 'bg-pink-950/80 border-pink-400 text-pink-200 shadow-md shadow-pink-500/20 animate-pulse'
                  : 'bg-[#1e2530] border-purple-500/40 text-purple-300 hover:bg-[#252f3d]'
              }`}
            >
              <span>{isAutoPlaying ? '⏸️ 일시정지' : '▶️ 자동 실행'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIdx(0);
              }}
              className="min-h-[44px] px-3 py-2.5 bg-[#181d26] hover:bg-[#222936] border border-gray-700/60 text-gray-400 hover:text-gray-200 rounded-lg text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center touch-manipulation"
              title="처음 스텝으로 초기화"
            >
              <span>🔄</span>
            </button>
          </div>
        </div>

        {/* Right: Store (Register Memory) State */}
        <div className="bg-[#0d1015] border border-gray-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>🗄️ 스토어(Store) 레지스터 상태</span>
              </h4>
              <span className="text-[10px] text-purple-400 font-mono bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30">
                50자리 10진수 휠
              </span>
            </div>

            {/* Mobile Scroll Indicator for Registers */}
            <div className="sm:hidden flex items-center justify-between text-[11px] text-gray-400 mb-2 font-mono px-0.5">
              <span>변수 레지스터 ($V_1 \dots V_8$)</span>
              <span className="text-purple-400 flex items-center gap-1">
                <span>↔ 가로 스크롤 가능</span>
              </span>
            </div>

            {/* Variable Register Cards - Responsive with overflow-x-auto */}
            <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-purple-700/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-[300px] sm:min-w-0">
                {CORE_REGISTERS.map((reg) => {
                  const val = step.vars[reg.id] ?? '0';
                  const isWritten = step.writeVar === reg.id;
                  const isRead = step.readVars.includes(reg.id);

                  let borderClass = 'border-gray-800/80 bg-[#161b24]';
                  let statusBadge = null;

                  if (isWritten) {
                    borderClass = 'border-brass-400/80 bg-brass-950/40 shadow-sm shadow-brass-500/10 ring-1 ring-brass-400/40';
                    statusBadge = (
                      <span className="text-[9px] font-mono text-brass-300 font-bold bg-brass-900/60 px-1 rounded">
                        쓰기(W)
                      </span>
                    );
                  } else if (isRead) {
                    borderClass = 'border-purple-500/60 bg-purple-950/30';
                    statusBadge = (
                      <span className="text-[9px] font-mono text-purple-300 font-bold bg-purple-900/60 px-1 rounded">
                        읽기(R)
                      </span>
                    );
                  }

                  return (
                    <div
                      key={reg.id}
                      className={`border rounded-lg p-2 flex flex-col justify-between transition-all ${borderClass}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-purple-300">{reg.label}</span>
                        {statusBadge}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate mb-1">{reg.role}</div>
                      <div className="text-sm sm:text-base font-mono font-bold text-brass-200 bg-[#0d1015] px-2 py-1 rounded border border-gray-800 text-right truncate">
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extra Output Registers (V11 or B7) if active */}
              {(step.vars.V11 || step.vars.B7) && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {step.vars.V11 && (
                    <div className="border border-amber-500/40 bg-amber-950/20 rounded-lg p-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-300">V₁₁</span>
                        <span className="text-[10px] text-gray-400 font-mono ml-1.5">독립 누적기</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-200 bg-[#0d1015] px-2 py-0.5 rounded border border-amber-500/30">
                        {step.vars.V11}
                      </span>
                    </div>
                  )}
                  {step.vars.B7 && (
                    <div className="border border-pink-500/50 bg-pink-950/30 rounded-lg p-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono font-bold text-pink-300">B₇</span>
                        <span className="text-[10px] text-gray-400 font-mono ml-1.5">최종 산출값</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-pink-200 bg-[#0d1015] px-2 py-0.5 rounded border border-pink-500/40">
                        {step.vars.B7}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lovelace Insight Box */}
          <div className="mt-4 p-3 bg-purple-950/20 border border-purple-800/30 rounded-lg text-[11px] text-gray-300 leading-relaxed">
            <span className="font-bold text-purple-300">💡 1843년 에이다 러브레이스의 통찰:</span>
            <p className="mt-1 break-keep">
              "해석기관은 단순한 숫자를 넘어, 음악이나 기호와 같은 일반적인 연산 대상을 조작할 수 있다."
              (Note G는 역사상 최초의 조건 분기 및 서브루틴을 포함한 프로그램입니다.)
            </p>
          </div>
        </div>
      </div>

      {/* Execution Trace Table - Full Note G Table with overflow-x-auto */}
      <div className="mt-6 pt-5 border-t border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-xs sm:text-sm font-display font-bold text-brass-300 flex items-center gap-1.5">
            <span>🗂️ 1843년 Note G 전체 연산 실행 추적표</span>
            <span className="text-[10px] text-gray-400 font-mono font-normal hidden sm:inline">
              (Ada Lovelace's Diagram for the Computation of Bernoulli Numbers)
            </span>
          </h4>
          <span className="text-[11px] text-gray-400 font-mono">
            행을 탭하여 해당 스텝으로 이동
          </span>
        </div>

        {/* Scrollable Trace Table Container */}
        <div className="overflow-x-auto -mx-1 px-1 rounded-lg border border-gray-800 bg-[#0d1015] scrollbar-thin scrollbar-thumb-purple-600/40">
          <table className="w-full text-xs font-mono text-left border-collapse min-w-[620px]">
            <thead className="bg-[#181e28] text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-2.5 border-r border-gray-800 text-center w-16">카드 #</th>
                <th className="p-2.5 border-r border-gray-800 text-brass-300 w-28">연산 (Op)</th>
                <th className="p-2.5 border-r border-gray-800 text-purple-300 w-28">피연산자</th>
                <th className="p-2.5 border-r border-gray-800 text-blue-300 w-24">대상 변수</th>
                <th className="p-2.5 border-r border-gray-800 text-amber-200">대수 공식</th>
                <th className="p-2.5 text-gray-400">연산 목적 및 주석</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-300">
              {TRACE_STEPS.map((s, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <tr
                    key={s.step}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIdx(idx);
                    }}
                    className={`cursor-pointer transition-all touch-manipulation ${
                      isActive
                        ? 'bg-purple-950/60 text-purple-200 font-semibold border-l-4 border-l-purple-400 shadow-inner'
                        : 'hover:bg-[#181d26]/80 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <td className="p-2.5 border-r border-gray-800 text-center font-bold">
                      {isActive ? `▶ ${s.step}` : s.step}
                    </td>
                    <td className="p-2.5 border-r border-gray-800 text-brass-300">{s.operation}</td>
                    <td className="p-2.5 border-r border-gray-800 text-purple-300">{s.operands}</td>
                    <td className="p-2.5 border-r border-gray-800 font-bold text-blue-300">{s.resultVar}</td>
                    <td className="p-2.5 border-r border-gray-800 text-amber-200">{s.formula}</td>
                    <td className="p-2.5 text-xs text-gray-400 break-keep">{s.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

