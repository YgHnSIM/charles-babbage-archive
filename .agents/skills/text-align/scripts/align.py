#!/usr/bin/env python3
"""
text-align helper engine
Supports:
1. Markdown table auto-formatting with CJK East Asian Width awareness.
2. Delimiter alignment (assignments, colons, comments).
3. Line padding / justification (left, right, center).
"""

import sys
import argparse
import unicodedata
import re
from typing import List, Tuple, Optional


def get_display_width(text: str) -> int:
    """
    Calculate visual display width of a string.
    East Asian Wide ('W') and Fullwidth ('F') characters take 2 columns.
    Other printable characters take 1 column.
    ANSI escape sequences (if any) take 0 columns.
    """
    # Strip ANSI escape sequences if any
    clean_text = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', text)
    width = 0
    for char in clean_text:
        status = unicodedata.east_asian_width(char)
        if status in ('W', 'F'):
            width += 2
        else:
            width += 1
    return width


def pad_to_width(text: str, target_width: int, align: str = 'left') -> str:
    """
    Pads a string to the target visual display width.
    align: 'left', 'right', or 'center'
    """
    current_width = get_display_width(text)
    pad_needed = max(0, target_width - current_width)
    
    if align == 'right':
        return ' ' * pad_needed + text
    elif align == 'center':
        left_pad = pad_needed // 2
        right_pad = pad_needed - left_pad
        return ' ' * left_pad + text + ' ' * right_pad
    else:  # left
        return text + ' ' * pad_needed


