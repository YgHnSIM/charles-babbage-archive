---
name: text-align
description: Visual text, markdown table, delimiter, and code assignment alignment with CJK (East Asian Width) compensation. Use when the user asks to "align text", "align table", "format markdown table", "align assignments", "align colons", "텍스트 정렬", "표 정렬", "대입문 정렬", "문자열 줄맞춤", or format monospace visual alignment.
---

# `text-align` (Visual Text & Table Alignment Engine)

This skill provides precise visual text formatting, delimiter alignment, markdown table equalization, and text padding with full support for CJK (Korean, Japanese, Chinese) character widths.

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

### 3. Text Padding & Justification (`--mode justify` / `--mode pad`)
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
| `--mode` | `-m` | `table`, `delimiter`, `justify`, `pad` | `table` |
| `--delimiter` | `-d` | Target delimiter character/string | `=` |
| `--attach-delimiter` | | Attach delimiter to left content before padding | `False` |
| `--occurrence` | `-n` | N-th occurrence of delimiter to align | `1` |
| `--align` | `-a` | Alignment direction: `left`, `right`, `center` | `left` |
| `--width` | `-w` | Target visual width for justify mode | `0` (auto) |
| `--file` | `-f` | Target file path | `None` (stdin) |
| `--range` | `-r` | 1-indexed line range `start:end` | Whole file |
| `--in-place` | `-i` | Write changes directly back to file | `False` |
| `--test` | | Run built-in self-tests | |

---

## 💡 Best Practices

1. **Always verify line ranges**: When operating on files in-place with `--in-place`, specify `--range start:end` to avoid touching unrelated lines.
2. **CJK Display Width**: East Asian Wide characters (한글, 한자, 전각기호) take 2 visual columns. `align.py` handles this automatically using `unicodedata.east_asian_width`.
3. **Dry-run First**: If uncertain, run without `--in-place` to inspect the aligned output before modifying files.
