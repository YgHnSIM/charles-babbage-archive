# 0004. GitHub Pages 배포 파이프라인 및 모바일 반응형 UX 최적화

* **상태**: 승인됨 (Approved)
* **날짜**: 2026-08-20
* **결정자**: Project Maintainer, AI Architect

---

## 1. 배경 및 맥락 (Context)

찰스 배비지 디지털 아카이브(Charles Babbage Digital Archive) 프로젝트는 19세기 1차 사료 원본, 대조 해제, 인터랙티브 기계식 컴퓨터 시뮬레이터(차분기관 2호 및 에이다 러브레이스의 Note G 알고리즘 추적기)를 포괄하는 종합 학술·전시 웹 애플리케이션이다.

이를 전 세계 사용자와 연구자들에게 안정적으로 공개·서비스하기 위해 다음 목표를 수립했다:
1. **GitHub 생태계와 연동된 무료 고신뢰 정적 웹 호스팅 (GitHub Pages)**
2. **`main` 브랜치 푸시 시 자동 빌드·검증·배포되는 CI/CD 파이프라인 (.github/workflows/deploy.yml)**
3. **모바일 뷰포트(360px ~ 430px)에서의 완벽한 터치 UX, 가독성 및 시뮬레이터 조작성 확보**
4. **저장소 서브패스(`/charles-babbage-archive/`) 환경에서도 모든 에셋 및 내부 라우팅이 깨짐 없이 동작하는 Base URL 체계 수립**

---

## 2. 대안 검토 (Considered Options)

1. **Option A: GitHub Pages + GitHub Actions 공식 워크플로우 (선택)**
   - 장점: 별도 외부 SaaS 계정 연동 불필요, 레포지토리와 CI/CD가 단일 플랫폼에서 관리됨, 무료 SSL/TLS 및 안정적인 글로벌 CDN 제공.
   - 고려사항: 저장소 이름 기반의 서브패스(`https://<user>.github.io/<repo>/`)가 생성되므로 Astro `base` 설정 및 내부 링크의 `import.meta.env.BASE_URL` 바인딩 필요.

2. **Option B: Cloudflare Pages / Vercel**
   - 장점: 서브패스 없이 루트(`/`) 도메인 기본 배포 가능.
   - 단점: 외부 서비스 권한 연동 및 프로젝트 설정 별도 관리 필요.

---

## 3. 결정 사항 (Decision)

### 3.1 호스팅 및 CI/CD
- **배포 플랫폼**: GitHub Pages (Public Repository: `YgHnSIM/charles-babbage-archive`)
- **CI/CD 엔진**: GitHub Actions (`.github/workflows/deploy.yml`)
- **배포 워크플로우**:
  - 트리거: `main` 브랜치 푸시
  - 단계: Node.js 20 설정 -> 의존성 설치(`npm ci`) -> Astro 정적 빌드(`npm run build`) -> GitHub Pages 아티팩트 업로드 및 공식 배포 액션(`actions/deploy-pages@v4`) 실행.

### 3.2 Astro 사이트 및 서브패스 설정 (`astro.config.mjs`)
- `site`: `'https://yghnsim.github.io'`
- `base`: `'/charles-babbage-archive'`
- 모든 컴포넌트(`Navbar`, `Footer`, 페이지 간 링크)에서 `import.meta.env.BASE_URL`을 기준으로 내부 경로를 동적으로 결합하여 로컬 개발 환경과 프로덕션 배포 환경 모두에서 100% 정상 작동하도록 보장.

### 3.3 모바일 반응형 UX 표준
- **네비게이션**: 모바일 전용 햄버거 토글 드로어(Drawer) 및 최소 44px 터치 타깃 확보.
- **인터랙티브 시뮬레이터**: 톱니바퀴 휠 및 베르누이 연산 트레이스 표에 부드러운 터치 가로 스크롤(`overflow-x-auto`)과 반응형 스택 레이아웃 적용.
- **타이포그래피**: `break-keep`(한글 어절 단위 줄바꿈) 및 `text-align` 스킬의 제목 균형 개행 유지.

---

## 4. 결과 및 영향 (Consequences)

* **긍정적 영향**:
  - `git push origin main` 단 한 번의 명령으로 수십 초 내에 글로벌 웹에 최신 버전이 자동 배포됨.
  - 모바일 스마트폰부터 대형 데스크톱 모니터까지 일관되고 몰입감 있는 전시 경험 제공.
* **유의 사항**:
  - 정적 에셋(이미지, PDF) 추가 시 항상 `base` 경로를 고려하여 참조할 것.
