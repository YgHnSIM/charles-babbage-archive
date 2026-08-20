import React, { useState } from 'react';
import { Network, Compass, Search } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  labelEn: string;
  cluster: 'geography' | 'tool' | 'political_economy' | 'theology';
  clusterLabel: string;
  clusterColor: string;
  summary: string;
  quote?: string;
  quoteSource?: string;
  connections: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
  type: 'extracted' | 'inferred';
}

const CLUSTERS = {
  geography: { label: '1. 지능과 감시의 지리학', color: '#3b82f6', bg: 'bg-blue-950/40', border: 'border-blue-500/40', text: 'text-blue-300' },
  tool: { label: '2. 공장제와 기계공구 기술', color: '#d97706', bg: 'bg-amber-950/40', border: 'border-amber-500/40', text: 'text-amber-300' },
  political_economy: { label: '3. 정치경제학과 마르크스 비판', color: '#e11d48', bg: 'bg-rose-950/40', border: 'border-rose-500/40', text: 'text-rose-300' },
  theology: { label: '4. 기계철학과 자연신학의 신격화', color: '#9333ea', bg: 'bg-purple-950/40', border: 'border-purple-500/40', text: 'text-purple-300' },
};

const NODES: GraphNode[] = [
  {
    id: 'human-computer',
    label: '인간 계산원 (Human Computer)',
    labelEn: 'The Human Computer',
    cluster: 'geography',
    clusterLabel: '지능과 감시의 지리학',
    clusterColor: '#3b82f6',
    summary: '19세기 초 "컴퓨터"는 기계가 아니라 고용된 저임금 인간 계산 노동자를 의미했습니다. 배비지는 1814년 그리니치 왕립천문대 계산원 직에 지원하기도 했습니다.',
    quote: '배비지 씨의 발명은 단순 도구가 아닌 지적 과정을 기계로 대체하여, 컴퓨터(인간)의 자리에 엔진을 올려놓았다.',
    quoteSource: '헨리 콜브룩(Henry Colebrooke), 1824년 왕립천문학회 금메달 수여사',
    connections: ['mechanical-notation', 'difference-engine', 'portsmouth-system']
  },
  {
    id: 'mechanical-notation',
    label: '기계 기호 표기법 (Mechanical Notation)',
    labelEn: 'Mechanical Notation as Panopticon',
    cluster: 'geography',
    clusterLabel: '지능과 감시의 지리학',
    clusterColor: '#3b82f6',
    summary: '기계의 모든 가동 부품과 노동자의 동작을 한눈에 일람·감시할 수 있도록 고안한 시각 기호 체계. 벤섬의 파놉티콘과 같은 "보편 경영 관리 테크놀로지"였습니다.',
    quote: '모든 감각 중 시각이 지능을 가장 빠르게 정신에 전달한다. 이 표기법을 통해 공장의 조직과 노동자의 직무를 일관된 시스템으로 규율할 수 있다.',
    quoteSource: '디오니시우스 라드너(Dionysius Lardner), 1834년 에든버러 리뷰',
    connections: ['human-computer', 'dorset-salon', 'portsmouth-system']
  },
  {
    id: 'dorset-salon',
    label: '도싯 가 1번지 살롱 (메릴본)',
    labelEn: '1 Dorset Street Salon',
    cluster: 'geography',
    clusterLabel: '지능과 감시의 지리학',
    clusterColor: '#3b82f6',
    summary: '배비지의 자택이자 방화 공방. 은빛 숙녀(오토마타)와 차분기관 시제품을 나란히 전시하며 런던 엘리트들의 지적 시선을 유인하고 관리했습니다.',
    quote: '배비지의 토요 살롱은 우주의 기관실에 입장하는 것과 같았다.',
    quoteSource: '시드니 스미스(Sydney Smith)',
    connections: ['mechanical-notation', 'miracle-proof', 'darwin-origin']
  },
  {
    id: 'portsmouth-system',
    label: '포츠머스 도크야드 시스템',
    labelEn: 'Portsmouth Block-Making System',
    cluster: 'tool',
    clusterLabel: '공장제와 기계공구 기술',
    clusterColor: '#d97706',
    summary: '새뮤얼 벤섬, 마크 브루넬, 헨리 모즐리가 1795~1807년 구축한 해군 활차 블록 일관 자동화 공정. 목공 장인들의 자율성을 군사적으로 규율하고 자동 공구로 대체했습니다.',
    quote: '블록 공장에 들어서는 순간 관람객은 그 움직임의 다양성과 동작의 신속함에 압도당한다.',
    quoteSource: '1810년대 포츠머스 도크야드 관광 가이드북',
    connections: ['human-computer', 'clement-conflict', 'invisible-labour']
  },
  {
    id: 'clement-conflict',
    label: '조셉 클레먼트와의 소유권 분쟁',
    labelEn: 'Joseph Clement Workshop Strife',
    cluster: 'tool',
    clusterLabel: '공장제와 기계공구 기술',
    clusterColor: '#d97706',
    summary: '람베스 공방의 마스터 엔지니어 클레먼트와 배비지 간의 10년 갈등. 발명가의 순수 정신적 소유권과 기계공의 도구/숙련 소유권이 정면 충돌했습니다.',
    quote: '이 발명에 대한 나의 처분권은 그 어떤 세습 재산보다 신성하다. 그것은 오직 내 자신의 정신이 낳은 절대적 창조물이기 때문이다.',
    quoteSource: '배비지가 웰링턴 공작에게 보낸 1834년 서한',
    connections: ['portsmouth-system', 'invisible-labour', 'babbage-principle']
  },
  {
    id: 'invisible-labour',
    label: '보이지 않는 노동 (Invisible Labour)',
    labelEn: 'Invisible Labour & Anonymous History',
    cluster: 'tool',
    clusterLabel: '공장제와 기계공구 기술',
    clusterColor: '#d97706',
    summary: '기계를 "스스로 생각하는 지능적 주체"로 포장하기 위해 기계를 가공하고 정밀 조정한 장인들과 운용 노동자들의 육체 노동을 체계적으로 지워버린 이데올로기.',
    quote: '자동화의 역사는 언제나 익명의 역사(Anonymous History)에 빚지고 있다.',
    quoteSource: '지크프리트 기디온(Siegfried Giedion), 1948년',
    connections: ['clement-conflict', 'ure-automaton', 'marx-subjekt']
  },
  {
    id: 'babbage-principle',
    label: '배비지 원칙과 두뇌 노동 분업',
    labelEn: 'The Babbage Principle & Prony Hierarchy',
    cluster: 'tool',
    clusterLabel: '공장제와 기계공구 기술',
    clusterColor: '#d97706',
    summary: '드 프로니의 3단계 계산 피라미드에서 가장 단순한 제3계층 덧셈 노동을 톱니바퀴로 대체. 숙련도별로 노동력을 쪼개어 임금 지출을 최소화하는 분업 원리.',
    quote: '공장주는 각 공정에 정확히 필요한 만큼의 기술과 힘을 가진 노동자만을 구매할 수 있다.',
    quoteSource: '찰스 배비지, 『기계 및 제조업의 경제학』 (1832)',
    connections: ['clement-conflict', 'ure-automaton', 'marx-subjekt']
  },
  {
    id: 'ure-automaton',
    label: '앤드루 유어의 자동인형 공장론',
    labelEn: 'Andrew Ure: Factory as Vast Automaton',
    cluster: 'political_economy',
    clusterLabel: '정치경제학과 마르크스 비판',
    clusterColor: '#e11d48',
    summary: '『공장의 철학』(1835)에서 공장을 "스스로 조절되는 동력에 종속된 거대한 자동인형"이자 노동자들의 규율을 완성하는 유토피아적 실험실로 규정.',
    quote: '근대 제조업자의 위대한 목표는 자본과 과학의 결합을 통해 노동자의 역할을 감시와 민첩성으로 축소시키는 것이다.',
    quoteSource: '앤드루 유어(Andrew Ure), 1835년',
    connections: ['babbage-principle', 'invisible-labour', 'marx-subjekt']
  },
  {
    id: 'marx-subjekt',
    label: '마르크스의 주체/객체 전도 비판',
    labelEn: 'Marx Critique: Inversion of Subject/Object',
    cluster: 'political_economy',
    clusterLabel: '정치경제학과 마르크스 비판',
    clusterColor: '#e11d48',
    summary: '마르크스는 유어와 배비지의 공장론을 통렬히 해부하며, 자본주의 기계 체제에서 "기계 자동인형이 주체(Subjekt)가 되고 인간 노동자는 의식 있는 부품으로 전락한다"고 비판.',
    quote: '하나의 서술에서 결합된 집단 노동자는 지배적인 주체이고 기계는 객체이다. 그러나 다른 서술에서 자동인형 자체가 주체이며 노동자는 단지 의식 있는 기관에 불과하다.',
    quoteSource: '칼 마르크스, 『자본론』 제1권 (MEW 23, S. 544)',
    connections: ['ure-automaton', 'invisible-labour', 'general-intellect']
  },
  {
    id: 'general-intellect',
    label: '제너럴 인텔렉트 (General Intellect)',
    labelEn: 'General Intellect & Fixed Capital',
    cluster: 'political_economy',
    clusterLabel: '정치경제학과 마르크스 비판',
    clusterColor: '#e11d48',
    summary: '『그룬트리스』 기계 단편에서 배비지의 계산 기계화를 일반 사회적 지식(General Intellect)이 고정자본으로 응고되어 사회의 직접적 생산력이 되는 과정으로 포착.',
    quote: '고정자본의 발전은 일반적 사회적 지식이 어느 정도로 직접적인 생산력이 되었는가를 보여준다.',
    quoteSource: '칼 마르크스, 『그룬트리스』 (MEW 42, S. 602)',
    connections: ['marx-subjekt', 'miracle-proof']
  },
  {
    id: 'whewell-debate',
    label: '윌리엄 휴얼과의 기계철학 논쟁',
    labelEn: 'Debate with William Whewell',
    cluster: 'theology',
    clusterLabel: '기계철학과 자연신학의 신격화',
    clusterColor: '#9333ea',
    summary: '케임브리지의 보수적 수학 튜터 휴얼이 "기계적 분석은 기차를 타고 역을 드나드는 것과 같아 인간 정신을 훈련시키지 못한다"며 기계 철학을 배척하자 배비지가 반박에 나섬.',
    quote: '우리는 기계론적 철학자들에게 우주의 섭리를 논할 권한을 결코 부여할 수 없다.',
    quoteSource: '윌리엄 휴얼(William Whewell), 1834년 브리지워터 논문',
    connections: ['miracle-proof', 'dorset-salon']
  },
  {
    id: 'miracle-proof',
    label: '100만 번째 기적 증명 (제9 브리지워터)',
    labelEn: 'Babbage Miracle Proof (1,000,000 to 1,000,010,002)',
    cluster: 'theology',
    clusterLabel: '기계철학과 자연신학의 신격화',
    clusterColor: '#9333ea',
    summary: '기계가 100만 번 동안 1씩 증가하다가 100만 1번째에 10,000씩 도약하는 출력. 관찰자에게는 "기적"처럼 보이지만 설계자에게는 사전에 코딩된 "고차원 법칙"임을 증명.',
    quote: '신은 매 순간 법칙을 깨뜨리는 시계공이 아니라, 모든 기적까지 고차원 알고리즘으로 코딩한 지고의 프로그래머이다.',
    quoteSource: '찰스 배비지, 『제9 브리지워터 논문』 (1837)',
    connections: ['whewell-debate', 'darwin-origin', 'dorset-salon']
  },
  {
    id: 'darwin-origin',
    label: '찰스 다윈과 종의 기원 유추',
    labelEn: 'Charles Darwin & Origin of Species',
    cluster: 'theology',
    clusterLabel: '기계철학과 자연신학의 신격화',
    clusterColor: '#9333ea',
    summary: '다윈은 도싯 가 살롱에서 배비지의 "기적 증명"을 직접 목격하고, 신의 초자연적 개입 없이 자연법칙 자체의 전개로 새로운 종이 출현할 수 있다는 결정적 유추를 얻음.',
    quote: '다윈은 배비지의 살롱에서 깊은 교훈을 얻었고, 배비지의 시스템을 초자연적 개입 없는 자연법칙에 의한 종의 기원 유사 모델로 삼았다.',
    quoteSource: '사이먼 샤퍼(Simon Schaffer), 1994년 논문 p. 225',
    connections: ['miracle-proof', 'dorset-salon']
  }
];

