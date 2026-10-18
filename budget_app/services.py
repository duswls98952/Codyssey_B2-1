# 입력 검증과 저장 기능을 연결해 가계부 작업을 처리한다.

# Iterator: 검색 결과를 차례로 제공하는 타입을 표시한다.
from collections.abc import Iterator
# replace: 기존 데이터 클래스 객체의 일부 값만 바꾼다.
from dataclasses import replace
# Path: 저장 폴더와 CSV 파일 경로를 다룬다.
from pathlib import Path
# uuid4: 거래에 사용할 고유 ID를 만든다.
from uuid import uuid4

# models: 거래·예산·월별 요약 데이터 구조를 가져온다.
from .models import Budget, MonthlySummary, Transaction
# repositories: 저장 파일과 CSV를 읽고 쓰는 기능을 가져온다.
from .repositories import (
    BUDGETS_FILE,
    CATEGORIES_FILE,
    TRANSACTIONS_FILE,
    append_category,
    append_transaction,
    iter_budgets,
    iter_categories,
    iter_csv_transactions,
    iter_transactions,
    iter_transactions_latest,
    save_categories,
    save_budgets,
    save_transactions,
    write_transactions_csv,
)
# validators: 입력값 검증 기능을 가져온다.
from .validators import (
    is_valid_amount,
    is_valid_category,
    is_valid_date,
    is_valid_month,
    is_valid_transaction_type,
)


# add_category: 중복을 확인한 뒤 카테고리를 등록한다.
def add_category(data_dir: Path, name: str) -> str:
    name = name.strip()

    # 이름이 비어 있으면 카테고리를 추가하지 않는다.
    if not name:
        raise ValueError("카테고리 이름을 입력하세요")

    # 이미 등록된 이름이면 중복 추가를 막는다.
    if name in iter_categories(data_dir):
        raise ValueError(f"'{name}' 카테고리는 이미 등록되어 있습니다")

    append_category(data_dir, name)
    return name


# remove_category: 거래에서 사용 중인지 확인한 뒤 카테고리를 삭제한다.
def remove_category(data_dir: Path, name: str) -> str:
    name = name.strip()
    # 이름이 비어 있으면 삭제할 대상을 찾을 수 없으므로 오류를 낸다.
    if not name:
        raise ValueError("카테고리 이름을 입력하세요")

    categories = list(iter_categories(data_dir))
    # 등록되지 않은 카테고리면 삭제하지 않는다.
    if name not in categories:
        raise ValueError(f"'{name}' 카테고리는 등록되어 있지 않습니다")

    for transaction in iter_transactions(data_dir):
        # 거래에서 사용 중인 카테고리는 삭제를 막는다.
        if transaction.category == name:
            raise ValueError(f"'{name}' 카테고리는 거래에서 사용 중입니다")

    # 삭제할 이름을 제외하고 남은 카테고리만 모은다.
    remaining = [category for category in categories if category != name]
    save_categories(data_dir, remaining)
    return name


