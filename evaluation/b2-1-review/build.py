"""평가 문항·검토 결과·현재 소스 코드를 로컬 복습 페이지에 반영한다."""

from __future__ import annotations

import json
import re
from pathlib import Path


SITE = Path(__file__).resolve().parent
ROOT = SITE.parent.parent
REPO_BLOB_BASE = "https://github.com/duswls98952/Codyssey_B2-1/blob/main"


def criteria_by_id() -> dict[str, str]:
    result: dict[str, str] = {}
    group = 0
    number = 0
    for raw_line in (ROOT / "evaluation/evaluation_criteria.md").read_text(
        encoding="utf-8"
    ).splitlines():
        line = raw_line.strip()
        group_match = re.fullmatch(r"항목 (\d+)", line)
        if group_match:
            group = int(group_match.group(1))
            number = 0
        elif line:
            if not group:
                raise ValueError(f"평가항목 그룹을 찾을 수 없습니다: {line}")
            number += 1
            result[f"{group}-{number}"] = line
    return result


def review_by_id() -> dict[str, dict[str, str]]:
    text = (ROOT / "evaluation/evaluation_review.md").read_text(encoding="utf-8")
    headings = list(re.finditer(r"^### (\d+-\d+)\s*$", text, re.MULTILINE))
    result = {}
    for index, match in enumerate(headings):
        section = text[match.end() : headings[index + 1].start() if index + 1 < len(headings) else len(text)]
        status = re.search(r"\*\*충족 여부:\*\*\s*([^\n]+)", section)
        answer = re.search(r"\*\*답변 요점:\*\*\s*([^\n]+)", section)
        practice = re.search(r"\*\*직접 실습 증빙:\*\*\s*([^\n]+)", section)
        if not status or not answer:
            raise ValueError(f"평가 검토에서 상태 또는 답변 누락: {match.group(1)}")
        result[match.group(1)] = {
            "status": status.group(1).strip(),
            "answer": answer.group(1).strip(),
            "practice": practice.group(1).strip() if practice else "",
        }
    return result


def code_excerpt(spec: dict[str, object]) -> dict[str, object]:
    filename = str(spec["file"])
    if not re.fullmatch(r"budget_app/[A-Za-z_]+\.py", filename):
        raise ValueError(f"허용되지 않은 코드 경로: {filename}")
    lines = (ROOT / filename).read_text(encoding="utf-8").splitlines()
    start, end = int(spec["start"]), int(spec["end"])
    if start < 1 or end < start or end > len(lines):
        raise ValueError(f"코드 범위 오류: {filename}:{start}-{end}")
    return {
        "label": spec["label"],
        "kind": spec["kind"],
        "file": filename,
        "start": start,
        "end": end,
        "url": f"{REPO_BLOB_BASE}/{filename}#L{start}",
        "lines": [
            {"number": number, "text": lines[number - 1]}
            for number in range(start, end + 1)
        ],
    }


def main() -> None:
    criteria = criteria_by_id()
    reviews = review_by_id()
    learning = json.loads((SITE / "learning.json").read_text(encoding="utf-8"))
    ids = [entry["id"] for entry in learning]
    if len(ids) != len(set(ids)) or set(ids) != set(criteria) or set(ids) != set(reviews):
        raise ValueError("평가 기준·검토 문서·학습 카드의 항목 ID가 일치하지 않습니다")

    cards = []
    for entry in learning:
        card_id = entry["id"]
        card = {
            **entry,
            "question": criteria[card_id],
            **reviews[card_id],
            "excerpts": [code_excerpt(spec) for spec in entry["snippets"]],
        }
        del card["snippets"]
        cards.append(card)

    output = "window.REVIEW_CARDS = " + json.dumps(cards, ensure_ascii=False, indent=2) + ";\n"
    (SITE / "content.js").write_text(output, encoding="utf-8")
    print(f"생성 완료: {len(cards)}개 평가 카드와 최종 코드 발췌")


if __name__ == "__main__":
    main()