const EDGES: GraphEdge[] = [
  { source: 'human-computer', target: 'mechanical-notation', relation: '감시 및 규율화', type: 'extracted' },
  { source: 'portsmouth-system', target: 'clement-conflict', relation: '기계공구 공방 계승', type: 'extracted' },
  { source: 'clement-conflict', target: 'invisible-labour', relation: '장인 숙련의 비가시화', type: 'extracted' },
  { source: 'babbage-principle', target: 'ure-automaton', relation: '공장제 분업 이론화', type: 'extracted' },
  { source: 'ure-automaton', target: 'marx-subjekt', relation: '주객 전도 비판', type: 'extracted' },
  { source: 'marx-subjekt', target: 'general-intellect', relation: '고정자본과 지식 대상화', type: 'extracted' },
  { source: 'whewell-debate', target: 'miracle-proof', relation: '기계론적 자연신학 반박', type: 'extracted' },
  { source: 'miracle-proof', target: 'darwin-origin', relation: '자연법칙 진화론 유추', type: 'extracted' },
  { source: 'dorset-salon', target: 'darwin-origin', relation: '살롱 시연 및 교류', type: 'extracted' },
  { source: 'mechanical-notation', target: 'portsmouth-system', relation: '파놉티콘적 일람 통제', type: 'inferred' },
  { source: 'invisible-labour', target: 'marx-subjekt', relation: '노동력 소외 분석', type: 'inferred' },
  { source: 'general-intellect', target: 'miracle-proof', relation: '기계화된 지능의 우주론', type: 'inferred' },
];

