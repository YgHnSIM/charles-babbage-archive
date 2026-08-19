# 0003. 전문 서브에이전트 병렬 협업 아키텍처

자료조사, 빅토리아조 영문 사료 정밀 번역, 기계 아키텍처 기술 해설, Astro 웹 프론트엔드 구축 작업을 전담 서브에이전트(Subagents)로 분할하여 병렬로 수행하기로 결정했다.

## 서브에이전트 역할 분담
1. **Source Researcher Agent**: Internet Archive, Royal Society, British Library 등에서 1차 사료 PDF 탐색 및 `sources/` 디렉토리 자동 적재/메타데이터 갱신.
2. **Translation & Fact-Checker Agent**: 19세기 영문 사료의 핵심 대목 정밀 번역 및 연표(Chronology) 팩트 교차 검증.
3. **Engine Mechanics & CS Analyst Agent**: 차분기관 유한차분법 및 해석기관(Mill, Store, Jacquard Card)의 작동 원리를 현대 컴퓨터 구조와 대조하고 베르누이 수 알고리즘(Note G) 파이썬/다이어그램 코드화.
4. **Web UI/Frontend Developer Agent**: Astro + Tailwind CSS 기반의 반응형 아카이브 및 타임라인 웹페이지 컴포넌트 구현.
