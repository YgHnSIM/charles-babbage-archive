---
name: text-align
description: Visual text, markdown table, delimiter, code assignment alignment, and semantic line breaking/wrapping with CJK (East Asian Width) compensation. Use when the user asks to "align text", "align table", "format markdown table", "align assignments", "align colons", "semantic wrap", "line wrap", "텍스트 정렬", "표 정렬", "대입문 정렬", "문자열 줄맞춤", "의미 단위 줄바꿈", "문장 단위 줄바꿈", "문맥 줄바꿈", or format monospace visual alignment.
---

# `text-align` (Visual Text, Table & Semantic Line Wrap Engine)

This skill provides precise visual text formatting, delimiter alignment, markdown table equalization, text padding, and **semantic clause/sentence line breaking (의미/문맥 단위 줄바꿈)** with full support for CJK (Korean, Japanese, Chinese) character widths.

---

## 🚀 Quick Execution Guide

The core alignment engine is located at:
`python .agents/skills/text-align/scripts/align.py` (or absolute path `c:/Vault/CharlesBBG/.agents/skills/text-align/scripts/align.py`)

### 1. Markdown Table Formatting (`--mode table`)
Calculates visual column widths (treating CJK characters as 2 columns, ASCII as 1) and formats markdown table columns neatly while preserving column alignments (`:---`, `:---:`, `---:`).

* **In-place file update**:
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode table --file path/to/doc.md --range 15:30 --in-place
  ```
* **Stdin / Stdout (Dry run)**:
  ```bash
  Get-Content table.txt | python .agents/skills/text-align/scripts/align.py --mode table
  ```

---

### 2. Delimiter Alignment (`--mode delimiter`)
Aligns code lines, assignments, or key-value pairs at a specific delimiter (e.g., `=`, `:`, `=>`, `//`, `#`).

* **Variable assignments (`=`)**:
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode delimiter -d "=" --file src/config.ts --range 10:20 --in-place
  ```
* **Vertical Colons (`:`)**:
  ```bash
  # Result: "이름    : 홍길동"
  python .agents/skills/text-align/scripts/align.py --mode delimiter -d ":" --file profile.txt
  ```
* **Attached Colons (`:`) with aligned values**:
  ```bash
  # Result: "이름:     홍길동"
  python .agents/skills/text-align/scripts/align.py --mode delimiter -d ":" --attach-delimiter --file profile.txt
  ```
* **Trailing Comments (`//` or `#`)**:
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode delimiter -d "//" --file src/types.ts
  ```

---

### 3. Semantic Line Wrapping & Breaking (`--mode wrap`)
Wraps prose, markdown lists, and paragraphs intelligently by **meaningful linguistic boundaries** without breaking words or awkward phrase splits.

* **Sentence-by-sentence breaking (`--by-sentence` / `-s`)**:
  Separates each complete sentence (`.`, `!`, `?`) into a new line (ideal for Git diff readability and editorial reviews).
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode wrap -s --file content/article.md --in-place
  ```
* **Clause/Phrase-by-clause breaking (`--by-clause` / `-c`)**:
  Splits at commas, semicolons, dashes, and natural clause connectors.
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode wrap -c --file prompt.txt
  ```
* **Width-bounded Word Wrap (`--width <N>`)**:
  Wraps lines to a target visual column width (default: 80) taking CJK width into account, maintaining hanging indentation for markdown bullet lists (`-`, `*`, `1.`) and blockquotes (`>`).
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode wrap -w 80 --file README.md --in-place
  ```

---

### 4. Text Padding & Justification (`--mode justify` / `--mode pad`)
Aligns lines to a fixed width or the longest line width.

* **Center alignment**:
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode justify --align center --file header.txt
  ```
* **Right alignment**:
  ```bash
  python .agents/skills/text-align/scripts/align.py --mode justify --align right --file numbers.txt
  ```

---

## 🛠️ CLI Options Reference

| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--mode` | `-m` | `table`, `delimiter`, `wrap`, `justify`, `pad` | `table` |
| `--by-sentence` | `-s` | Wrap mode: split lines by sentence terminators (`.`, `!`, `?`) | `False` |
| `--by-clause` | `-c` | Wrap mode: split lines by clauses/commas/punctuation | `False` |
| `--delimiter` | `-d` | Target delimiter character/string for delimiter mode | `=` |
| `--attach-delimiter` | | Attach delimiter to left content before padding | `False` |
| `--occurrence` | `-n` | N-th occurrence of delimiter to align | `1` |
| `--align` | `-a` | Alignment direction: `left`, `right`, `center` | `left` |
| `--width` | `-w` | Target visual width for justify/wrap mode | `0` (auto/80) |
| `--file` | `-f` | Target file path | `None` (stdin) |
| `--range` | `-r` | 1-indexed line range `start:end` | Whole file |
| `--in-place` | `-i` | Write changes directly back to file | `False` |
| `--test` | | Run built-in self-tests | |

---

## 💡 Best Practices

1. **Semantic Diffing**: When writing documentation or essays in Markdown, use `--mode wrap -s` (one sentence per line). This makes GitHub / Git diffs clean and line-granular.
2. **CJK Display Width**: East Asian Wide characters (한글, 한자, 전각기호) take 2 visual columns. `align.py` handles this automatically using `unicodedata.east_asian_width`.
3. **Always verify line ranges**: When operating on files in-place with `--in-place`, specify `--range start:end` to avoid touching unrelated lines.