export default function SociotechnicalGraph() {
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [activeNode, setActiveNode] = useState<GraphNode>(NODES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNodes = NODES.filter((node) => {
    const matchesCluster = selectedCluster === 'all' || node.cluster === selectedCluster;
    const matchesSearch =
      searchQuery === '' ||
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.labelEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCluster && matchesSearch;
  });

  return (
    <div className="w-full bg-[#0d1015] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header & Cluster Filter Pills */}
      <div className="p-4 sm:p-5 bg-[#12161f] border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-brass-400" />
            <h3 className="text-base sm:text-lg font-display font-bold text-white">
              사이먼 샤퍼 『Babbage's Intelligence』 지식 그래프
            </h3>
          </div>
          <div className="text-xs font-mono text-gray-400">
            13개 핵심 노드 · 4대 테마 군집 (GraphRAG Ready)
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap min-h-[36px] ${
              selectedCluster === 'all'
                ? 'bg-brass-500 text-iron-950 font-bold shadow-md'
                : 'bg-[#181e28] text-gray-300 hover:text-white border border-gray-700/60'
            }`}
          >
            전체 보기 ({NODES.length})
          </button>
          {Object.entries(CLUSTERS).map(([key, cfg]) => {
            const count = NODES.filter((n) => n.cluster === key).length;
            const isSelected = selectedCluster === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCluster(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap min-h-[36px] border ${
                  isSelected
                    ? `${cfg.bg} ${cfg.text} ${cfg.border} font-bold shadow-md`
                    : 'bg-[#181e28] text-gray-400 hover:text-gray-200 border-gray-700/60'
                }`}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Interactive Node Matrix (Left) + Detail Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Nodes Grid & Search */}
        <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-6 bg-[#090b0e] flex flex-col justify-between">
          <div>
            {/* Search Bar */}
            <div className="relative mb-5">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="지식 그래프 개념, 인물, 저서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12161f] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brass-400"
              />
            </div>

            {/* Node Matrix Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                const clusterCfg = CLUSTERS[node.cluster];

                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#181e28] border-brass-400 shadow-lg scale-[1.01]'
                        : 'bg-[#12161f] border-gray-800/80 hover:border-gray-700 hover:bg-[#151a24]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${clusterCfg.color}20`,
                            color: clusterCfg.color,
                            border: `1px solid ${clusterCfg.color}40`,
                          }}
                        >
                          {node.clusterLabel}
                        </span>
                        {isSelected && <span className="text-brass-400 text-xs font-mono">선택됨 ●</span>}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white font-sans mb-0.5">
                        {node.label}
                      </h4>
                      <p className="text-[10px] font-mono text-gray-400 mb-2">{node.labelEn}</p>
                    </div>

                    <p className="text-[11px] text-gray-300 font-body-serif line-clamp-2 leading-relaxed">
                      {node.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Graph Connection Flow Diagram */}
          <div className="mt-6 pt-4 border-t border-gray-800/80">
            <div className="text-[11px] font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brass-400" />
              <span>사이먼 샤퍼의 4대 전환 흐름 (Dialectical Transition)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-center">
              <div className="p-2 bg-blue-950/30 border border-blue-500/30 rounded text-blue-300">
                1. 인간 계산원<br />(감시와 규율)
              </div>
              <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded text-amber-300">
                2. 공장제 공구<br />(장인 기술의 소외)
              </div>
              <div className="p-2 bg-rose-950/30 border border-rose-500/30 rounded text-rose-300">
                3. 마르크스 비판<br />(주객의 전도)
              </div>
              <div className="p-2 bg-purple-950/30 border border-purple-500/30 rounded text-purple-300">
                4. 자연신학 & 다윈<br />(기계 지능의 신격화)
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Deep-Dive Detail (Right Drawer) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#12161f] border-t lg:border-t-0 lg:border-l border-gray-800 p-5 sm:p-6 flex flex-col justify-between">
          {activeNode ? (
            <div className="space-y-4">
              <div>
                <div
                  className="inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full mb-2"
                  style={{
                    backgroundColor: `${CLUSTERS[activeNode.cluster].color}20`,
                    color: CLUSTERS[activeNode.cluster].color,
                    border: `1px solid ${CLUSTERS[activeNode.cluster].color}40`,
                  }}
                >
                  {activeNode.clusterLabel}
                </div>
                <h3 className="text-lg font-bold text-white font-display">{activeNode.label}</h3>
                <p className="text-xs font-mono text-brass-300/90">{activeNode.labelEn}</p>
              </div>

              <div className="p-3.5 bg-[#0d1015] rounded-xl border border-gray-800 text-xs font-body-serif text-gray-200 leading-relaxed">
                {activeNode.summary}
              </div>

              {activeNode.quote && (
                <div className="p-3.5 bg-[#181e28] border-l-4 border-brass-400 rounded-r-xl space-y-1.5">
                  <p className="text-xs font-body-serif italic text-brass-200 leading-relaxed">
                    "{activeNode.quote}"
                  </p>
                  {activeNode.quoteSource && (
                    <p className="text-[10px] font-sans not-italic text-gray-400 text-right">
                      — {activeNode.quoteSource}
                    </p>
                  )}
                </div>
              )}

              {/* Connected Concepts */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-gray-400 mb-2">연관 지식 노드:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.connections.map((connId) => {
                    const targetNode = NODES.find((n) => n.id === connId);
                    if (!targetNode) return null;
                    return (
                      <button
                        key={connId}
                        onClick={() => setActiveNode(targetNode)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0d1015] text-gray-300 border border-gray-800 hover:border-brass-400 hover:text-white transition-all"
                      >
                        → {targetNode.label.split(' (')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs font-mono text-gray-500 py-12">
              개념 노드를 선택해 주세요.
            </div>
          )}

          <div className="mt-6 pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500 text-center">
            출처: Simon Schaffer, Critical Inquiry 21 (1994), pp. 203-227
          </div>
        </div>
      </div>
    </div>
  );
}
