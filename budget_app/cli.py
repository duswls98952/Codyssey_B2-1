import argparse
from pathlib import Path

from .repositories import DEFAULT_DATA_DIR, initialize_storage


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="budget_app")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DEFAULT_DATA_DIR,
        help="데이터 저장 폴더 (기본값: data)",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("add", help="거래 추가")
    subparsers.add_parser("list", help="거래 목록")
    subparsers.add_parser("search", help="거래 검색")
    subparsers.add_parser("summary", help="월별 요약")
    subparsers.add_parser("update", help="거래 수정")
    subparsers.add_parser("delete", help="거래 삭제")
    subparsers.add_parser("import", help="CSV 가져오기")
    subparsers.add_parser("export", help="CSV 내보내기")

    budget_parser = subparsers.add_parser("budget", help="예산 관리")
    budget_subparsers = budget_parser.add_subparsers(
        dest="budget_command", required=True
    )
    budget_subparsers.add_parser("set", help="월 예산 설정")

    category_parser = subparsers.add_parser("category", help="카테고리 관리")
    category_subparsers = category_parser.add_subparsers(
        dest="category_command", required=True
    )
    category_subparsers.add_parser("add", help="카테고리 추가")
    category_subparsers.add_parser("list", help="카테고리 목록")
    category_subparsers.add_parser("remove", help="카테고리 삭제")

    return parser

def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    initialize_storage(args.data_dir)
    return 0
