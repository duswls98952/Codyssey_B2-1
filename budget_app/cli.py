# 명령줄 입력을 해석하고 각 기능의 결과를 출력한다.

# argparse: 명령과 옵션을 해석한다.
import argparse
# islice: 거래 목록에서 지정한 개수만 가져온다.
from itertools import islice
# Path: 저장 폴더 경로를 다룬다.
from pathlib import Path

# handle_cli_errors: 명령 실행 중 발생한 오류를 공통으로 처리한다.
from .decorators import handle_cli_errors
# repositories: 기본 저장 경로와 파일 조회 기능을 가져온다.
from .repositories import (
    DEFAULT_DATA_DIR,
    initialize_storage,
    iter_categories,
    iter_transactions_latest,
)
# services: 거래·카테고리·예산·CSV 작업 기능을 가져온다.
from .services import (
    add_category,
    add_transaction,
    calculate_budget_usage,
    delete_transaction,
    export_transactions,
    get_budget,
    import_transactions,
    remove_category,
    search_transactions,
    set_budget,
    summarize_month,
    update_transaction,
)


# build_parser: 명령과 옵션을 등록하고 도움말을 구성한다.
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
    list_parser = subparsers.add_parser("list", help="거래 목록")
    list_parser.add_argument("--limit", type=int, default=10, help="최대 출력 건수 (기본값: 10)")
    search_parser = subparsers.add_parser("search", help="거래 검색")
    search_parser.add_argument("--from", dest="date_from", help="시작일 (YYYY-MM-DD)")
    search_parser.add_argument("--to", dest="date_to", help="종료일 (YYYY-MM-DD)")
    search_parser.add_argument("--category", help="카테고리")
    search_parser.add_argument("--type", dest="transaction_type", help="income 또는 expense")
    search_parser.add_argument("--q", help="메모 키워드")
    search_parser.add_argument("--tag", help="태그")
    summary_parser = subparsers.add_parser("summary", help="월별 요약")
    summary_parser.add_argument("--month", required=True, help="요약할 월 (YYYY-MM)")
    summary_parser.add_argument("--top", type=int, default=3, help="지출 카테고리 출력 건수 (기본값: 3)")
    update_parser = subparsers.add_parser("update", help="거래 수정")
    update_parser.add_argument("--id", required=True, help="수정할 거래 id")
    update_parser.add_argument("--date", help="새 날짜 (YYYY-MM-DD)")
    update_parser.add_argument("--type", dest="transaction_type", help="income 또는 expense")
    update_parser.add_argument("--category", help="새 카테고리")
    update_parser.add_argument("--amount", help="새 금액")
    update_parser.add_argument("--memo", help="새 메모")
    update_parser.add_argument("--tags", help="새 태그 (쉼표로 구분)")
    delete_parser = subparsers.add_parser("delete", help="거래 삭제")
    delete_parser.add_argument("--id", required=True, help="삭제할 거래 id")
    import_parser = subparsers.add_parser("import", help="CSV 가져오기")
    import_parser.add_argument(
        "--from", dest="csv_path", type=Path, required=True, help="입력 CSV 파일"
    )
    export_parser = subparsers.add_parser("export", help="CSV 내보내기")
    export_parser.add_argument("--out", type=Path, required=True, help="출력 CSV 파일")
    export_parser.add_argument("--month", help="내보낼 월 (YYYY-MM)")
    export_parser.add_argument("--from", dest="date_from", help="시작일 (YYYY-MM-DD)")
    export_parser.add_argument("--to", dest="date_to", help="종료일 (YYYY-MM-DD)")

    budget_parser = subparsers.add_parser("budget", help="예산 관리")
    budget_subparsers = budget_parser.add_subparsers(
        dest="budget_command", required=True
    )
    budget_set_parser = budget_subparsers.add_parser("set", help="월 예산 설정")
    budget_set_parser.add_argument("--month", required=True, help="예산 월 (YYYY-MM)")
    budget_set_parser.add_argument("--amount", required=True, help="월 예산 금액")

    category_parser = subparsers.add_parser("category", help="카테고리 관리")
    category_subparsers = category_parser.add_subparsers(
        dest="category_command", required=True
    )
    category_subparsers.add_parser("add", help="카테고리 추가")
    category_subparsers.add_parser("list", help="카테고리 목록")
    category_subparsers.add_parser("remove", help="카테고리 삭제")

    return parser


