# B2-1 평가항목 검토

기준: `evaluation_criteria.md`의 평가문항 원문, 현재 최종 구현 코드, 완료된 미션 최종 검수 결과. 사용자가 직접 실행한 결과를 실습 로그로 추가했다. `확인 필요`는 주로 코드만으로 판정할 수 없는 사용자 설명 능력을 뜻한다.

**현황: 통과 7 / 확인 필요 9 / 미구현 0**

**실습 증빙:** 항목 1-1~1-7의 실제 명령어와 출력은 [실습 로그](./practice_session.log)에 모았다. 각 항목에서 해당 로그 줄로 직접 연결한다. 실행 화면은 추후 별도로 첨부한다. 현재의 충족 여부는 완료된 최종 검수 결과에 따른 판정이며, 실습 기록은 확인된 범위만 보여준다.

## 항목 1

### 1-1

**평가문항 원문**

> add/list/search/summary/export/import/update/delete가 요구사항대로 동작하는가?

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/cli.py:123-126](../budget_app/cli.py#L123), [budget_app/cli.py:129-134](../budget_app/cli.py#L129), [budget_app/cli.py:143-144](../budget_app/cli.py#L143), [budget_app/cli.py:161-162](../budget_app/cli.py#L161), [budget_app/cli.py:203-217](../budget_app/cli.py#L203), [budget_app/cli.py:220-234](../budget_app/cli.py#L220)

**평가항목과 직접 관련된 실제 코드**

[budget_app/cli.py:123-126](../budget_app/cli.py#L123)

```python
        transaction = add_transaction(
            args.data_dir, date, transaction_type, category, amount, memo, tags
        )
        print(f"거래 저장 완료 (id: {transaction.id})")
```

[budget_app/cli.py:129-134](../budget_app/cli.py#L129)

```python
    elif args.command == "list":
        # 목록 개수가 0 이하이면 잘못된 옵션으로 처리한다.
        if args.limit <= 0:
            raise ValueError("--limit은 1 이상의 정수여야 합니다")

        for transaction in islice(iter_transactions_latest(args.data_dir), args.limit):
```

[budget_app/cli.py:143-144](../budget_app/cli.py#L143)

```python
    elif args.command == "search":
        for transaction in search_transactions(
```

[budget_app/cli.py:161-162](../budget_app/cli.py#L161)

```python
    elif args.command == "summary":
        result = summarize_month(args.data_dir, args.month, args.top)
```

[budget_app/cli.py:203-217](../budget_app/cli.py#L203)

```python
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
```

[budget_app/cli.py:220-234](../budget_app/cli.py#L220)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** CLI가 명령별로 입력을 받아 거래 추가·조회·검색·요약·수정·삭제·CSV 입출력 함수에 연결하고 결과를 출력한다.

**이 코드가 평가항목을 어떻게 충족하는지:** 여덟 명령이 파서와 실행 분기에 연결되어 있다. 완료된 최종 검수에서 추가→목록·검색·요약→수정·삭제→내보내기·가져오기 흐름과 반영 결과를 확인했다.

**사용된 주요 기술·개념:** argparse, 대화형 input, 서비스 계층, CRUD, 제너레이터, CSV

**복습할 공부 포인트:** 각 명령이 cli.py에서 어느 서비스 함수로 이어지는지, 수정은 옵션 방식이라는 점을 말해보기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 평가 현장에서 대표 명령 출력을 보여주면 좋다. 기존 최종 검수 결과가 있어 문서 작성 중 추가 실행은 필요하지 않다.

**직접 실습 증빙:** [add](./practice_session.log#L38), [list](./practice_session.log#L48), [search](./practice_session.log#L52), [summary](./practice_session.log#L76), [update](./practice_session.log#L104), [delete](./practice_session.log#L122), [export](./practice_session.log#L138), [import](./practice_session.log#L152)의 명령과 결과를 기록했다.

### 1-2

**평가문항 원문**

> 프로그램 재실행 후에도 거래/카테고리/예산 데이터가 유지되는가? (저장 파일 3개 이상)

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/cli.py:101-104](../budget_app/cli.py#L101), [budget_app/repositories.py:18-31](../budget_app/repositories.py#L18), [budget_app/repositories.py:51-61](../budget_app/repositories.py#L51), [budget_app/repositories.py:74-87](../budget_app/repositories.py#L74)

**평가항목과 직접 관련된 실제 코드**

[budget_app/cli.py:101-104](../budget_app/cli.py#L101)

```python
def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    initialize_storage(args.data_dir)
```

[budget_app/repositories.py:18-31](../budget_app/repositories.py#L18)

```python
DEFAULT_DATA_DIR = Path("data")
TRANSACTIONS_FILE = "transactions.jsonl"
CATEGORIES_FILE = "categories.jsonl"
BUDGETS_FILE = "budgets.jsonl"
CSV_COLUMNS = ("date", "type", "category", "amount", "memo", "tags")
DEFAULT_CATEGORIES: tuple[str, ...] = ("food", "transport", "rent", "etc")


# initialize_storage: 저장 폴더와 파일을 만들고 기본 카테고리를 준비한다.
def initialize_storage(data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)

    for filename in (TRANSACTIONS_FILE, CATEGORIES_FILE, BUDGETS_FILE):
        (data_dir / filename).touch(exist_ok=True)
```

[budget_app/repositories.py:51-61](../budget_app/repositories.py#L51)

```python
# iter_transactions: 저장된 거래를 한 건씩 읽는다.
def iter_transactions(data_dir: Path) -> Iterator[Transaction]:
    for record in iter_jsonl(data_dir / TRANSACTIONS_FILE):
        yield Transaction(**record)


# append_transaction: 새 거래를 저장 파일 끝에 추가한다.
def append_transaction(data_dir: Path, transaction: Transaction) -> None:
    with (data_dir / TRANSACTIONS_FILE).open("a", encoding="utf-8") as transaction_file:
        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)
        transaction_file.write("\n")
```

[budget_app/repositories.py:74-87](../budget_app/repositories.py#L74)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 명령을 시작할 때 저장 폴더와 파일을 준비하고, 거래·카테고리·예산을 서로 다른 JSONL 파일에 저장한다.

**이 코드가 평가항목을 어떻게 충족하는지:** transactions.jsonl, categories.jsonl, budgets.jsonl 세 파일이 정의되어 있고 파일 읽기·쓰기 함수가 있다. 완료된 최종 검수에서 별도 프로세스로 다시 실행해 값이 유지됨을 확인했다.

**사용된 주요 기술·개념:** Path, JSONL, 영구 저장, 파일 초기화

**복습할 공부 포인트:** 임시 변수와 저장 파일의 차이, --data-dir를 지정했을 때 파일 위치가 어떻게 바뀌는지 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 파일 3개와 재실행 뒤 목록·요약 결과를 시연하면 좋다. 추가 실행 검증은 필요하지 않다.

**직접 실습 증빙:** [저장 파일 3개 생성](./practice_session.log#L14), [카테고리 재실행 후 유지](./practice_session.log#L30), [거래 재실행 후 조회](./practice_session.log#L48), [예산 재실행 후 요약](./practice_session.log#L90)을 확인했다.

### 1-3

**평가문항 원문**

> category add/list/remove가 정상 동작하는가? (삭제 시 사용 중인 카테고리 처리 포함)

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/cli.py:236-249](../budget_app/cli.py#L236), [budget_app/services.py:42-52](../budget_app/services.py#L42), [budget_app/services.py:57-76](../budget_app/services.py#L57)

**평가항목과 직접 관련된 실제 코드**

[budget_app/cli.py:236-249](../budget_app/cli.py#L236)

```python
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
```

[budget_app/services.py:42-52](../budget_app/services.py#L42)

```python
def add_category(data_dir: Path, name: str) -> str:
    name = name.strip()

    # 이름이 비어 있으면 카테고리를 추가하지 않는다.
    if not name:
        raise ValueError("카테고리 이름을 입력하세요")

    # 이미 등록된 이름이면 중복 추가를 막는다.
    if name in iter_categories(data_dir):
        raise ValueError(f"'{name}' 카테고리는 이미 등록되어 있습니다")

```

[budget_app/services.py:57-76](../budget_app/services.py#L57)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 카테고리 이름을 받아 추가·목록·삭제하고, 삭제 전에 기존 거래가 그 이름을 사용 중인지 검사한다.

**이 코드가 평가항목을 어떻게 충족하는지:** 세 하위 명령이 연결되어 있고 사용 중인 카테고리의 삭제는 ValueError로 차단한다. 완료된 최종 검수에서 추가·목록·삭제와 사용 중 삭제 오류를 확인했다.

**사용된 주요 기술·개념:** 하위 명령, 제너레이터 조회, 참조 중인 데이터 보호

**복습할 공부 포인트:** 왜 사용 중인 카테고리를 바로 지우면 거래 데이터가 불일치할 수 있는지 말해보기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 등록·목록·삭제와 사용 중 삭제 실패 메시지를 보여주면 좋다. 추가 실행 검증은 필요하지 않다.

**직접 실습 증빙:** [기본 목록](./practice_session.log#L7), [`books` 추가](./practice_session.log#L23), [추가 후 목록](./practice_session.log#L30), [사용 중 삭제 차단](./practice_session.log#L112), [거래 삭제 후 카테고리 삭제](./practice_session.log#L126), [최종 목록](./practice_session.log#L131)을 확인했다.

### 1-4

**평가문항 원문**

> budget set이 저장되며, summary에서 예산 사용률/초과 여부가 출력되는가?

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/services.py:293-315](../budget_app/services.py#L293), [budget_app/services.py:327-332](../budget_app/services.py#L327), [budget_app/cli.py:178-193](../budget_app/cli.py#L178)

**평가항목과 직접 관련된 실제 코드**

[budget_app/services.py:293-315](../budget_app/services.py#L293)

```python
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
```

[budget_app/services.py:327-332](../budget_app/services.py#L327)

```python
# calculate_budget_usage: 예산 사용률과 초과 여부를 계산한다.
def calculate_budget_usage(summary: MonthlySummary, budget: Budget) -> tuple[float, bool]:
    # 저장된 예산이 0 이하이면 사용률을 계산하지 않는다.
    if budget.amount <= 0:
        raise ValueError("저장된 예산 금액은 0보다 커야 합니다")
    return summary.expense / budget.amount * 100, summary.expense > budget.amount
```

[budget_app/cli.py:178-193](../budget_app/cli.py#L178)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 월별 예산을 파일에 저장하고 요약할 때 지출액을 예산으로 나눠 사용률과 초과 여부를 계산한다.

**이 코드가 평가항목을 어떻게 충족하는지:** budget set 명령, 월 예산 저장, summary의 사용률·초과 여부·경고 출력이 연결되어 있다. 완료된 최종 검수에서 예산을 넘는 경우와 넘지 않는 경우를 확인했다.

**사용된 주요 기술·개념:** 월별 예산, 집계, 백분율, 영구 저장

**복습할 공부 포인트:** 사용률 계산식과 초과 기준(지출액이 예산보다 큰 경우)을 말해보기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — budget set 뒤 summary의 사용률과 초과 경고를 시연하면 좋다. 추가 실행 검증은 필요하지 않다.

**직접 실습 증빙:** [예산 설정](./practice_session.log#L86) 후 [월별 요약](./practice_session.log#L90)에서 사용률 133.3%, 초과 여부와 경고를 확인했다.

### 1-5

**평가문항 원문**

> import/export가 명시된 CSV 스키마(UTF-8, 헤더, 컬럼)로 동작하는가?

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/repositories.py:22](../budget_app/repositories.py#L22), [budget_app/repositories.py:150-162](../budget_app/repositories.py#L150), [budget_app/repositories.py:171-189](../budget_app/repositories.py#L171), [budget_app/services.py:344-349](../budget_app/services.py#L344), [budget_app/services.py:391-404](../budget_app/services.py#L391)

**평가항목과 직접 관련된 실제 코드**

[budget_app/repositories.py:22](../budget_app/repositories.py#L22)

```python
CSV_COLUMNS = ("date", "type", "category", "amount", "memo", "tags")
```

[budget_app/repositories.py:150-162](../budget_app/repositories.py#L150)

```python
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
```

[budget_app/repositories.py:171-189](../budget_app/repositories.py#L171)

```python
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
```

[budget_app/services.py:344-349](../budget_app/services.py#L344)

```python
    # 월과 기간 조건이 모두 없으면 내보내기를 막는다.
    if month is None and date_from is None and date_to is None:
        raise ValueError("--month 또는 --from과 --to를 지정하세요")
    # 시작일과 종료일은 함께 지정하도록 확인한다.
    if (date_from is None) != (date_to is None):
        raise ValueError("--from과 --to는 함께 지정해야 합니다")
```

[budget_app/services.py:391-404](../budget_app/services.py#L391)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 내보낼 때 고정 헤더를 가진 UTF-8 CSV를 쓰고, 가져올 때 헤더·열 수·각 거래 값을 확인한다.

**이 코드가 평가항목을 어떻게 충족하는지:** date,type,category,amount,memo,tags 스키마가 코드에 고정되어 있다. CSV를 UTF-8로 열고 월 또는 기간 조건을 요구하며, 완료된 최종 검수에서 내보낸 파일과 가져온 거래 반영을 확인했다.

**사용된 주요 기술·개념:** csv.writer, csv.DictReader, UTF-8, 헤더·행 검증

**복습할 공부 포인트:** JSONL 내부 저장과 CSV 입출력의 차이, 필수 열과 선택값(memo·tags)을 구별하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 내보낸 CSV의 헤더·한글 값과 가져오기 건수를 보여주면 좋다. 추가 실행 검증은 필요하지 않다.

**직접 실습 증빙:** [CSV 내보내기](./practice_session.log#L138), [헤더·행 확인](./practice_session.log#L142), [UTF-8 확인](./practice_session.log#L148), [별도 저장 폴더로 가져오기](./practice_session.log#L152), [가져온 목록](./practice_session.log#L156)을 확인했다.

### 1-6

**평가문항 원문**

> 잘못된 입력/파일 오류에서 스택트레이스 없이 오류 메시지와 해결 힌트를 출력하는가?

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/decorators.py:16-39](../budget_app/decorators.py#L16), [budget_app/validators.py:10-19](../budget_app/validators.py#L10)

**평가항목과 직접 관련된 실제 코드**

[budget_app/decorators.py:16-39](../budget_app/decorators.py#L16)

```python
        # 원래 CLI 함수를 실행해 종료 코드를 받는다.
        try:
            return func()
        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다.
        except (OSError, ValueError) as error:
            print(
                f"오류: {error}\n입력값과 저장 경로를 확인하세요.",
                file=sys.stderr,
            )
            return 1
        # 저장 데이터 형식 오류를 안내 메시지로 바꾼다.
        except (TypeError, KeyError) as error:
            print(
                f"오류: 저장 데이터 형식이 올바르지 않습니다 ({error}).\n저장 파일 내용을 확인하세요.",
                file=sys.stderr,
            )
            return 1
        # 입력 중단을 안내 메시지로 바꾼다.
        except (EOFError, KeyboardInterrupt):
            print(
                "오류: 입력이 중단되었습니다.\n필요한 값을 입력하고 다시 실행하세요.",
                file=sys.stderr,
            )
            return 1
```

[budget_app/validators.py:10-19](../budget_app/validators.py#L10)

```python
# is_valid_date: 날짜가 실제로 존재하는 YYYY-MM-DD 형식인지 확인한다.
def is_valid_date(value: str) -> bool:
    # 입력 문자열을 실제 날짜로 변환해 본다.
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    # 날짜로 변환할 수 없으면 유효하지 않다고 판단한다.
    except ValueError:
        return False
    return parsed.strftime("%Y-%m-%d") == value

```

**코드가 무슨 일을 하는지 쉬운 설명:** 입력값이나 파일 처리 중 오류가 나면 공통 데코레이터가 오류 이유와 확인 방법을 출력하고 스택트레이스를 사용자에게 보여주지 않는다.

**이 코드가 평가항목을 어떻게 충족하는지:** OSError·ValueError·TypeError·KeyError·입력 중단을 처리한다. 완료된 최종 검수에서 잘못된 입력, 없는 파일, 손상된 저장 데이터의 오류 문구를 확인했다.

**사용된 주요 기술·개념:** try/except, 데코레이터, stderr, 입력 검증

**복습할 공부 포인트:** 어떤 오류가 어느 except에 들어가는지와 원인·해결 힌트 두 줄을 읽어보기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 잘못된 `--limit` 값 또는 없는 CSV 파일에 대한 오류 메시지를 시연하면 좋다. 실습 로그에 두 결과를 기록했다.

**직접 실습 증빙:** [사용 중 카테고리 삭제 오류](./practice_session.log#L112), [잘못된 목록 개수 오류](./practice_session.log#L161), [없는 CSV 파일 오류](./practice_session.log#L170)에서 원인과 해결 안내가 출력되고 스택트레이스가 없는 것을 확인했다.

### 1-7

**평가문항 원문**

> 오류 상황에서 종료 코드가 0이 아님을 확인할 수 있는가?

**충족 여부:** 통과

**관련 파일명과 코드 위치:** [budget_app/__main__.py:6-8](../budget_app/__main__.py#L6), [budget_app/decorators.py:18-25](../budget_app/decorators.py#L18), [budget_app/cli.py:251](../budget_app/cli.py#L251)

**평가항목과 직접 관련된 실제 코드**

[budget_app/__main__.py:6-8](../budget_app/__main__.py#L6)

```python
# 직접 실행할 때 main의 종료 코드를 프로그램 종료 코드로 사용한다.
if __name__ == "__main__":
    raise SystemExit(main())
```

[budget_app/decorators.py:18-25](../budget_app/decorators.py#L18)

```python
            return func()
        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다.
        except (OSError, ValueError) as error:
            print(
                f"오류: {error}\n입력값과 저장 경로를 확인하세요.",
                file=sys.stderr,
            )
            return 1
```

[budget_app/cli.py:251](../budget_app/cli.py#L251)

```python
    return 0
```

**코드가 무슨 일을 하는지 쉬운 설명:** 정상 실행은 main에서 0을 돌려주고, 처리한 오류는 1을 돌려준다. 시작 파일이 이 값을 프로세스 종료 코드로 사용한다.

**이 코드가 평가항목을 어떻게 충족하는지:** return 0, return 1, SystemExit(main())가 연결되어 있다. 완료된 최종 검수에서 성공과 오류의 종료 코드를 확인했다.

**사용된 주요 기술·개념:** 프로세스 종료 코드, SystemExit, 오류 처리

**복습할 공부 포인트:** 터미널에서 종료 코드 0과 0이 아닌 값이 각각 무엇을 의미하는지 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 예 — 평가 시 정상·오류 명령 뒤 종료 코드를 확인할 수 있다. 추가 실행 검증은 필요하지 않다.

**직접 실습 증빙:** [카테고리 삭제 오류 뒤 종료 코드 1](./practice_session.log#L118), [잘못된 목록 개수 오류 뒤 종료 코드 1](./practice_session.log#L166)을 확인했다.

## 항목 2

### 2-1

**평가문항 원문**

> 코드가 3개 이상 모듈로 분리되어 있고, 각 모듈의 책임을 "어떻게" 나눴는지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/__main__.py:3-8](../budget_app/__main__.py#L3), [budget_app/cli.py:99-104](../budget_app/cli.py#L99), [budget_app/services.py:118-132](../budget_app/services.py#L118), [budget_app/repositories.py:57-61](../budget_app/repositories.py#L57), [budget_app/models.py:8-16](../budget_app/models.py#L8)

**평가항목과 직접 관련된 실제 코드**

[budget_app/__main__.py:3-8](../budget_app/__main__.py#L3)

```python
# main: 명령줄 입력을 처리하는 시작 함수를 가져온다.
from .cli import main

# 직접 실행할 때 main의 종료 코드를 프로그램 종료 코드로 사용한다.
if __name__ == "__main__":
    raise SystemExit(main())
```

[budget_app/cli.py:99-104](../budget_app/cli.py#L99)

```python
# main: 입력된 명령에 맞는 기능을 실행하고 결과를 출력한다.
@handle_cli_errors
def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    initialize_storage(args.data_dir)
```

[budget_app/services.py:118-132](../budget_app/services.py#L118)

```python
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
```

[budget_app/repositories.py:57-61](../budget_app/repositories.py#L57)

```python
# append_transaction: 새 거래를 저장 파일 끝에 추가한다.
def append_transaction(data_dir: Path, transaction: Transaction) -> None:
    with (data_dir / TRANSACTIONS_FILE).open("a", encoding="utf-8") as transaction_file:
        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)
        transaction_file.write("\n")
```

[budget_app/models.py:8-16](../budget_app/models.py#L8)

```python
@dataclass
class Transaction:
    id: str
    type: str
    date: str
    amount: int
    category: str
    memo: str = ""
    tags: list[str] = field(default_factory=list)
```

**코드가 무슨 일을 하는지 쉬운 설명:** 시작 파일은 CLI를 부르고, CLI는 사용자 입력·출력을 맡으며, 서비스는 업무 규칙을 처리하고 저장소는 파일을 읽고 쓴다. 모델은 거래의 데이터 모양을 담는다.

**이 코드가 평가항목을 어떻게 충족하는지:** 3개보다 많은 모듈과 호출 연결은 코드에서 확인된다. 다만 각 책임을 사용자가 왜 그렇게 나눴는지 설명할 수 있는지는 코드만으로 확정할 수 없다.

**사용된 주요 기술·개념:** 모듈 분리, 계층 책임, 관심사 분리

**복습할 공부 포인트:** __main__ → cli → services → repositories → models 흐름을 자기 말로 설명하기. validators와 decorators의 역할도 구분하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 파일 구조와 코드로 확인할 수 있다. 사용자 설명 확인은 필요하다.

### 2-2

**평가문항 원문**

> 최소 2개 이상의 클래스에 부여한 책임 경계를 "어떻게" 정했는지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/models.py:8-16](../budget_app/models.py#L8), [budget_app/models.py:19-23](../budget_app/models.py#L19), [budget_app/models.py:26-34](../budget_app/models.py#L26)

**평가항목과 직접 관련된 실제 코드**

[budget_app/models.py:8-16](../budget_app/models.py#L8)

```python
@dataclass
class Transaction:
    id: str
    type: str
    date: str
    amount: int
    category: str
    memo: str = ""
    tags: list[str] = field(default_factory=list)
```

[budget_app/models.py:19-23](../budget_app/models.py#L19)

```python
# Budget: 특정 월의 예산을 담는다.
@dataclass
class Budget:
    month: str
    amount: int
```

[budget_app/models.py:26-34](../budget_app/models.py#L26)

```python
# MonthlySummary: 한 달의 수입·지출·잔액과 지출 상위 카테고리를 담는다.
@dataclass
class MonthlySummary:
    month: str
    income: int
    expense: int
    balance: int
    top_categories: list[tuple[str, int]]
    transaction_count: int
```

**코드가 무슨 일을 하는지 쉬운 설명:** Transaction은 거래 한 건, Budget은 한 달의 예산, MonthlySummary는 계산된 월별 결과를 담는다.

**이 코드가 평가항목을 어떻게 충족하는지:** 세 dataclass와 각 필드의 역할은 확인된다. 클래스의 책임 경계를 사용자가 어떻게 정했는지 설명할 수 있는지는 별도 확인이 필요하다.

**사용된 주요 기술·개념:** dataclass, 데이터 모델, 책임 경계

**복습할 공부 포인트:** Transaction과 Budget이 저장되는 원본 데이터이고 MonthlySummary는 계산 결과라는 차이를 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 클래스 정의 확인으로 충분하다. 사용자 설명 확인은 필요하다.

### 2-3

**평가문항 원문**

> 파일 기반 update/delete를 "어떻게" 안전하게 처리했는지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/services.py:214-230](../budget_app/services.py#L214), [budget_app/services.py:235-246](../budget_app/services.py#L235), [budget_app/repositories.py:64-71](../budget_app/repositories.py#L64)

**평가항목과 직접 관련된 실제 코드**

[budget_app/services.py:214-230](../budget_app/services.py#L214)

```python
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
```

[budget_app/services.py:235-246](../budget_app/services.py#L235)

```python
# delete_transaction: 지정한 ID의 거래를 삭제한다.
def delete_transaction(data_dir: Path, transaction_id: str) -> str:
    transactions = list(iter_transactions(data_dir))

    for index, transaction in enumerate(transactions):
        # ID가 일치하는 거래를 찾으면 삭제한다.
        if transaction.id == transaction_id:
            del transactions[index]
            save_transactions(data_dir, transactions)
            return transaction_id

    raise ValueError(f"거래 id '{transaction_id}'에 해당하는 데이터가 없습니다")
```

[budget_app/repositories.py:64-71](../budget_app/repositories.py#L64)

```python
# save_transactions: 거래 전체를 저장 파일에 다시 쓴다.
def save_transactions(data_dir: Path, transactions: list[Transaction]) -> None:
    lines = [
        json.dumps(asdict(transaction), ensure_ascii=False) + "\n"
        for transaction in transactions
    ]
    with (data_dir / TRANSACTIONS_FILE).open("w", encoding="utf-8") as transaction_file:
        transaction_file.writelines(lines)
```

**코드가 무슨 일을 하는지 쉬운 설명:** 수정·삭제 전에 거래들을 읽어 ID를 찾고, 바뀐 목록 전체를 파일에 다시 쓴다. 대상이 없으면 저장하지 않고 오류를 낸다.

**이 코드가 평가항목을 어떻게 충족하는지:** 정상적인 수정·삭제와 없는 ID 처리는 코드와 기존 검수로 확인된다. 다만 현재 save_transactions는 원본 파일을 w 모드로 열어 직접 재작성하므로 쓰기 도중 중단까지 견디는 원자적 저장은 아니다. 이 한계까지 포함해 안전성을 설명할 수 있는지 확인이 필요하다.

**사용된 주요 기술·개념:** 파일 전체 재작성, ID 조회, 데이터 검증, 원자성의 한계

**복습할 공부 포인트:** 저장 전 검증과 파일 쓰기 중 장애 대비는 다른 문제임을 설명하기. 임시 파일·원자적 교체가 왜 더 안전한지 복습하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 코드와 설명으로 확인한다. 사용자 설명 확인은 필요하다.

## 항목 3

### 3-1

**평가문항 원문**

> list/search를 제너레이터로 스트리밍 처리한 방식을 "어떻게" 구현했고, "왜" 유리한지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/repositories.py:44-48](../budget_app/repositories.py#L44), [budget_app/repositories.py:120-142](../budget_app/repositories.py#L120), [budget_app/services.py:159-178](../budget_app/services.py#L159), [budget_app/cli.py:128-140](../budget_app/cli.py#L128)

**평가항목과 직접 관련된 실제 코드**

[budget_app/repositories.py:44-48](../budget_app/repositories.py#L44)

```python
# iter_jsonl: JSONL 파일을 한 줄씩 읽어 데이터로 변환한다.
def iter_jsonl(path: Path) -> Iterator[dict[str, object]]:
    with path.open("r", encoding="utf-8") as data_file:
        for line in data_file:
            yield json.loads(line)
```

[budget_app/repositories.py:120-142](../budget_app/repositories.py#L120)

```python
# iter_transactions_latest: 파일 전체를 메모리에 올리지 않고 최신 거래부터 읽는다.
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
```

[budget_app/services.py:159-178](../budget_app/services.py#L159)

```python
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
```

[budget_app/cli.py:128-140](../budget_app/cli.py#L128)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 파일을 한 줄씩 yield로 읽고, list는 최신 후보를 반복해서 찾아 출력하며, search는 조건에 맞는 거래만 다시 yield한다.

**이 코드가 평가항목을 어떻게 충족하는지:** list와 search의 제너레이터 사용은 코드에 있다. 파일 전체를 한 번에 메모리에 올리지 않는 장점을 사용자가 설명할 수 있는지는 확인이 필요하다. 최신순 조회는 파일을 여러 번 읽는 대가가 있다.

**사용된 주요 기술·개념:** yield, Iterator, 지연 평가, 스트리밍, 반복 스캔

**복습할 공부 포인트:** yield와 return의 차이, 메모리 절약과 반복 읽기 속도의 교환관계를 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 스트리밍 방식은 코드에서 확인하며 사용자 설명 확인이 필요하다.

### 3-2

**평가문항 원문**

> 데코레이터로 분리한 공통 기능이 무엇이며, "왜" 분리가 필요했는지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/decorators.py:11-41](../budget_app/decorators.py#L11), [budget_app/cli.py:99-104](../budget_app/cli.py#L99)

**평가항목과 직접 관련된 실제 코드**

[budget_app/decorators.py:11-41](../budget_app/decorators.py#L11)

```python
# handle_cli_errors: CLI 오류를 스택트레이스 대신 안내 메시지로 처리한다.
def handle_cli_errors(func: Callable[[], int]) -> Callable[[], int]:
    # wrapper: 원래 함수를 실행하고 오류가 나면 메시지와 종료 코드를 돌려준다.
    @wraps(func)
    def wrapper() -> int:
        # 원래 CLI 함수를 실행해 종료 코드를 받는다.
        try:
            return func()
        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다.
        except (OSError, ValueError) as error:
            print(
                f"오류: {error}\n입력값과 저장 경로를 확인하세요.",
                file=sys.stderr,
            )
            return 1
        # 저장 데이터 형식 오류를 안내 메시지로 바꾼다.
        except (TypeError, KeyError) as error:
            print(
                f"오류: 저장 데이터 형식이 올바르지 않습니다 ({error}).\n저장 파일 내용을 확인하세요.",
                file=sys.stderr,
            )
            return 1
        # 입력 중단을 안내 메시지로 바꾼다.
        except (EOFError, KeyboardInterrupt):
            print(
                "오류: 입력이 중단되었습니다.\n필요한 값을 입력하고 다시 실행하세요.",
                file=sys.stderr,
            )
            return 1

    return wrapper
```

[budget_app/cli.py:99-104](../budget_app/cli.py#L99)

```python
# main: 입력된 명령에 맞는 기능을 실행하고 결과를 출력한다.
@handle_cli_errors
def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    initialize_storage(args.data_dir)
```

**코드가 무슨 일을 하는지 쉬운 설명:** handle_cli_errors가 CLI 실행을 감싸 여러 명령의 오류를 한곳에서 같은 형식으로 처리한다.

**이 코드가 평가항목을 어떻게 충족하는지:** 직접 만든 데코레이터가 main에 실제 적용된 점은 확인된다. 왜 공통 처리를 분리했는지를 사용자가 설명할 수 있는지는 확인이 필요하다.

**사용된 주요 기술·개념:** 데코레이터, wraps, 공통 관심사, 예외 처리

**복습할 공부 포인트:** 데코레이터가 원래 함수를 감싸는 순서와 명령마다 같은 try/except를 반복하지 않아도 되는 이유를 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 적용 위치를 코드에서 확인하고 사용자 설명을 듣는다.

### 3-3

**평가문항 원문**

> 타입 힌트를 적용해 얻는 이점을 실제 코드 예로 "어떻게" 확인했고 "왜" 도움이 되는지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/models.py:8-16](../budget_app/models.py#L8), [budget_app/repositories.py:44-48](../budget_app/repositories.py#L44), [budget_app/services.py:135-145](../budget_app/services.py#L135)

**평가항목과 직접 관련된 실제 코드**

[budget_app/models.py:8-16](../budget_app/models.py#L8)

```python
@dataclass
class Transaction:
    id: str
    type: str
    date: str
    amount: int
    category: str
    memo: str = ""
    tags: list[str] = field(default_factory=list)
```

[budget_app/repositories.py:44-48](../budget_app/repositories.py#L44)

```python
# iter_jsonl: JSONL 파일을 한 줄씩 읽어 데이터로 변환한다.
def iter_jsonl(path: Path) -> Iterator[dict[str, object]]:
    with path.open("r", encoding="utf-8") as data_file:
        for line in data_file:
            yield json.loads(line)
```

[budget_app/services.py:135-145](../budget_app/services.py#L135)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** 모델 필드와 함수의 입력·반환 타입을 적어 어떤 데이터를 주고받는지 드러낸다.

**이 코드가 평가항목을 어떻게 충족하는지:** Transaction의 필드 타입과 Iterator[dict[str, object]], Iterator[Transaction] 같은 함수 반환 타입이 코드에 있다. 타입 힌트의 이점을 사용자가 실제 코드로 설명할 수 있는지는 확인이 필요하다.

**사용된 주요 기술·개념:** 타입 힌트, dataclass, Iterator, 입력·출력 계약

**복습할 공부 포인트:** Transaction.amount: int와 search_transactions(...) -> Iterator[Transaction]이 각각 무엇을 알려주는지, 타입 힌트가 실행 시 자동 검증은 아니라는 점을 설명하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 코드 예는 확보되어 있고 사용자 설명 확인이 필요하다.

## 항목 4

### 4-1

**평가문항 원문**

> JSONL과 CSV 중 선택한 저장 포맷의 장단점을 비교하고, "왜" 그 포맷을 택했는지 근거를 말할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/repositories.py:18-22](../budget_app/repositories.py#L18), [budget_app/repositories.py:57-61](../budget_app/repositories.py#L57), [budget_app/repositories.py:150-152](../budget_app/repositories.py#L150)

**평가항목과 직접 관련된 실제 코드**

[budget_app/repositories.py:18-22](../budget_app/repositories.py#L18)

```python
DEFAULT_DATA_DIR = Path("data")
TRANSACTIONS_FILE = "transactions.jsonl"
CATEGORIES_FILE = "categories.jsonl"
BUDGETS_FILE = "budgets.jsonl"
CSV_COLUMNS = ("date", "type", "category", "amount", "memo", "tags")
```

[budget_app/repositories.py:57-61](../budget_app/repositories.py#L57)

```python
# append_transaction: 새 거래를 저장 파일 끝에 추가한다.
def append_transaction(data_dir: Path, transaction: Transaction) -> None:
    with (data_dir / TRANSACTIONS_FILE).open("a", encoding="utf-8") as transaction_file:
        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)
        transaction_file.write("\n")
```

[budget_app/repositories.py:150-152](../budget_app/repositories.py#L150)

```python
    with output_path.open("w", encoding="utf-8", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(CSV_COLUMNS)
```

**코드가 무슨 일을 하는지 쉬운 설명:** 내부 저장은 JSONL 세 파일이고, 외부 입출력은 CSV를 사용한다. JSONL은 한 줄씩 추가·읽기 쉽고 거래의 태그 목록을 자연스럽게 담는다.

**이 코드가 평가항목을 어떻게 충족하는지:** JSONL 선택과 CSV 입출력의 실제 코드는 확인된다. 두 형식의 장단점과 선택 이유를 사용자가 비교해 말할 수 있는지는 확인이 필요하다. 선택 이유는 코드로부터의 해석이다.

**사용된 주요 기술·개념:** JSONL, CSV, 줄 단위 저장, csv.writer, 데이터 표현

**복습할 공부 포인트:** JSONL의 유연한 필드·줄 단위 읽기와 CSV의 범용성, JSONL의 반복 탐색 비용을 비교하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 포맷은 코드로 확인하고 선택 근거는 사용자 설명이 필요하다.

### 4-2

**평가문항 원문**

> 거래가 10만 건으로 늘어난다면, 현재 구조에서 병목이 어디이며 "어떻게" 개선할지 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/repositories.py:120-142](../budget_app/repositories.py#L120), [budget_app/services.py:214-215](../budget_app/services.py#L214), [budget_app/services.py:383-386](../budget_app/services.py#L383)

**평가항목과 직접 관련된 실제 코드**

[budget_app/repositories.py:120-142](../budget_app/repositories.py#L120)

```python
# iter_transactions_latest: 파일 전체를 메모리에 올리지 않고 최신 거래부터 읽는다.
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
```

[budget_app/services.py:214-215](../budget_app/services.py#L214)

```python
    transactions = list(iter_transactions(data_dir))
    for index, current in enumerate(transactions):
```

[budget_app/services.py:383-386](../budget_app/services.py#L383)

```python
def import_transactions(data_dir: Path, csv_path: Path) -> int:
    existing = list(iter_transactions(data_dir))
    used_ids = {transaction.id for transaction in existing}
    imported: list[Transaction] = []
```

**코드가 무슨 일을 하는지 쉬운 설명:** 최신순 조회가 결과 한 건마다 파일을 다시 훑고, 수정·삭제와 가져오기는 거래 전체를 리스트로 읽는다.

**이 코드가 평가항목을 어떻게 충족하는지:** 10만 건일 때 반복 파일 스캔과 전체 메모리 적재가 병목이 될 근거는 코드에 있다. 어떤 개선을 선택하고 이유를 설명할 수 있는지는 사용자 확인이 필요하며, 10만 건 실행 실험은 하지 않았다.

**사용된 주요 기술·개념:** 시간 복잡도, 메모리 사용량, 반복 파일 I/O

**복습할 공부 포인트:** 현재 최신순 조회의 반복 스캔 비용을 설명하고, 정렬·인덱스·상위 N만 선택하는 방법과 메모리 비용을 비교하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 이 문항은 병목과 개선안 설명을 묻는다. 10만 건 실제 실행은 수행하지 않았으며 필수로 판단하지 않는다.

### 4-3

**평가문항 원문**

> import CSV에 일부 깨진 행이 섞이면, "어떻게" 처리해 사용자 신뢰를 지킬지 (부분 성공/롤백/리포트) 설명할 수 있는가?

**충족 여부:** 확인 필요

**관련 파일명과 코드 위치:** [budget_app/repositories.py:175-189](../budget_app/repositories.py#L175), [budget_app/services.py:388-413](../budget_app/services.py#L388)

**평가항목과 직접 관련된 실제 코드**

[budget_app/repositories.py:175-189](../budget_app/repositories.py#L175)

```python
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
```

[budget_app/services.py:388-413](../budget_app/services.py#L388)

```python
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
```

**코드가 무슨 일을 하는지 쉬운 설명:** CSV 행을 하나씩 검증해 임시 목록에 모은 뒤, 모든 행을 통과했을 때만 거래 파일을 저장한다. 잘못된 행에는 CSV 행 번호를 붙여 알린다.

**이 코드가 평가항목을 어떻게 충족하는지:** 깨진 행 앞의 정상 행도 저장하지 않는 일괄 실패 방식은 코드에서 확인된다. 부분 성공·롤백·리포트 중 어떤 정책을 택했고 왜 신뢰에 유리한지 사용자가 설명할 수 있는지는 확인이 필요하다. 파일 쓰기 자체는 원자적 교체가 아니다.

**사용된 주요 기술·개념:** CSV 행 검증, 일괄 처리, 실패 시 저장 보류, 행 번호 오류

**복습할 공부 포인트:** 정상 행 뒤에 잘못된 행이 나오면 save_transactions가 호출되는지 추적하기. 검증 단계의 일괄 실패와 디스크 쓰기 원자성을 구분하기.

**실제 실행 화면이나 결과 확인 필요 여부:** 아니요 — 현재 정책은 코드와 완료된 검수로 확인된다. 사용자 설명 확인은 필요하지만 추가 실행은 필수로 보지 않는다.

## 추가 확인 목록

- **사용자 설명 확인:** 항목 2-1~2-3, 3-1~3-3, 4-1~4-3은 코드 근거가 있지만 사용자가 자기 말로 설명할 수 있는지 확인해야 한다.
- **추가 실행 검증:** 항목 1-1~1-7의 명령과 결과는 사용자가 직접 실습해 로그로 남겼다. 현재 꼭 필요한 추가 실행 항목은 없다. 실행 화면은 추후 첨부한다.
- **설명 시 한계 명시:** update/delete의 파일 전체 재작성은 쓰기 도중 중단에 대해 원자적이지 않다. 최신순 스트리밍은 파일 재탐색 비용이 있고, CSV 깨진 행의 일괄 실패는 검증 단계에 적용된다.
