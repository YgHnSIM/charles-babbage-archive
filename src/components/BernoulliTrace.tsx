import React, { useState } from 'react';

interface TraceStep {
  step: number;
  operation: string;
  operands: string;
  resultVar: string;
  formula: string;
  comment: string;
  vars: Record<string, string>;
}

const TRACE_STEPS: TraceStep[] = [
  {
    step: 1,
    operation: '×',
    operands: 'V₂ × V₃',
    resultVar: 'V₄',
    formula: '2 × n = 2n',
    comment: '상수 2와 n을 곱하여 2n 계산 (n=4일 때 8)',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '0', V6: '0', V7: '0' }
  },
  {
    step: 2,
    operation: '-',
    operands: 'V₄ - V₁',
    resultVar: 'V₅',
    formula: '2n - 1',
    comment: '2n에서 1을 감산하여 (2n-1) = 7 도출',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '0', V7: '0' }
  },
  {
    step: 3,
    operation: '+',
    operands: 'V₄ + V₁',
    resultVar: 'V₆',
    formula: '2n + 1',
    comment: '2n에 1을 가산하여 (2n+1) = 9 도출',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '9', V7: '0' }
  },
  {
    step: 4,
    operation: '÷',
    operands: 'V₅ ÷ V₆',
    resultVar: 'V₇',
    formula: '(2n - 1) / (2n + 1)',
    comment: '분수 항 7/9 계산',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V5: '7', V6: '9', V7: '7/9' }
  },
  {
    step: 5,
    operation: '÷',
    operands: 'V₇ ÷ V₂',
    resultVar: 'V₁₁',
    formula: '-(1/2) * (2n-1)/(2n+1)',
    comment: '기본 독립 상수항 -7/18 계산하여 누적기 V₁₁에 저장',
    vars: { V1: '1', V2: '2', V3: '4', V4: '8', V7: '7/9', V11: '-7/18' }
  },
  {
    step: 6,
    operation: '-',
    operands: 'V₃ - V₁',
    resultVar: 'V₃ (임시)',
    formula: 'n - 1',
    comment: '루프 카운터 감소 및 베르누이 기저 수열 곱셈 준비',
    vars: { V1: '1', V2: '2', V3: '3', V11: '-7/18' }
  },
  {
    step: 7,
    operation: '×',
    operands: 'V₄ × B₁',
    resultVar: 'V₈',
    formula: '2n × B₁ / 2',
    comment: '기존에 계산된 B₁(1/6) 항과 이항계수 곱셈 누적',
    vars: { V1: '1', V2: '2', V3: '3', V8: '2/3', V11: '-7/18' }
  },
  {
    step: 8,
    operation: '루프 및 조건 분기',
    operands: 'Zero-Check on Counter',
    resultVar: 'B_n 계산 완료',
    formula: 'B₇ = -1/30',
    comment: '모든 이전 베르누이 항(B₁, B₃, B₅)의 기여도를 차감하여 최종 B₇ 계산 완료',
    vars: { V1: '1', V2: '2', V3: '0', V11: '0', B7: '-1/30 (-0.0333...)' }
  }
];

export default function BernoulliTrace() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const step = TRACE_STEPS[currentIdx];

  return (
    <div className="bg-[#141820] border border-[#2a3442] rounded-xl p-6 shadow-2xl text-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-purple-400">📜</span>
            <h3 className="font-display font-bold text-lg text-brass-300">
              에이다 러브레이스의 1843년 Note G 알고리즘 추적기 (The First Program)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            해석기관의 변수 카드(Variable Cards)와 연산 카드(Operation Cards)가 베르누이 수(Bernoulli Numbers)를 구하는 과정입니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-gray-400">스텝:</span>
          <span className="px-2 py-1 bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold rounded">
            {currentIdx + 1} / {TRACE_STEPS.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Step Details */}
        <div className="bg-[#0d1015] border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-brass-500/15 text-brass-300 border border-brass-500/30">
                연산 카드: {step.operation}
              </span>
              <span className="text-xs font-mono text-gray-400">
                피연산 레지스터: {step.operands}
              </span>
            </div>

            <div className="bg-[#181e28] border border-gray-700/60 rounded-lg p-4 mb-4">
              <div className="text-[11px] text-gray-400 font-mono mb-1">수학 공식 및 목적:</div>
              <div className="text-lg font-mono font-bold text-brass-200 mb-2">{step.formula}</div>
              <p className="text-xs text-gray-300 leading-relaxed">{step.comment}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-800">
            <button
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 bg-[#1e2530] hover:bg-[#283242] disabled:opacity-30 rounded text-xs text-gray-300 font-medium transition-all"
            >
              ← 이전 카드
            </button>
            <button
              onClick={() => setCurrentIdx((p) => Math.min(TRACE_STEPS.length - 1, p + 1))}
              disabled={currentIdx === TRACE_STEPS.length - 1}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 disabled:opacity-30 text-white font-bold rounded text-xs shadow-md transition-all"
            >
              다음 천공카드 실행 →
            </button>
          </div>
        </div>

        {/* Right: Store (Register Memory) State */}
        <div className="bg-[#0d1015] border border-gray-800 rounded-lg p-5">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-mono flex items-center justify-between">
            <span>스토어(Store) 레지스터 상태</span>
            <span className="text-[10px] text-purple-400">50자리 10진수 휠</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(step.vars).map(([vName, val]) => (
              <div
                key={vName}
                className="bg-[#161b24] border border-gray-800/80 rounded p-2 flex justify-between items-center"
              >
                <span className="text-purple-300 font-bold">{vName}</span>
                <span className="text-brass-300 bg-[#0d1015] px-2 py-0.5 rounded border border-gray-800">
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-purple-950/20 border border-purple-800/30 rounded text-[11px] text-gray-300 leading-relaxed">
            <span className="font-bold text-purple-300">💡 1843년 에이다 러브레이스의 통찰:</span>
            <p className="mt-1">
              "해석기관은 단순한 숫자를 넘어, 음악이나 기호와 같은 일반적인 연산 대상을 조작할 수 있다."
              (Note G는 역사상 최초의 조건 분기 및 서브루틴을 포함한 프로그램입니다.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