# main: 명령을 해석하고 저장 파일을 준비한 뒤 해당 기능을 실행해 결과를 출력한다.
@handle_cli_errors
def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    initialize_storage(args.data_dir)

    # 거래 추가 명령이면 필요한 값을 대화형으로 입력받는다.
    if args.command == "add":
        date = input("날짜 (YYYY-MM-DD): ").strip()
        transaction_type = input("타입 (income/expense): ").strip()

        categories = set(iter_categories(args.data_dir))
        category = input("카테고리: ").strip()
        while category not in categories:
            print("등록된 카테고리가 아닙니다. category add로 등록하거나 다시 입력하세요.")
            category = input("카테고리: ").strip()

        amount = input("금액 (양수 정수): ").strip()
        memo = input("메모 (선택): ")
        tag_text = input("태그 (쉼표로 구분, 선택): ")
        # 쉼표로 나눈 태그에서 빈 항목을 제외한다.
        tags = [tag.strip() for tag in tag_text.split(",") if tag.strip()]

        transaction = add_transaction(
            args.data_dir, date, transaction_type, category, amount, memo, tags
        )
        print(f"거래 저장 완료 (id: {transaction.id})")

    # 목록 명령이면 최신 거래를 지정한 개수만 출력한다.
    elif args.command == "list":
        # 목록 개수가 0 이하이면 잘못된 옵션으로 처리한다.
        if args.limit <= 0:
            raise ValueError("--limit은 1 이상의 정수여야 합니다")

        for transaction in islice(iter_transactions_latest(args.data_dir), args.limit):
            print(
                f"{transaction.date} | {transaction.type} | "
                f"{transaction.category} | {transaction.amount} | "
                f"id: {transaction.id} | 메모: {transaction.memo} | "
                f"태그: {', '.join(transaction.tags)}"
            )

    # 검색 명령이면 조건에 맞는 거래를 출력한다.
    elif args.command == "search":
        for transaction in search_transactions(
            args.data_dir,
            date_from=args.date_from,
            date_to=args.date_to,
            category=args.category,
            transaction_type=args.transaction_type,
            query=args.q,
            tag=args.tag,
        ):
            print(
                f"{transaction.date} | {transaction.type} | "
                f"{transaction.category} | {transaction.amount} | "
                f"id: {transaction.id} | 메모: {transaction.memo} | "
                f"태그: {', '.join(transaction.tags)}"
            )

    # 요약 명령이면 해당 월의 합계를 출력한다.
    elif args.command == "summary":
        result = summarize_month(args.data_dir, args.month, args.top)
        print(f"{result.month} 요약")
        # 해당 월에 거래가 없으면 데이터가 없다고 알린다.
        if result.transaction_count == 0:
            print("데이터 없음")

        print(f"총수입: {result.income}")
        print(f"총지출: {result.expense}")
        print(f"잔액: {result.balance}")

        # 지출 카테고리 집계가 있을 때만 상위 항목을 출력한다.
        if result.top_categories:
            print(f"카테고리별 지출 TOP {args.top}:")
            for category, amount in result.top_categories:
                print(f"{category}: {amount}")

        budget = get_budget(args.data_dir, args.month)
        # 저장된 월 예산이 있을 때만 사용률을 출력한다.
        if budget is not None:
            usage, exceeded = calculate_budget_usage(result, budget)
            print(f"월 예산: {budget.amount}")
            print(f"예산 사용률: {usage:.1f}%")
            # 계산된 초과 여부에 맞는 문구를 선택한다.
            print(f"초과 여부: {'초과' if exceeded else '미초과'}")
            # 예산을 초과했으면 경고를 추가한다.
            if exceeded:
                print("경고: 월 예산을 초과했습니다")

    # 예산 설정 명령이면 해당 월의 예산을 저장한다.
    elif args.command == "budget" and args.budget_command == "set":
        saved = set_budget(args.data_dir, args.month, args.amount)
        print(f"{saved.month} 예산 {saved.amount} 저장 완료")

    # 수정 명령이면 전달한 옵션으로 기존 거래를 바꾼다.
    elif args.command == "update":
        tags = None
        # 태그 옵션이 있으면 쉼표로 나누어 목록으로 만든다.
        if args.tags is not None:
            # 쉼표로 나눈 태그에서 빈 항목을 제외한다.
            tags = [tag.strip() for tag in args.tags.split(",") if tag.strip()]

        updated = update_transaction(
            args.data_dir,
            args.id,
            date=args.date,
            transaction_type=args.transaction_type,
            category=args.category,
            amount=args.amount,
            memo=args.memo,
            tags=tags,
        )
        print(f"거래 수정 완료 (id: {updated.id})")

    # 삭제 명령이면 해당 ID의 거래를 지운다.
    elif args.command == "delete":
        deleted_id = delete_transaction(args.data_dir, args.id)
        print(f"거래 삭제 완료 (id: {deleted_id})")

    # 내보내기 명령이면 거래를 CSV로 저장한다.
    elif args.command == "export":
        count = export_transactions(
            args.data_dir,
            args.out,
            month=args.month,
            date_from=args.date_from,
            date_to=args.date_to,
        )
        print(f"{count}건 내보내기 완료: {args.out}")

    # 가져오기 명령이면 CSV 거래를 저장한다.
    elif args.command == "import":
        count = import_transactions(args.data_dir, args.csv_path)
        print(f"{count}건 가져오기 완료: {args.csv_path}")

    # 카테고리 목록 명령이면 등록된 이름을 출력한다.
    elif args.command == "category" and args.category_command == "list":
        for name in iter_categories(args.data_dir):
            print(name)
    # 카테고리 추가 명령이면 이름을 입력받아 저장한다.
    elif args.command == "category" and args.category_command == "add":
        name = input("추가할 카테고리: ")
        saved_name = add_category(args.data_dir, name)
        print(f"카테고리 '{saved_name}' 추가 완료")
    # 카테고리 삭제 명령이면 이름을 입력받아 지운다.
    elif args.command == "category" and args.category_command == "remove":
        name = input("삭제할 카테고리: ")
        removed_name = remove_category(args.data_dir, name)
        print(f"카테고리 '{removed_name}' 삭제 완료")

    return 0