def align_table(lines: List[str]) -> List[str]:
    """
    Align a Markdown table with CJK awareness and alignment indicator preservation.
    """
    if not lines:
        return []

    # Parse rows and extract cells
    raw_rows: List[List[str]] = []
    leading_indents: List[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Check leading indent
        indent_match = re.match(r'^(\s*)', line)
        leading_indents.append(indent_match.group(1) if indent_match else '')
        
        # Split by pipe
        cells = [c.strip() for c in stripped.split('|')]
        # If starts with pipe, first element is empty
        if cells and cells[0] == '':
            cells.pop(0)
        # If ends with pipe, last element is empty
        if cells and cells[-1] == '':
            cells.pop(-1)
        raw_rows.append(cells)

    if not raw_rows:
        return lines

    num_cols = max(len(row) for row in raw_rows)
    # Normalize row lengths
    for row in raw_rows:
        while len(row) < num_cols:
            row.append('')

    # Identify separator row (e.g., :---, ---:, :---:, ---)
    sep_row_idx = -1
    col_alignments = ['left'] * num_cols

    for idx, row in enumerate(raw_rows):
        is_sep = True
        alignments = []
        for cell in row:
            clean_cell = cell.replace(' ', '')
            if not clean_cell or not all(c in ':-' for c in clean_cell) or '-' not in clean_cell:
                is_sep = False
                break
            if clean_cell.startswith(':') and clean_cell.endswith(':'):
                alignments.append('center')
            elif clean_cell.endswith(':'):
                alignments.append('right')
            elif clean_cell.startswith(':'):
                alignments.append('left')
            else:
                alignments.append('left')
        
        if is_sep and len(alignments) == num_cols:
            sep_row_idx = idx
            col_alignments = alignments
            break

    # Compute max visual width per column (ignoring the separator row itself)
    col_widths = [3] * num_cols  # minimum width of 3 for '---'
    for idx, row in enumerate(raw_rows):
        if idx == sep_row_idx:
            continue
        for col_idx, cell in enumerate(row):
            col_widths[col_idx] = max(col_widths[col_idx], get_display_width(cell))

    # Format the table
    formatted_lines: List[str] = []
    base_indent = leading_indents[0] if leading_indents else ''

    for idx, row in enumerate(raw_rows):
        if idx == sep_row_idx:
            # Build separator row
            sep_cells = []
            for col_idx, width in enumerate(col_widths):
                align = col_alignments[col_idx]
                if align == 'center':
                    sep_cells.append(':' + '-' * max(1, width - 2) + ':')
                elif align == 'right':
                    sep_cells.append('-' * max(1, width - 1) + ':')
                else:  # left or default
                    sep_cells.append(':' + '-' * max(1, width - 1))
            formatted_lines.append(f"{base_indent}| " + " | ".join(sep_cells) + " |")
        else:
            padded_cells = []
            for col_idx, cell in enumerate(row):
                align = col_alignments[col_idx]
                width = col_widths[col_idx]
                padded_cells.append(pad_to_width(cell, width, align=align))
            formatted_lines.append(f"{base_indent}| " + " | ".join(padded_cells) + " |")

    return formatted_lines


def align_delimiter(lines: List[str], delimiter: str = "=", occurrence: int = 1, attach_delimiter: bool = False) -> List[str]:
    """
    Align lines by a specific delimiter (e.g. '=', ':', '=>', '//').
    Pads left side before (or with) the delimiter to match visual width.
    """
    parsed: List[Tuple[str, str, str, str]] = []  # (indent, left_part, delim_match, right_part)
    max_left_width = 0

    # Escape delimiter for regex if literal
    delim_pattern = re.escape(delimiter) if not (delimiter.startswith('/') and delimiter.endswith('/')) else delimiter.strip('/')

    for line in lines:
        matches = list(re.finditer(delim_pattern, line))
        if len(matches) < occurrence:
            parsed.append(('', '', '', line))
            continue

        match = matches[occurrence - 1]
        start_idx = match.start()
        end_idx = match.end()

        left_side = line[:start_idx].rstrip()
        delim_str = line[start_idx:end_idx].strip()
        right_side = line[end_idx:].strip()

        # Extract indent from left_side
        indent_match = re.match(r'^(\s*)', left_side)
        indent = indent_match.group(1) if indent_match else ''
        content_left = left_side[len(indent):]

        if attach_delimiter:
            content_left = f"{content_left}{delim_str}"

        visual_width = get_display_width(content_left)
        max_left_width = max(max_left_width, visual_width)

        parsed.append((indent, content_left, delim_str, right_side))

    is_colon = delimiter.strip() == ':'
    is_comment = delimiter.strip() in ('//', '#', '--', '/*')

    formatted_lines: List[str] = []
    for indent, content_left, delim_str, right_side in parsed:
        if not delim_str:
            # Untouched line
            formatted_lines.append(right_side)
        else:
            padded_left = pad_to_width(content_left, max_left_width, align='left')
            if attach_delimiter:
                if right_side:
                    formatted_lines.append(f"{indent}{padded_left} {right_side}")
                else:
                    formatted_lines.append(f"{indent}{padded_left}")
            elif is_colon:
                # Vertical colon line: e.g. "이름    : 홍길동"
                if right_side:
                    formatted_lines.append(f"{indent}{padded_left}: {right_side}")
                else:
                    formatted_lines.append(f"{indent}{padded_left}:")
            elif is_comment:
                if right_side:
                    formatted_lines.append(f"{indent}{padded_left}  {delim_str} {right_side}")
                else:
                    formatted_lines.append(f"{indent}{padded_left}  {delim_str}")
            else:
                if right_side:
                    formatted_lines.append(f"{indent}{padded_left} {delim_str} {right_side}")
                else:
                    formatted_lines.append(f"{indent}{padded_left} {delim_str}")

    return formatted_lines


def align_justify(lines: List[str], target_width: int = 0, align: str = 'left') -> List[str]:
    """
    Pad/justify lines to a target width or the longest line's width.
    """
    stripped_lines = [line.strip() for line in lines]
    if target_width <= 0:
        target_width = max(get_display_width(line) for line in stripped_lines) if stripped_lines else 0

    return [pad_to_width(line, target_width, align=align) for line in stripped_lines]


def split_into_sentences(text: str) -> List[str]:
    """
    Split text into individual sentences based on punctuation (. ! ?)
    while preserving quotation marks and avoiding middle-number dots.
    """
    # Regex splitting on sentence end markers followed by whitespace
    pattern = r'([.?!]["\']?)\s+'
    tokens = re.split(pattern, text)
    sentences = []
    i = 0
    while i < len(tokens):
        part = tokens[i].strip()
        if i + 1 < len(tokens) and re.match(r'^[.?!]["\']?$', tokens[i+1]):
            part += tokens[i+1]
            i += 2
        else:
            i += 1
        if part:
            sentences.append(part)
    return sentences if sentences else [text]


def split_into_clauses(text: str) -> List[str]:
    """
    Split text into individual clauses based on punctuation (, ; : — . ! ?)
    while keeping the punctuation attached to the preceding clause.
    """
    pattern = r'([,;:\—]|[.?!]["\']?)\s+'
    tokens = re.split(pattern, text)
    clauses = []
    i = 0
    while i < len(tokens):
        part = tokens[i].strip()
        if i + 1 < len(tokens) and re.match(r'^([,;:\—]|[.?!]["\']?)$', tokens[i+1]):
            part += tokens[i+1]
            i += 2
        else:
            i += 1
        if part:
            clauses.append(part)
    return clauses if clauses else [text]


def wrap_paragraph(
    paragraph: str,
    prefix: str = "",
    hanging_indent: str = "",
    max_width: int = 80,
    by_sentence: bool = False,
    by_clause: bool = False
) -> List[str]:
    """
    Wrap a single paragraph with semantic clause/sentence awareness and CJK width.
    """
    if by_sentence:
        sentences = split_into_sentences(paragraph)
        out = []
        for idx, s in enumerate(sentences):
            p = prefix if idx == 0 else hanging_indent
            out.append(f"{p}{s}")
        return out

    if by_clause:
        clauses = split_into_clauses(paragraph)
        out = []
        for idx, c in enumerate(clauses):
            p = prefix if idx == 0 else hanging_indent
            c_str = c.strip()
            if c_str:
                out.append(f"{p}{c_str}")
        return out if out else [f"{prefix}{paragraph}"]

    if max_width <= 0:
        return [f"{prefix}{paragraph}"]

    tokens = paragraph.split()
    if not tokens:
        return [prefix] if prefix else []

    out_lines: List[str] = []
    cur_line: List[str] = []
    cur_width = get_display_width(prefix)
    first_line = True

    for token in tokens:
        token_w = get_display_width(token)
        space_w = 1 if cur_line else 0
        added_w = token_w + space_w

        if cur_line and (cur_width + added_w > max_width):
            line_str = (prefix if first_line else hanging_indent) + " ".join(cur_line)
            out_lines.append(line_str)
            cur_line = [token]
            cur_width = get_display_width(hanging_indent) + token_w
            first_line = False
        else:
            cur_line.append(token)
            cur_width += added_w

    if cur_line:
        line_str = (prefix if first_line else hanging_indent) + " ".join(cur_line)
        out_lines.append(line_str)

    return out_lines


def semantic_wrap(
    lines: List[str],
    max_width: int = 80,
    by_sentence: bool = False,
    by_clause: bool = False
) -> List[str]:
    """
    Semantic wrapping for multiple lines/paragraphs with support for
    markdown bullet lists, blockquotes, and hanging indents.
    """
    result: List[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            result.append(line)
            i += 1
            continue

        # Skip headers, code blocks, or table rows
        if stripped.startswith('#') or stripped.startswith('```') or (stripped.startswith('|') and stripped.endswith('|')):
            result.append(line)
            i += 1
            continue

        # Check list prefix (- , * , 1. )
        list_match = re.match(r'^(\s*(?:[-*+]|\d+\.)\s+)(.*)$', line)
        quote_match = re.match(r'^(\s*>\s*)(.*)$', line)

        if list_match:
            prefix = list_match.group(1)
            content = list_match.group(2)
            hanging = " " * get_display_width(prefix)
            wrapped = wrap_paragraph(content, prefix=prefix, hanging_indent=hanging,
                                     max_width=max_width, by_sentence=by_sentence, by_clause=by_clause)
            result.extend(wrapped)
            i += 1
        elif quote_match:
            prefix = quote_match.group(1)
            content = quote_match.group(2)
            hanging = prefix
            wrapped = wrap_paragraph(content, prefix=prefix, hanging_indent=hanging,
                                     max_width=max_width, by_sentence=by_sentence, by_clause=by_clause)
            result.extend(wrapped)
            i += 1
        else:
            # Combine multi-line paragraph block
            indent_match = re.match(r'^(\s*)', line)
            base_indent = indent_match.group(1) if indent_match else ""
            para_lines = [line.strip()]
            while i + 1 < len(lines):
                nxt = lines[i+1]
                nxt_str = nxt.strip()
                if not nxt_str or nxt_str.startswith(('-', '*', '+', '#', '```', '>')) or (nxt_str.startswith('|') and nxt_str.endswith('|')) or re.match(r'^\d+\.', nxt_str):
                    break
                para_lines.append(nxt_str)
                i += 1
            full_para = " ".join(para_lines)
            wrapped = wrap_paragraph(full_para, prefix=base_indent, hanging_indent=base_indent,
                                     max_width=max_width, by_sentence=by_sentence, by_clause=by_clause)
            result.extend(wrapped)
            i += 1

    return result


def run_self_tests():
    """Run internal test suite."""
    print("Running text-align self-tests...")

    # 1. CJK Width Test
    assert get_display_width("Hello") == 5
    assert get_display_width("안녕하세요") == 10
    assert get_display_width("Hello 한글 123") == 14

    # 2. Table Alignment Test with Korean & alignment markers
    raw_table = [
        "| 항목 | 설명 | 점수 |",
        "| :--- | :---: | ---: |",
        "| 가나다 | 긴 텍스트 설명입니다 | 100 |",
        "| AB | test | 5 |"
    ]
    aligned = align_table(raw_table)
    assert len(aligned) == 4
    for line in aligned:
        assert line.startswith("| ") and line.endswith(" |")

    # 3. Delimiter Alignment Test (Code Assignments)
    code_lines = [
        "const userName = 'Alice';",
        "const age = 30;",
        "const userFavoriteColor = 'blue';"
    ]
    aligned_code = align_delimiter(code_lines, delimiter="=")
    assert aligned_code[0].startswith("const userName          = 'Alice';")
    assert aligned_code[1].startswith("const age               = 30;")
    assert aligned_code[2].startswith("const userFavoriteColor = 'blue';")

    # 4. Korean Delimiter Alignment Test (Colons - Vertical Delimiter)
    korean_lines = [
        "이름: 홍길동",
        "나이: 25",
        "소속부서: 인공지능연구팀"
    ]
    aligned_korean = align_delimiter(korean_lines, delimiter=":")
    assert aligned_korean[0] == "이름    : 홍길동"
    assert aligned_korean[1] == "나이    : 25"
    assert aligned_korean[2] == "소속부서: 인공지능연구팀"

    # 5. Korean Delimiter Alignment Test (Colons - Attached Delimiter)
    attached_korean = align_delimiter(korean_lines, delimiter=":", attach_delimiter=True)
    assert attached_korean[0] == "이름:     홍길동"
    assert attached_korean[1] == "나이:     25"
    assert attached_korean[2] == "소속부서: 인공지능연구팀"

    # 6. Comment Alignment Test
    comment_lines = [
        "int x = 1; // first value",
        "double totalSum = 100.5; // sum of elements"
    ]
    aligned_comments = align_delimiter(comment_lines, delimiter="//")
    assert "// sum of elements" in aligned_comments[1]

    # 7. Semantic Sentence Wrapping Test
    multi_sentence = [
        "찰스 배비지는 컴퓨터의 아버지입니다. 그는 차분기관과 해석기관을 고안했습니다! 에이다는 주석을 남겼을까요?"
    ]
    wrapped_sentences = semantic_wrap(multi_sentence, by_sentence=True)
    assert len(wrapped_sentences) == 3
    assert wrapped_sentences[0] == "찰스 배비지는 컴퓨터의 아버지입니다."
    assert wrapped_sentences[1] == "그는 차분기관과 해석기관을 고안했습니다!"
    assert wrapped_sentences[2] == "에이다는 주석을 남겼을까요?"

    # 8. Semantic Clause Wrapping Test
    clause_text = [
        "차분기관은 특수 목적 계산기이지만, 해석기관은 역사상 최초의 범용 컴퓨터입니다."
    ]
    wrapped_clauses = semantic_wrap(clause_text, by_clause=True)
    assert len(wrapped_clauses) == 2
    assert wrapped_clauses[0] == "차분기관은 특수 목적 계산기이지만,"

    # 9. Width-bounded Word Wrap with CJK and Hanging Indent
    bullet_list = [
        "- 찰스 배비지는 19세기 영국의 수학자이자 발명가로서 차분기관을 설계하여 덧셈만으로 수표를 자동 계산하고자 했습니다."
    ]
    wrapped_bullet = semantic_wrap(bullet_list, max_width=40)
    assert len(wrapped_bullet) >= 2
    assert wrapped_bullet[0].startswith("- ")
    assert wrapped_bullet[1].startswith("  ")  # Hanging indent

    print("All self-tests passed successfully! ✅")


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stdin, 'reconfigure'):
        try:
            sys.stdin.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="Deterministic text & table alignment tool with CJK awareness.")
    parser.add_argument("--mode", choices=["table", "delimiter", "justify", "pad", "wrap", "semantic-wrap"], default="table",
                        help="Alignment mode (default: table)")
    parser.add_argument("--delimiter", "-d", default="=",
                        help="Delimiter string for 'delimiter' mode (e.g. '=', ':', '=>', '//')")
    parser.add_argument("--attach-delimiter", action="store_true",
                        help="Attach delimiter to key before padding (e.g. '이름:     값')")
    parser.add_argument("--occurrence", "-n", type=int, default=1,
                        help="Which occurrence of the delimiter to align (default: 1)")
    parser.add_argument("--align", "-a", choices=["left", "right", "center"], default="left",
                        help="Alignment direction for padding/justify (default: left)")
    parser.add_argument("--width", "-w", type=int, default=0,
                        help="Target width for justify/pad/wrap mode (default: auto / 80 for wrap)")
    parser.add_argument("--by-sentence", "-s", action="store_true",
                        help="Wrap mode: Split into lines by sentence (.?!)")
    parser.add_argument("--by-clause", "-c", action="store_true",
                        help="Wrap mode: Split into lines by clauses/commas/punctuation")
    parser.add_argument("--file", "-f", help="Target file path to read from / modify")
    parser.add_argument("--range", "-r", help="Line range to process (e.g. 10:25, 1-indexed)")
    parser.add_argument("--in-place", "-i", action="store_true", help="Modify file in-place")
    parser.add_argument("--test", action="store_true", help="Run self-tests")

    args = parser.parse_args()

    if args.test:
        run_self_tests()
        sys.exit(0)

    # Read lines
    lines: List[str] = []
    file_content_lines: Optional[List[str]] = None
    start_line = 0
    end_line = None

    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            file_content_lines = f.readlines()
        
        # Strip trailing newlines for processing
        all_lines = [l.rstrip('\r\n') for l in file_content_lines]
        
        if args.range:
            parts = args.range.split(':')
            start_line = max(0, int(parts[0]) - 1)
            end_line = int(parts[1]) if len(parts) > 1 and parts[1] else len(all_lines)
            lines = all_lines[start_line:end_line]
        else:
            start_line = 0
            end_line = len(all_lines)
            lines = all_lines
    else:
        # Read from stdin
        lines = [l.rstrip('\r\n') for l in sys.stdin.readlines()]

    # Process lines according to mode
    if args.mode == "table":
        result = align_table(lines)
    elif args.mode == "delimiter":
        result = align_delimiter(lines, delimiter=args.delimiter, occurrence=args.occurrence, attach_delimiter=args.attach_delimiter)
    elif args.mode in ("justify", "pad"):
        result = align_justify(lines, target_width=args.width, align=args.align)
    elif args.mode in ("wrap", "semantic-wrap"):
        wrap_width = args.width if args.width > 0 else (0 if (args.by_sentence or args.by_clause) else 80)
        result = semantic_wrap(lines, max_width=wrap_width, by_sentence=args.by_sentence, by_clause=args.by_clause)
    else:
        result = lines

    # Output or in-place write
    if args.in_place and args.file and file_content_lines is not None:
        all_lines = [l.rstrip('\r\n') for l in file_content_lines]
        new_all_lines = all_lines[:start_line] + result + (all_lines[end_line:] if end_line else [])
        with open(args.file, 'w', encoding='utf-8') as f:
            f.write("\n".join(new_all_lines) + "\n")
        print(f"Successfully aligned and updated {args.file} (lines {start_line+1}..{end_line or len(all_lines)})")
    else:
        print("\n".join(result))


if __name__ == "__main__":
    main()
