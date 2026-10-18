# 거래·카테고리·예산 파일과 CSV를 읽고 쓴다.

# csv: CSV 파일을 읽고 쓴다.
import csv
# json: JSONL 파일의 각 줄을 JSON으로 변환한다.
import json
# Iterable과 Iterator: 여러 데이터를 순서대로 읽는 타입을 표시한다.
from collections.abc import Iterable, Iterator
# asdict: 데이터 클래스 객체를 저장 가능한 딕셔너리로 바꾼다.
from dataclasses import asdict
# Path: 저장 파일 경로를 다룬다.
from pathlib import Path

# Budget와 Transaction: 파일에서 읽거나 쓸 데이터 구조를 가져온다.
from .models import Budget, Transaction


DEFAULT_DATA_DIR = Path("data")
TRANSACTIONS_FILE = "transactions.jsonl"
CATEGORIES_FILE = "categories.jsonl"
BUDGETS_FILE = "budgets.jsonl"
CSV_COLUMNS = ("date", "type", "category", "amount", "memo", "tags")
DEFAULT_CATEGORIES: tuple[str, ...] = ("food", "transport", "rent", "etc")


# 프로그램을 처음 실행할 때 필요한 data 폴더와 저장 파일 3개를 준비하고, 기본 카테고리를 준비한다.
def initialize_storage(data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)

    for filename in (TRANSACTIONS_FILE, CATEGORIES_FILE, BUDGETS_FILE):
        (data_dir / filename).touch(exist_ok=True)

    categories_path = data_dir / CATEGORIES_FILE
    # 카테고리 파일이 비어 있으면 기본 카테고리를 채운다.
    if categories_path.stat().st_size == 0:
        with categories_path.open("w", encoding="utf-8") as category_file:
            for category in DEFAULT_CATEGORIES:
                json.dump(
                    {"name": category}, category_file, ensure_ascii=False
                )
                category_file.write("\n")


# iter_jsonl: yield로 JSONL을 한 줄씩 변환해 파일 전체를 메모리에 올리지 않는다.
def iter_jsonl(path: Path) -> Iterator[dict[str, object]]:
    with path.open("r", encoding="utf-8") as data_file:
        for line in data_file:
            yield json.loads(line)


# iter_transactions: 저장된 거래를 한 건씩 읽는다.
def iter_transactions(data_dir: Path) -> Iterator[Transaction]:
    for record in iter_jsonl(data_dir / TRANSACTIONS_FILE):
        yield Transaction(**record)


# append_transaction: 새 거래를 저장 파일 끝에 추가한다.
def append_transaction(data_dir: Path, transaction: Transaction) -> None:
    with (data_dir / TRANSACTIONS_FILE).open("a", encoding="utf-8") as transaction_file:
        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)
        transaction_file.write("\n")


# save_transactions: 거래 전체를 w 모드로 다시 쓰며, 쓰기 중 중단되면 원본 보존은 보장되지 않는다.
def save_transactions(data_dir: Path, transactions: list[Transaction]) -> None:
    lines = [
        json.dumps(asdict(transaction), ensure_ascii=False) + "\n"
        for transaction in transactions
    ]
    with (data_dir / TRANSACTIONS_FILE).open("w", encoding="utf-8") as transaction_file:
        transaction_file.writelines(lines)


# iter_budgets: 저장된 예산을 한 건씩 읽는다.
def iter_budgets(data_dir: Path) -> Iterator[Budget]:
    for record in iter_jsonl(data_dir / BUDGETS_FILE):
        yield Budget(**record)


# save_budgets: 예산 전체를 저장 파일에 다시 쓴다.
def save_budgets(data_dir: Path, budgets: list[Budget]) -> None:
    lines = [
        json.dumps(asdict(budget), ensure_ascii=False) + "\n"
        for budget in budgets
    ]
    with (data_dir / BUDGETS_FILE).open("w", encoding="utf-8") as budget_file:
        budget_file.writelines(lines)


