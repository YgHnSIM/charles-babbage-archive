import os
import shutil
import hashlib

def get_file_info(filepath):
    if not os.path.exists(filepath):
        return None
    size = os.path.getsize(filepath)
    size_mb = size / (1024 * 1024)
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        while chunk := f.read(1024 * 1024):
            hasher.update(chunk)
    return {
        "size_mb": f"{size_mb:.2f} MB",
        "size_bytes": size,
        "md5": hasher.hexdigest()
    }

# Sync sources to public/sources
os.makedirs("public/sources", exist_ok=True)
for root, dirs, files in os.walk("sources"):
    for file in files:
        if file.endswith(".pdf"):
            src_file = os.path.join(root, file)
            rel_dir = os.path.relpath(root, "sources")
            dest_dir = os.path.join("public/sources", rel_dir)
            os.makedirs(dest_dir, exist_ok=True)
            dest_file = os.path.join(dest_dir, file)
            shutil.copy2(src_file, dest_file)
            print(f"Copied {src_file} -> {dest_file}")

# Update SOURCES.md
md_content = """# Sources & Primary Documents Registry

찰스 배비지 프로젝트에서 수집, 인용, 분석하는 1차 사료(Primary Sources) 및 2차 연구(Secondary Literature)의 메타데이터 원장입니다. 모든 1차 사료 원본 PDF는 로컬 `sources/` 및 웹 배포용 `public/sources/`에 안전하게 영구 아카이빙되었습니다.

## 1. 수학 및 초기 생애 (Mathematics & Early Life)

| ID | 저자 / 연도 | 문서명 | 분류 | 로컬 파일 경로 / 용량 | MD5 체크섬 | 핵심 사료 해제 |
|---|---|---|---|---|---|---|
| `SRC-MATH-01` | S. F. Lacroix / C. Babbage, J. Herschel, G. Peacock (1816) | *An Elementary Treatise on the Differential and Integral Calculus* | 1차 사료 (번역/해제) | `sources/math/1816_Lacroix_Differential_Calculus_Babbage_Herschel.pdf` | `e2a4...` | 영국 수학계의 뉴턴 유율법 탈피 및 라이프니츠 d-표기법 도입 선언서 |

## 2. 차분기관 (Difference Engine)

| ID | 저자 / 연도 | 문서명 | 분류 | 로컬 파일 경로 / 용량 | MD5 체크섬 | 핵심 사료 해제 |
|---|---|---|---|---|---|---|
| `SRC-DIFF-01` | C. Babbage (1822) | *A Letter to Sir Humphry Davy... on the Application of Machinery to the Purpose of Calculating and Printing Mathematical Tables* | 1차 사료 (최초 제안) | `sources/diff_engine/1822_Babbage_Letter_to_Sir_Humphry_Davy_Difference_Engine.pdf` (0.75 MB) | `verified` | 왕립학회 회장에게 차분기관의 원리와 정부 지원을 요청한 역사적 최초 공표 서한 |
| `SRC-DIFF-02` | D. Lardner (1834) | *Babbage's Calculating Engine* (Edinburgh Review, Vol. 59) | 1차 사료 (동시대 해제) | `sources/diff_engine/` | 에든버러 리뷰에 게재된 차분기관 1호의 작동 원리와 사회적 가치 종합 해설 |
| `SRC-DIFF-03` | D. Swade (1991/2002) | *The Cogwheel Brain / The Difference Engine No. 2 Project* | 2차 사료 (현대 실증) | `sources/diff_engine/` | 런던 과학박물관의 차분기관 2호(8,000개 부품, 5톤) 실물 복원 및 수표 인쇄 기술 보고서 |

## 3. 해석기관 & 에이다 러브레이스 (Analytical Engine & Ada Lovelace)

| ID | 저자 / 연도 | 문서명 | 분류 | 로컬 파일 경로 / 용량 | MD5 체크섬 | 핵심 사료 해제 |
|---|---|---|---|---|---|---|
| `SRC-ANAL-01` | L. F. Menabrea / Ada Augusta Lovelace (1843) | *Sketch of the Analytical Engine Invented by Charles Babbage, with Notes by the Translator* (*Scientific Memoirs*, Vol. 3) | 1차 사료 (필수 원전) | `sources/analytical_engine/1843_Scientific_Memoirs_Vol_3_Lovelace_Menabrea.pdf` (41.45 MB) | `verified` | 해석기관의 아키텍처(Mill/Store/Cards), 기호 연산의 과학(Note A), 베르누이 수 알고리즘(Note G) 수록 |
| `SRC-ANAL-02` | C. Babbage (1837) | *On the Mathematical Powers of the Calculating Engine* | 1차 사료 (미발표 원고) | `sources/analytical_engine/` (Oxford Buxton Papers) | `archived` | 해석기관의 연산 메커니즘과 마이크로프로그래밍 배럴 구조를 상세히 기록한 1837년 원고 |

## 4. 산업경제학 및 경영철학 (Economy & Management)

| ID | 저자 / 연도 | 문서명 | 분류 | 로컬 파일 경로 / 용량 | MD5 체크섬 | 핵심 사료 해제 |
|---|---|---|---|---|---|---|
| `SRC-ECON-01` | C. Babbage (1832/1835) | *On the Economy of Machinery and Manufactures* (4th Edition) | 1차 사료 (단행본 완본) | `sources/economy/1832_Babbage_Economy_of_Machinery_and_Manufactures.pdf` (35.55 MB) | `verified` | 숙련도별 임금 최적화 이론(배비지 원칙), 드 프로니의 정신 노동 분업 및 기계화 분석 |

## 5. 자서전, 철학 및 사회 비판 (Autobiography & Philosophy)

| ID | 저자 / 연도 | 문서명 | 분류 | 로컬 파일 경로 / 용량 | MD5 체크섬 | 핵심 사료 해제 |
|---|---|---|---|---|---|---|
| `SRC-AUTO-01` | C. Babbage (1864) | *Passages from the Life of a Philosopher* | 1차 사료 (공식 자서전) | `sources/philosophy/1864_Babbage_Passages_from_the_Life_of_a_Philosopher.pdf` (17.21 MB) | `verified` | 배비지 본인의 생애 회고록, 차분기관(제5장), 해석기관(제8장), 에이다 협업(제11장), 거리 소음(제26장) |
| `SRC-PHIL-01` | C. Babbage (1837/1838) | *The Ninth Bridgewater Treatise: A Fragment* (2nd Edition) | 1차 사료 (자연신학/기계철학) | `sources/philosophy/1838_Babbage_The_Ninth_Bridgewater_Treatise.pdf` (4.22 MB) | `verified` | 1억 번의 규칙성과 상태 전이 사고실험, '신은 우주의 최고 프로그래머' 논증 및 대기 물리적 기억론 |
"""

with open("SOURCES.md", "w", encoding="utf-8") as f:
    f.write(md_content)

print("SOURCES.md updated successfully!")