# make_transaction: 입력값을 검증하고 고유 ID가 있는 거래를 만든다.
def make_transaction(
    data_dir: Path,
    date: str,
    transaction_type: str,
    category: str,
    amount: str,
    memo: str = "",
    tags: list[str] | None = None,
) -> Transaction:
    # 날짜 형식이나 실제 날짜가 잘못되면 거래 생성을 막는다.
    if not is_valid_date(date):
        raise ValueError("날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 허용되지 않은 거래 타입이면 거래 생성을 막는다.
    if not is_valid_transaction_type(transaction_type):
        raise ValueError("타입은 income 또는 expense여야 합니다")
    # 금액이 양수 정수가 아니면 거래 생성을 막는다.
    if not is_valid_amount(amount):
        raise ValueError("금액은 0보다 큰 정수여야 합니다")
    # 등록되지 않은 카테고리면 거래 생성을 막는다.
    if not is_valid_category(category, set(iter_categories(data_dir))):
        raise ValueError("등록된 카테고리를 입력하세요")

    transaction_id = uuid4().hex
    while any(item.id == transaction_id for item in iter_transactions(data_dir)):
        transaction_id = uuid4().hex

    return Transaction(
        id=transaction_id,
        type=transaction_type,
        date=date,
        amount=int(amount),
        category=category,
        memo=memo,
        tags=tags or [],
    )


# add_transaction: 새 거래를 만들어 저장한다.
def add_transaction(
    data_dir: Path,
    date: str,
    transaction_type: str,
    category: str,
    amount: str,
    memo: str = "",
    tags: list[str] | None = None,
) -> Transaction:
    transaction = make_transaction(
        data_dir, date, transaction_type, category, amount, memo, tags
    )
    append_transaction(data_dir, transaction)
    return transaction


# search_transactions: 조건에 맞는 거래를 최신순으로 찾는다.
def search_transactions(
    data_dir: Path,
    *,
    date_from: str | None = None,
    date_to: str | None = None,
    category: str | None = None,
    transaction_type: str | None = None,
    query: str | None = None,
    tag: str | None = None,
) -> Iterator[Transaction]:
    # 시작일을 받았다면 날짜 형식을 확인한다.
    if date_from is not None and not is_valid_date(date_from):
        raise ValueError("--from은 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 종료일을 받았다면 날짜 형식을 확인한다.
    if date_to is not None and not is_valid_date(date_to):
        raise ValueError("--to는 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 시작일이 종료일보다 늦으면 검색을 중단한다.
    if date_from is not None and date_to is not None and date_from > date_to:
        raise ValueError("--from은 --to보다 늦을 수 없습니다")
    # 타입 조건이 있으면 허용된 값인지 확인한다.
    if transaction_type is not None and not is_valid_transaction_type(transaction_type):
        raise ValueError("--type은 income 또는 expense여야 합니다")

    for transaction in iter_transactions_latest(data_dir):
        # 시작일보다 이른 거래는 검색 결과에서 제외한다.
        if date_from is not None and transaction.date < date_from:
            continue
        # 종료일보다 늦은 거래는 검색 결과에서 제외한다.
        if date_to is not None and transaction.date > date_to:
            continue
        # 카테고리 조건에 맞지 않는 거래는 제외한다.
        if category is not None and transaction.category != category:
            continue
        # 타입 조건에 맞지 않는 거래는 제외한다.
        if transaction_type is not None and transaction.type != transaction_type:
            continue
        # 메모에 검색어가 없는 거래는 제외한다.
        if query is not None and query not in transaction.memo:
            continue
        # 요청한 태그가 없는 거래는 제외한다.
        if tag is not None and tag not in transaction.tags:
            continue
        yield transaction


# update_transaction: 전체 거래를 읽어 ID를 찾고 선택한 항목만 바꾼 뒤 다시 저장한다.
def update_transaction(
    data_dir: Path,
    transaction_id: str,
    *,
    date: str | None = None,
    transaction_type: str | None = None,
    category: str | None = None,
    amount: str | None = None,
    memo: str | None = None,
    tags: list[str] | None = None,
) -> Transaction:
    # 변경할 필드를 하나도 지정하지 않았다면 수정하지 않는다.
    if not any(
        value is not None
        for value in (date, transaction_type, category, amount, memo, tags)
    ):
        raise ValueError("수정할 항목을 하나 이상 지정하세요")
    # 새 날짜가 지정되었다면 형식을 확인한다.
    if date is not None and not is_valid_date(date):
        raise ValueError("날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 새 거래 타입이 지정되었다면 허용된 값인지 확인한다.
    if transaction_type is not None and not is_valid_transaction_type(transaction_type):
        raise ValueError("타입은 income 또는 expense여야 합니다")
    # 새 카테고리가 지정되었다면 등록된 이름인지 확인한다.
    if category is not None and not is_valid_category(
        category, set(iter_categories(data_dir))
    ):
        raise ValueError("등록된 카테고리를 입력하세요")
    # 새 금액이 지정되었다면 양수 정수인지 확인한다.
    if amount is not None and not is_valid_amount(amount):
        raise ValueError("금액은 0보다 큰 정수여야 합니다")

    transactions = list(iter_transactions(data_dir))
    for index, current in enumerate(transactions):
        # ID가 일치하는 거래를 찾으면 선택한 필드만 수정한다.
        if current.id == transaction_id:
            # 수정 옵션이 없는 필드는 원래 값을 유지한다.
            updated = replace(
                current,
                date=current.date if date is None else date,
                type=current.type if transaction_type is None else transaction_type,
                category=current.category if category is None else category,
                amount=current.amount if amount is None else int(amount),
                memo=current.memo if memo is None else memo,
                tags=current.tags if tags is None else tags,
            )
            transactions[index] = updated
            save_transactions(data_dir, transactions)
            return updated

    raise ValueError(f"거래 id '{transaction_id}'에 해당하는 데이터가 없습니다")


# delete_transaction: 전체 거래를 읽어 지정한 ID를 삭제한 뒤 다시 저장한다.
def delete_transaction(data_dir: Path, transaction_id: str) -> str:
    transactions = list(iter_transactions(data_dir))

    for index, transaction in enumerate(transactions):
        # ID가 일치하는 거래를 찾으면 삭제한다.
        if transaction.id == transaction_id:
            del transactions[index]
            save_transactions(data_dir, transactions)
            return transaction_id

    raise ValueError(f"거래 id '{transaction_id}'에 해당하는 데이터가 없습니다")


# summarize_month: 해당 월의 수입·지출·잔액과 지출 상위 카테고리를 계산한다.
def summarize_month(data_dir: Path, month: str, top: int = 3) -> MonthlySummary:
    # 요약할 월 형식이 잘못되면 계산을 중단한다.
    if not is_valid_month(month):
        raise ValueError("--month는 YYYY-MM 형식의 실제 월이어야 합니다")
    # 상위 항목 개수가 0 이하이면 계산을 중단한다.
    if top <= 0:
        raise ValueError("--top은 1 이상의 정수여야 합니다")

    income = 0
    expense = 0
    transaction_count = 0
    category_totals: dict[str, int] = {}

    for transaction in iter_transactions(data_dir):
        # 선택한 월이 아닌 거래는 합계에서 제외한다.
        if transaction.date[:7] != month:
            continue

        transaction_count += 1
        # 수입 거래이면 총수입에 금액을 더한다.
        if transaction.type == "income":
            income += transaction.amount
        # 지출 거래이면 총지출과 카테고리별 합계에 더한다.
        elif transaction.type == "expense":
            expense += transaction.amount
            category_totals[transaction.category] = (
                category_totals.get(transaction.category, 0) + transaction.amount
            )

    top_categories = sorted(
        category_totals.items(), key=lambda item: (-item[1], item[0])
    )[:top]

    return MonthlySummary(
        month=month,
        income=income,
        expense=expense,
        balance=income - expense,
        top_categories=top_categories,
        transaction_count=transaction_count,
    )


# set_budget: 월 예산을 새로 저장하거나 기존 값을 변경한다.
def set_budget(data_dir: Path, month: str, amount: str) -> Budget:
    # 예산을 설정할 월 형식을 확인한다.
    if not is_valid_month(month):
        raise ValueError("--month는 YYYY-MM 형식의 실제 월이어야 합니다")
    # 예산 금액이 양수 정수인지 확인한다.
    if not is_valid_amount(amount):
        raise ValueError("예산 금액은 0보다 큰 정수여야 합니다")

    saved = Budget(month=month, amount=int(amount))
    budgets = list(iter_budgets(data_dir))

    for index, budget in enumerate(budgets):
        # 같은 월의 예산이 있으면 새 금액으로 교체한다.
        if budget.month == month:
            budgets[index] = saved
            break
    # 같은 월의 예산을 찾지 못했으면 새 항목을 추가한다.
    else:
        budgets.append(saved)

    save_budgets(data_dir, budgets)
    return saved


# get_budget: 해당 월에 저장된 예산을 찾는다.
def get_budget(data_dir: Path, month: str) -> Budget | None:
    for budget in iter_budgets(data_dir):
        # 요청한 월의 예산을 찾으면 돌려준다.
        if budget.month == month:
            return budget
    return None


# calculate_budget_usage: 지출 ÷ 예산 × 100으로 사용률을 구하고 지출이 예산보다 클 때만 초과로 본다.
def calculate_budget_usage(summary: MonthlySummary, budget: Budget) -> tuple[float, bool]:
    # 저장된 예산이 0 이하이면 사용률을 계산하지 않는다.
    if budget.amount <= 0:
        raise ValueError("저장된 예산 금액은 0보다 커야 합니다")
    return summary.expense / budget.amount * 100, summary.expense > budget.amount


# export_transactions: 조건에 맞는 거래를 CSV로 내보낸다.
def export_transactions(
    data_dir: Path,
    output_path: Path,
    *,
    month: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
) -> int:
    # 월과 기간 조건이 모두 없으면 내보내기를 막는다.
    if month is None and date_from is None and date_to is None:
        raise ValueError("--month 또는 --from과 --to를 지정하세요")
    # 시작일과 종료일은 함께 지정하도록 확인한다.
    if (date_from is None) != (date_to is None):
        raise ValueError("--from과 --to는 함께 지정해야 합니다")
    # 월 조건이 있으면 YYYY-MM 형식을 확인한다.
    if month is not None and not is_valid_month(month):
        raise ValueError("--month는 YYYY-MM 형식의 실제 월이어야 합니다")
    # 시작일 조건이 있으면 실제 날짜인지 확인한다.
    if date_from is not None and not is_valid_date(date_from):
        raise ValueError("--from은 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 종료일 조건이 있으면 실제 날짜인지 확인한다.
    if date_to is not None and not is_valid_date(date_to):
        raise ValueError("--to는 YYYY-MM-DD 형식의 실제 날짜여야 합니다")
    # 시작일이 종료일보다 늦으면 내보내기를 막는다.
    if date_from is not None and date_to is not None and date_from > date_to:
        raise ValueError("--from은 --to보다 늦을 수 없습니다")

    storage_paths = {
        (data_dir / filename).resolve()
        for filename in (TRANSACTIONS_FILE, CATEGORIES_FILE, BUDGETS_FILE)
    }
    # 출력 경로가 내부 저장 파일이면 덮어쓰지 못하게 막는다.
    if output_path.resolve() in storage_paths:
        raise ValueError("내보내기 경로로 데이터 저장 파일을 지정할 수 없습니다")

    # 월 조건이 있으면 그 월에 해당하는 거래만 고른다.
    selected = (
        transaction
        for transaction in search_transactions(
            data_dir, date_from=date_from, date_to=date_to
        )
        if month is None or transaction.date[:7] == month
    )
    return write_transactions_csv(output_path, selected)


# import_transactions: CSV 모든 행을 검증하고 새 ID를 부여한 뒤 한 번 저장한다(검증 실패 시 저장 안 함).
def import_transactions(data_dir: Path, csv_path: Path) -> int:
    existing = list(iter_transactions(data_dir))
    used_ids = {transaction.id for transaction in existing}
    imported: list[Transaction] = []

    for line_number, row in iter_csv_transactions(csv_path):
        # 쉼표로 나눈 태그에서 빈 항목을 제외한다.
        tags = [tag.strip() for tag in row["tags"].split(",") if tag.strip()]
        # CSV 한 행을 기존 거래 검증 규칙으로 검사하고 객체로 만든다.
        try:
            transaction = make_transaction(
                data_dir,
                date=row["date"],
                transaction_type=row["type"],
                category=row["category"],
                amount=row["amount"],
                memo=row["memo"],
                tags=tags,
            )
        # 오류에 CSV 행 번호를 붙여 문제 위치를 알린다.
        except ValueError as error:
            raise ValueError(f"CSV {line_number}행: {error}") from error

        while transaction.id in used_ids:
            transaction = replace(transaction, id=uuid4().hex)
        used_ids.add(transaction.id)
        imported.append(transaction)

    # 가져온 거래가 있을 때만 파일에 한 번에 저장한다.
    if imported:
        save_transactions(data_dir, existing + imported)
    return len(imported)