# iter_categories: 저장된 카테고리 이름을 한 건씩 읽는다.
def iter_categories(data_dir: Path) -> Iterator[str]:
    for record in iter_jsonl(data_dir / CATEGORIES_FILE):
        name = record["name"]
        # 저장된 카테고리 이름이 문자열이 아니면 오류로 처리한다.
        if not isinstance(name, str):
            raise ValueError("카테고리 이름은 문자열이어야 합니다")
        yield name


# append_category: 새 카테고리를 저장 파일 끝에 추가한다.
def append_category(data_dir: Path, name: str) -> None:
    with (data_dir / CATEGORIES_FILE).open("a", encoding="utf-8") as category_file:
        json.dump({"name": name}, category_file, ensure_ascii=False)
        category_file.write("\n")


# save_categories: 카테고리 전체를 저장 파일에 다시 쓴다.
def save_categories(data_dir: Path, names: list[str]) -> None:
    with (data_dir / CATEGORIES_FILE).open("w", encoding="utf-8") as category_file:
        for name in names:
            json.dump({"name": name}, category_file, ensure_ascii=False)
            category_file.write("\n")


# transaction_sort_key: 거래를 날짜와 ID 순으로 비교할 기준을 만든다.
def transaction_sort_key(transaction: Transaction) -> tuple[str, str]:
    return transaction.date, transaction.id


# iter_transactions_latest: 메모리를 아끼며 최신순으로 읽되, 결과 한 건마다 파일을 다시 훑는다.
def iter_transactions_latest(data_dir: Path) -> Iterator[Transaction]:
    before: tuple[str, str] | None = None

    while True:
        latest: Transaction | None = None

        for transaction in iter_transactions(data_dir):
            key = transaction_sort_key(transaction)

            # 이미 내보낸 거래보다 최신이거나 같으면 건너뛴다.
            if before is not None and key >= before:
                continue
            # 아직 후보가 없거나 더 최신 거래를 찾으면 후보를 바꾼다.
            if latest is None or key > transaction_sort_key(latest):
                latest = transaction

        # 다음으로 내보낼 거래가 없으면 조회를 종료한다.
        if latest is None:
            return

        yield latest
        before = transaction_sort_key(latest)


# write_transactions_csv: 거래를 정해진 헤더의 UTF-8 CSV로 저장하고 건수를 돌려준다.
def write_transactions_csv(
    output_path: Path, transactions: Iterable[Transaction]
) -> int:
    count = 0
    with output_path.open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(CSV_COLUMNS)

        for transaction in transactions:
            writer.writerow(
                [
                    transaction.date,
                    transaction.type,
                    transaction.category,
                    transaction.amount,
                    transaction.memo,
                    ",".join(transaction.tags),
                ]
            )
            count += 1

    return count


# iter_csv_transactions: CSV의 필수 헤더와 행별 열 개수를 확인하고 오류 행 번호를 알린다.
def iter_csv_transactions(path: Path) -> Iterator[tuple[int, dict[str, str]]]:
    with path.open("r", encoding="utf-8", newline="") as csv_file:
        # CSV 헤더와 각 행을 읽는 동안 형식 오류를 감시한다.
        try:
            reader = csv.DictReader(csv_file, strict=True)
            headers = reader.fieldnames
            # 필수 헤더가 없거나 헤더가 중복되면 CSV를 거부한다.
            if (
                headers is None
                or len(headers) != len(set(headers))
                or not set(CSV_COLUMNS).issubset(headers)
            ):
                raise ValueError("CSV 헤더에 date,type,category,amount,memo,tags가 필요합니다")

            for row in reader:
                # 행의 열 개수가 맞지 않으면 오류로 처리한다.
                if None in row or any(row[column] is None for column in CSV_COLUMNS):
                    raise ValueError(f"CSV {reader.line_num}행의 열 개수가 맞지 않습니다")
                yield reader.line_num, {column: row[column] for column in CSV_COLUMNS}
        # CSV 파싱 오류를 사용자에게 설명할 수 있는 오류로 바꾼다.
        except csv.Error as error:
            raise ValueError(f"CSV 형식 오류: {error}") from error
