window.REVIEW_CARDS = [
  {
    "id": "1-1",
    "title": "여덟 가지 거래 명령",
    "what": "터미널에서 고른 명령을 CLI가 구분해 해당 작업을 호출한다. 거래를 추가·조회·검색·요약·수정·삭제하거나 CSV로 주고받는다.",
    "place": "cli.py가 사용자 명령을 접수하고, 실제 거래 처리는 services.py에 요청한다.",
    "origin": "argparse는 Python 표준 라이브러리다. add·list 등의 명령 이름은 미션에서 정했고, build_parser·add_transaction 같은 함수 이름은 프로젝트에서 정했다.",
    "steps": [
      "사용자가 명령과 옵션을 입력한다.",
      "build_parser가 명령 종류를 해석한다.",
      "main이 해당 분기로 들어가 서비스 함수를 호출하고 결과를 출력한다."
    ],
    "connections": "__main__.py → cli.py → services.py → repositories.py 순으로 이어진다. 각 명령의 실습 결과는 practice_session.log에 있다.",
    "why": "사용자 입력과 업무 처리를 분리해 명령이 늘어나도 역할을 찾기 쉽게 했다.",
    "proof": "여덟 명령의 CLI 등록·호출 코드와 실습 로그가 평가 문항의 동작 근거다.",
    "recall": "명령을 등록하는 코드와 실제로 실행하는 분기는 서로 다른 위치에 있다.",
    "question": "add/list/search/summary/export/import/update/delete가 요구사항대로 동작하는가?",
    "status": "통과",
    "answer": "예. 여덟 명령이 CLI에서 각각 실행되고, 추가한 거래의 조회·검색·요약·수정·삭제와 CSV 내보내기·가져오기 결과를 실습 로그로 확인했다.",
    "practice": "[add](./practice_session.log#L38), [list](./practice_session.log#L48), [search](./practice_session.log#L52), [summary](./practice_session.log#L76), [update](./practice_session.log#L104), [delete](./practice_session.log#L122), [export](./practice_session.log#L138), [import](./practice_session.log#L152)의 명령과 결과를 기록했다.",
    "excerpts": [
      {
        "label": "명령 등록",
        "kind": "direct",
        "file": "budget_app/cli.py",
        "start": 45,
        "end": 58,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L45",
        "lines": [
          {
            "number": 45,
            "text": "    subparsers = parser.add_subparsers(dest=\"command\", required=True)"
          },
          {
            "number": 46,
            "text": ""
          },
          {
            "number": 47,
            "text": "    subparsers.add_parser(\"add\", help=\"거래 추가\")"
          },
          {
            "number": 48,
            "text": "    list_parser = subparsers.add_parser(\"list\", help=\"거래 목록\")"
          },
          {
            "number": 49,
            "text": "    list_parser.add_argument(\"--limit\", type=int, default=10, help=\"최대 출력 건수 (기본값: 10)\")"
          },
          {
            "number": 50,
            "text": "    search_parser = subparsers.add_parser(\"search\", help=\"거래 검색\")"
          },
          {
            "number": 51,
            "text": "    search_parser.add_argument(\"--from\", dest=\"date_from\", help=\"시작일 (YYYY-MM-DD)\")"
          },
          {
            "number": 52,
            "text": "    search_parser.add_argument(\"--to\", dest=\"date_to\", help=\"종료일 (YYYY-MM-DD)\")"
          },
          {
            "number": 53,
            "text": "    search_parser.add_argument(\"--category\", help=\"카테고리\")"
          },
          {
            "number": 54,
            "text": "    search_parser.add_argument(\"--type\", dest=\"transaction_type\", help=\"income 또는 expense\")"
          },
          {
            "number": 55,
            "text": "    search_parser.add_argument(\"--q\", help=\"메모 키워드\")"
          },
          {
            "number": 56,
            "text": "    search_parser.add_argument(\"--tag\", help=\"태그\")"
          },
          {
            "number": 57,
            "text": "    summary_parser = subparsers.add_parser(\"summary\", help=\"월별 요약\")"
          },
          {
            "number": 58,
            "text": "    summary_parser.add_argument(\"--month\", required=True, help=\"요약할 월 (YYYY-MM)\")"
          }
        ]
      },
      {
        "label": "수정·삭제 명령 실행",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 196,
        "end": 220,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L196",
        "lines": [
          {
            "number": 196,
            "text": "    elif args.command == \"update\":"
          },
          {
            "number": 197,
            "text": "        tags = None"
          },
          {
            "number": 198,
            "text": "        # 태그 옵션이 있으면 쉼표로 나누어 목록으로 만든다."
          },
          {
            "number": 199,
            "text": "        if args.tags is not None:"
          },
          {
            "number": 200,
            "text": "            # 쉼표로 나눈 태그에서 빈 항목을 제외한다."
          },
          {
            "number": 201,
            "text": "            tags = [tag.strip() for tag in args.tags.split(\",\") if tag.strip()]"
          },
          {
            "number": 202,
            "text": ""
          },
          {
            "number": 203,
            "text": "        updated = update_transaction("
          },
          {
            "number": 204,
            "text": "            args.data_dir,"
          },
          {
            "number": 205,
            "text": "            args.id,"
          },
          {
            "number": 206,
            "text": "            date=args.date,"
          },
          {
            "number": 207,
            "text": "            transaction_type=args.transaction_type,"
          },
          {
            "number": 208,
            "text": "            category=args.category,"
          },
          {
            "number": 209,
            "text": "            amount=args.amount,"
          },
          {
            "number": 210,
            "text": "            memo=args.memo,"
          },
          {
            "number": 211,
            "text": "            tags=tags,"
          },
          {
            "number": 212,
            "text": "        )"
          },
          {
            "number": 213,
            "text": "        print(f\"거래 수정 완료 (id: {updated.id})\")"
          },
          {
            "number": 214,
            "text": ""
          },
          {
            "number": 215,
            "text": "    # 삭제 명령이면 해당 ID의 거래를 지운다."
          },
          {
            "number": 216,
            "text": "    elif args.command == \"delete\":"
          },
          {
            "number": 217,
            "text": "        deleted_id = delete_transaction(args.data_dir, args.id)"
          },
          {
            "number": 218,
            "text": "        print(f\"거래 삭제 완료 (id: {deleted_id})\")"
          },
          {
            "number": 219,
            "text": ""
          },
          {
            "number": 220,
            "text": "    # 내보내기 명령이면 거래를 CSV로 저장한다."
          }
        ]
      },
      {
        "label": "CSV 명령 실행",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 221,
        "end": 235,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L221",
        "lines": [
          {
            "number": 221,
            "text": "    elif args.command == \"export\":"
          },
          {
            "number": 222,
            "text": "        count = export_transactions("
          },
          {
            "number": 223,
            "text": "            args.data_dir,"
          },
          {
            "number": 224,
            "text": "            args.out,"
          },
          {
            "number": 225,
            "text": "            month=args.month,"
          },
          {
            "number": 226,
            "text": "            date_from=args.date_from,"
          },
          {
            "number": 227,
            "text": "            date_to=args.date_to,"
          },
          {
            "number": 228,
            "text": "        )"
          },
          {
            "number": 229,
            "text": "        print(f\"{count}건 내보내기 완료: {args.out}\")"
          },
          {
            "number": 230,
            "text": ""
          },
          {
            "number": 231,
            "text": "    # 가져오기 명령이면 CSV 거래를 저장한다."
          },
          {
            "number": 232,
            "text": "    elif args.command == \"import\":"
          },
          {
            "number": 233,
            "text": "        count = import_transactions(args.data_dir, args.csv_path)"
          },
          {
            "number": 234,
            "text": "        print(f\"{count}건 가져오기 완료: {args.csv_path}\")"
          },
          {
            "number": 235,
            "text": ""
          }
        ]
      }
    ]
  },
  {
    "id": "1-2",
    "title": "다시 실행해도 남는 데이터",
    "what": "프로그램이 시작할 때 저장 폴더와 파일을 준비하고, 거래·카테고리·예산을 각각 별도 파일에 기록한다.",
    "place": "cli.py가 초기화를 요청하고 repositories.py가 실제 data 파일을 다룬다.",
    "origin": "Path는 Python 표준 라이브러리다. data 기본 경로와 JSONL 파일명은 현재 프로젝트가 정한 값이며, 저장 파일 3개 이상은 평가 문항에 적힌 조건이다.",
    "steps": [
      "main이 initialize_storage를 부른다.",
      "저장 폴더와 세 파일이 없으면 만든다.",
      "각 작업은 파일을 읽거나 써서 다음 실행에서도 같은 데이터를 사용한다."
    ],
    "connections": "main → initialize_storage → transactions.jsonl·categories.jsonl·budgets.jsonl로 이어진다.",
    "why": "메모리 안의 값은 종료되면 사라지지만 파일에 쓴 값은 다음 실행에 다시 읽을 수 있다.",
    "proof": "파일 초기화·읽기·쓰기 코드와 재실행 실습 로그가 데이터 유지의 근거다.",
    "recall": "프로그램을 다시 켜도 남는 이유는 변수가 아니라 디스크 파일에 저장하기 때문이다.",
    "question": "프로그램 재실행 후에도 거래/카테고리/예산 데이터가 유지되는가? (저장 파일 3개 이상)",
    "status": "통과",
    "answer": "예. data 폴더의 transactions.jsonl, categories.jsonl, budgets.jsonl에 각각 저장하며, 프로그램을 다시 실행해도 카테고리·거래·예산 값이 유지됨을 실습 로그로 확인했다.",
    "practice": "[저장 파일 3개 생성](./practice_session.log#L14), [카테고리 재실행 후 유지](./practice_session.log#L30), [거래 재실행 후 조회](./practice_session.log#L48), [예산 재실행 후 요약](./practice_session.log#L90)을 확인했다.",
    "excerpts": [
      {
        "label": "세 저장 파일 준비",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 18,
        "end": 31,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L18",
        "lines": [
          {
            "number": 18,
            "text": "DEFAULT_DATA_DIR = Path(\"data\")"
          },
          {
            "number": 19,
            "text": "TRANSACTIONS_FILE = \"transactions.jsonl\""
          },
          {
            "number": 20,
            "text": "CATEGORIES_FILE = \"categories.jsonl\""
          },
          {
            "number": 21,
            "text": "BUDGETS_FILE = \"budgets.jsonl\""
          },
          {
            "number": 22,
            "text": "CSV_COLUMNS = (\"date\", \"type\", \"category\", \"amount\", \"memo\", \"tags\")"
          },
          {
            "number": 23,
            "text": "DEFAULT_CATEGORIES: tuple[str, ...] = (\"food\", \"transport\", \"rent\", \"etc\")"
          },
          {
            "number": 24,
            "text": ""
          },
          {
            "number": 25,
            "text": ""
          },
          {
            "number": 26,
            "text": "# 프로그램을 처음 실행할 때 필요한 data 폴더와 저장 파일 3개를 준비하고, 기본 카테고리를 준비한다."
          },
          {
            "number": 27,
            "text": "def initialize_storage(data_dir: Path) -> None:"
          },
          {
            "number": 28,
            "text": "    data_dir.mkdir(parents=True, exist_ok=True)"
          },
          {
            "number": 29,
            "text": ""
          },
          {
            "number": 30,
            "text": "    for filename in (TRANSACTIONS_FILE, CATEGORIES_FILE, BUDGETS_FILE):"
          },
          {
            "number": 31,
            "text": "        (data_dir / filename).touch(exist_ok=True)"
          }
        ]
      },
      {
        "label": "실행 시작 시 초기화",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 100,
        "end": 104,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L100",
        "lines": [
          {
            "number": 100,
            "text": "@handle_cli_errors"
          },
          {
            "number": 101,
            "text": "def main() -> int:"
          },
          {
            "number": 102,
            "text": "    parser = build_parser()"
          },
          {
            "number": 103,
            "text": "    args = parser.parse_args()"
          },
          {
            "number": 104,
            "text": "    initialize_storage(args.data_dir)"
          }
        ]
      },
      {
        "label": "거래 파일에 한 건 쓰기",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 57,
        "end": 61,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L57",
        "lines": [
          {
            "number": 57,
            "text": "# append_transaction: 새 거래를 저장 파일 끝에 추가한다."
          },
          {
            "number": 58,
            "text": "def append_transaction(data_dir: Path, transaction: Transaction) -> None:"
          },
          {
            "number": 59,
            "text": "    with (data_dir / TRANSACTIONS_FILE).open(\"a\", encoding=\"utf-8\") as transaction_file:"
          },
          {
            "number": 60,
            "text": "        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)"
          },
          {
            "number": 61,
            "text": "        transaction_file.write(\"\\n\")"
          }
        ]
      }
    ]
  },
  {
    "id": "1-3",
    "title": "카테고리 관리",
    "what": "카테고리를 추가하거나 목록을 보여주고 삭제한다. 이미 거래에서 사용하는 카테고리는 삭제하지 않는다.",
    "place": "cli.py가 category 하위 명령을 받고 services.py가 등록 여부와 사용 여부를 판단한다.",
    "origin": "category add/list/remove 명령은 미션에서 정한 이름이다. add_category·remove_category는 프로젝트 함수이며 set은 Python 언어가 제공하는 집합이다.",
    "steps": [
      "카테고리 명령을 고른다.",
      "서비스가 이미 등록됐는지 또는 거래에서 사용 중인지 검사한다.",
      "허용되면 repositories.py를 통해 저장 파일을 변경한다."
    ],
    "connections": "cli.py → services.py → repositories.py → categories.jsonl; 삭제 검사에는 transactions.jsonl도 사용한다.",
    "why": "거래가 참조하는 카테고리를 없애면 기존 거래의 의미가 불분명해지므로 삭제를 막는다.",
    "proof": "추가·목록·삭제 분기와 사용 중 삭제 차단 코드를 실습 로그의 결과와 대조할 수 있다.",
    "recall": "카테고리 삭제는 해당 이름을 쓰는 거래가 있는지 먼저 확인한다.",
    "question": "category add/list/remove가 정상 동작하는가? (삭제 시 사용 중인 카테고리 처리 포함)",
    "status": "통과",
    "answer": "예. category add/list/remove가 연결되어 있다. 등록된 카테고리를 거래가 사용 중이면 삭제를 거부하고, 해당 거래를 삭제한 뒤에는 카테고리를 삭제할 수 있다.",
    "practice": "[기본 목록](./practice_session.log#L7), [`books` 추가](./practice_session.log#L23), [추가 후 목록](./practice_session.log#L30), [사용 중 삭제 차단](./practice_session.log#L112), [거래 삭제 후 카테고리 삭제](./practice_session.log#L126), [최종 목록](./practice_session.log#L131)을 확인했다.",
    "excerpts": [
      {
        "label": "사용 중 삭제 차단",
        "kind": "direct",
        "file": "budget_app/services.py",
        "start": 57,
        "end": 76,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L57",
        "lines": [
          {
            "number": 57,
            "text": "# remove_category: 거래에서 사용 중인지 확인한 뒤 카테고리를 삭제한다."
          },
          {
            "number": 58,
            "text": "def remove_category(data_dir: Path, name: str) -> str:"
          },
          {
            "number": 59,
            "text": "    name = name.strip()"
          },
          {
            "number": 60,
            "text": "    # 이름이 비어 있으면 삭제할 대상을 찾을 수 없으므로 오류를 낸다."
          },
          {
            "number": 61,
            "text": "    if not name:"
          },
          {
            "number": 62,
            "text": "        raise ValueError(\"카테고리 이름을 입력하세요\")"
          },
          {
            "number": 63,
            "text": ""
          },
          {
            "number": 64,
            "text": "    categories = list(iter_categories(data_dir))"
          },
          {
            "number": 65,
            "text": "    # 등록되지 않은 카테고리면 삭제하지 않는다."
          },
          {
            "number": 66,
            "text": "    if name not in categories:"
          },
          {
            "number": 67,
            "text": "        raise ValueError(f\"'{name}' 카테고리는 등록되어 있지 않습니다\")"
          },
          {
            "number": 68,
            "text": ""
          },
          {
            "number": 69,
            "text": "    for transaction in iter_transactions(data_dir):"
          },
          {
            "number": 70,
            "text": "        # 거래에서 사용 중인 카테고리는 삭제를 막는다."
          },
          {
            "number": 71,
            "text": "        if transaction.category == name:"
          },
          {
            "number": 72,
            "text": "            raise ValueError(f\"'{name}' 카테고리는 거래에서 사용 중입니다\")"
          },
          {
            "number": 73,
            "text": ""
          },
          {
            "number": 74,
            "text": "    # 삭제할 이름을 제외하고 남은 카테고리만 모은다."
          },
          {
            "number": 75,
            "text": "    remaining = [category for category in categories if category != name]"
          },
          {
            "number": 76,
            "text": "    save_categories(data_dir, remaining)"
          }
        ]
      },
      {
        "label": "CLI의 세 하위 명령",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 236,
        "end": 249,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L236",
        "lines": [
          {
            "number": 236,
            "text": "    # 카테고리 목록 명령이면 등록된 이름을 출력한다."
          },
          {
            "number": 237,
            "text": "    elif args.command == \"category\" and args.category_command == \"list\":"
          },
          {
            "number": 238,
            "text": "        for name in iter_categories(args.data_dir):"
          },
          {
            "number": 239,
            "text": "            print(name)"
          },
          {
            "number": 240,
            "text": "    # 카테고리 추가 명령이면 이름을 입력받아 저장한다."
          },
          {
            "number": 241,
            "text": "    elif args.command == \"category\" and args.category_command == \"add\":"
          },
          {
            "number": 242,
            "text": "        name = input(\"추가할 카테고리: \")"
          },
          {
            "number": 243,
            "text": "        saved_name = add_category(args.data_dir, name)"
          },
          {
            "number": 244,
            "text": "        print(f\"카테고리 '{saved_name}' 추가 완료\")"
          },
          {
            "number": 245,
            "text": "    # 카테고리 삭제 명령이면 이름을 입력받아 지운다."
          },
          {
            "number": 246,
            "text": "    elif args.command == \"category\" and args.category_command == \"remove\":"
          },
          {
            "number": 247,
            "text": "        name = input(\"삭제할 카테고리: \")"
          },
          {
            "number": 248,
            "text": "        removed_name = remove_category(args.data_dir, name)"
          },
          {
            "number": 249,
            "text": "        print(f\"카테고리 '{removed_name}' 삭제 완료\")"
          }
        ]
      }
    ]
  },
  {
    "id": "1-4",
    "title": "예산과 월별 요약",
    "what": "한 달의 예산을 저장하고, 월 지출을 예산과 비교해 사용률과 초과 여부를 보여준다.",
    "place": "services.py가 예산을 저장·계산하고 cli.py의 summary 분기가 값을 출력한다.",
    "origin": "budget set·summary는 미션 명령이다. Budget·MonthlySummary는 프로젝트의 데이터 클래스이고, 사용률 계산식은 현재 코드의 업무 규칙이다.",
    "steps": [
      "budget set에서 월과 금액을 검사해 저장한다.",
      "summary에서 월별 지출과 저장된 예산을 읽는다.",
      "지출을 예산으로 나눠 사용률을 구하고 초과 여부를 출력한다."
    ],
    "connections": "cli.py → services.py → repositories.py의 예산·거래 파일 조회로 이어진다.",
    "why": "예산 설정과 요약 계산을 분리하면 저장된 예산을 다시 실행했을 때도 요약에 활용할 수 있다.",
    "proof": "예산 저장·사용률 계산·summary 출력 코드가 연결되고 실습 로그에서 초과 경고까지 확인됐다.",
    "recall": "예산 사용률은 월 지출 ÷ 예산 × 100이고, 초과 여부는 지출과 예산을 비교한다.",
    "question": "budget set이 저장되며, summary에서 예산 사용률/초과 여부가 출력되는가?",
    "status": "통과",
    "answer": "예. budget set은 월별 금액을 저장한다. summary는 월 지출 ÷ 예산 × 100으로 사용률을 표시하고, 지출이 예산보다 크면 초과 여부와 경고를 출력한다.",
    "practice": "[예산 설정](./practice_session.log#L86) 후 [월별 요약](./practice_session.log#L90)에서 사용률 133.3%, 초과 여부와 경고를 확인했다.",
    "excerpts": [
      {
        "label": "예산 저장",
        "kind": "direct",
        "file": "budget_app/services.py",
        "start": 293,
        "end": 315,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L293",
        "lines": [
          {
            "number": 293,
            "text": "# set_budget: 월 예산을 새로 저장하거나 기존 값을 변경한다."
          },
          {
            "number": 294,
            "text": "def set_budget(data_dir: Path, month: str, amount: str) -> Budget:"
          },
          {
            "number": 295,
            "text": "    # 예산을 설정할 월 형식을 확인한다."
          },
          {
            "number": 296,
            "text": "    if not is_valid_month(month):"
          },
          {
            "number": 297,
            "text": "        raise ValueError(\"--month는 YYYY-MM 형식의 실제 월이어야 합니다\")"
          },
          {
            "number": 298,
            "text": "    # 예산 금액이 양수 정수인지 확인한다."
          },
          {
            "number": 299,
            "text": "    if not is_valid_amount(amount):"
          },
          {
            "number": 300,
            "text": "        raise ValueError(\"예산 금액은 0보다 큰 정수여야 합니다\")"
          },
          {
            "number": 301,
            "text": ""
          },
          {
            "number": 302,
            "text": "    saved = Budget(month=month, amount=int(amount))"
          },
          {
            "number": 303,
            "text": "    budgets = list(iter_budgets(data_dir))"
          },
          {
            "number": 304,
            "text": ""
          },
          {
            "number": 305,
            "text": "    for index, budget in enumerate(budgets):"
          },
          {
            "number": 306,
            "text": "        # 같은 월의 예산이 있으면 새 금액으로 교체한다."
          },
          {
            "number": 307,
            "text": "        if budget.month == month:"
          },
          {
            "number": 308,
            "text": "            budgets[index] = saved"
          },
          {
            "number": 309,
            "text": "            break"
          },
          {
            "number": 310,
            "text": "    # 같은 월의 예산을 찾지 못했으면 새 항목을 추가한다."
          },
          {
            "number": 311,
            "text": "    else:"
          },
          {
            "number": 312,
            "text": "        budgets.append(saved)"
          },
          {
            "number": 313,
            "text": ""
          },
          {
            "number": 314,
            "text": "    save_budgets(data_dir, budgets)"
          },
          {
            "number": 315,
            "text": "    return saved"
          }
        ]
      },
      {
        "label": "사용률과 초과 판단",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 327,
        "end": 332,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L327",
        "lines": [
          {
            "number": 327,
            "text": "# calculate_budget_usage: 지출 ÷ 예산 × 100으로 사용률을 구하고 지출이 예산보다 클 때만 초과로 본다."
          },
          {
            "number": 328,
            "text": "def calculate_budget_usage(summary: MonthlySummary, budget: Budget) -> tuple[float, bool]:"
          },
          {
            "number": 329,
            "text": "    # 저장된 예산이 0 이하이면 사용률을 계산하지 않는다."
          },
          {
            "number": 330,
            "text": "    if budget.amount <= 0:"
          },
          {
            "number": 331,
            "text": "        raise ValueError(\"저장된 예산 금액은 0보다 커야 합니다\")"
          },
          {
            "number": 332,
            "text": "    return summary.expense / budget.amount * 100, summary.expense > budget.amount"
          }
        ]
      },
      {
        "label": "CLI 출력",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 178,
        "end": 193,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L178",
        "lines": [
          {
            "number": 178,
            "text": "        budget = get_budget(args.data_dir, args.month)"
          },
          {
            "number": 179,
            "text": "        # 저장된 월 예산이 있을 때만 사용률을 출력한다."
          },
          {
            "number": 180,
            "text": "        if budget is not None:"
          },
          {
            "number": 181,
            "text": "            usage, exceeded = calculate_budget_usage(result, budget)"
          },
          {
            "number": 182,
            "text": "            print(f\"월 예산: {budget.amount}\")"
          },
          {
            "number": 183,
            "text": "            print(f\"예산 사용률: {usage:.1f}%\")"
          },
          {
            "number": 184,
            "text": "            # 계산된 초과 여부에 맞는 문구를 선택한다."
          },
          {
            "number": 185,
            "text": "            print(f\"초과 여부: {'초과' if exceeded else '미초과'}\")"
          },
          {
            "number": 186,
            "text": "            # 예산을 초과했으면 경고를 추가한다."
          },
          {
            "number": 187,
            "text": "            if exceeded:"
          },
          {
            "number": 188,
            "text": "                print(\"경고: 월 예산을 초과했습니다\")"
          },
          {
            "number": 189,
            "text": ""
          },
          {
            "number": 190,
            "text": "    # 예산 설정 명령이면 해당 월의 예산을 저장한다."
          },
          {
            "number": 191,
            "text": "    elif args.command == \"budget\" and args.budget_command == \"set\":"
          },
          {
            "number": 192,
            "text": "        saved = set_budget(args.data_dir, args.month, args.amount)"
          },
          {
            "number": 193,
            "text": "        print(f\"{saved.month} 예산 {saved.amount} 저장 완료\")"
          }
        ]
      }
    ]
  },
  {
    "id": "1-5",
    "title": "CSV 가져오기와 내보내기",
    "what": "내부 거래를 정해진 열의 CSV로 내보내고, 가져올 때는 헤더·열 수·거래 값을 검사한다.",
    "place": "repositories.py가 CSV 파일 형식을 읽고 쓰며 services.py가 거래 검증과 가져오기 순서를 조정한다.",
    "origin": "csv.writer·csv.DictReader는 Python 표준 라이브러리다. UTF-8과 CSV 열 이름은 미션의 고정 규칙이고, write_transactions_csv는 프로젝트 함수다.",
    "steps": [
      "내보내기는 정해진 헤더를 먼저 쓴 뒤 거래를 행별로 기록한다.",
      "가져오기는 헤더와 행의 열 수를 확인한다.",
      "서비스가 각 행을 거래 규칙으로 검증한 후 저장한다."
    ],
    "connections": "cli.py의 export/import → services.py → repositories.py의 CSV 처리 및 JSONL 저장으로 이어진다.",
    "why": "내부 JSONL과 외부 교환용 CSV를 분리해 각 형식의 쓰임을 명확히 한다.",
    "proof": "CSV_COLUMNS, UTF-8 읽기·쓰기, 헤더·행 검사 코드와 실습 로그가 근거다.",
    "recall": "헤더는 date,type,category,amount,memo,tags이고 태그 목록은 CSV 한 칸에 쉼표로 표현된다.",
    "question": "import/export가 명시된 CSV 스키마(UTF-8, 헤더, 컬럼)로 동작하는가?",
    "status": "통과",
    "answer": "예. CSV는 UTF-8로 읽고 쓰며 헤더는 date,type,category,amount,memo,tags이다. 내보내기는 이 열 순서로 기록하고, 가져오기는 헤더·열 수·거래 값을 검사한다.",
    "practice": "[CSV 내보내기](./practice_session.log#L138), [헤더·행 확인](./practice_session.log#L142), [UTF-8 확인](./practice_session.log#L148), [별도 저장 폴더로 가져오기](./practice_session.log#L152), [가져온 목록](./practice_session.log#L156)을 확인했다.",
    "excerpts": [
      {
        "label": "고정된 CSV 열",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 22,
        "end": 22,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L22",
        "lines": [
          {
            "number": 22,
            "text": "CSV_COLUMNS = (\"date\", \"type\", \"category\", \"amount\", \"memo\", \"tags\")"
          }
        ]
      },
      {
        "label": "UTF-8과 헤더 쓰기",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 146,
        "end": 162,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L146",
        "lines": [
          {
            "number": 146,
            "text": "def write_transactions_csv("
          },
          {
            "number": 147,
            "text": "    output_path: Path, transactions: Iterable[Transaction]"
          },
          {
            "number": 148,
            "text": ") -> int:"
          },
          {
            "number": 149,
            "text": "    count = 0"
          },
          {
            "number": 150,
            "text": "    with output_path.open(\"w\", encoding=\"utf-8\", newline=\"\") as csv_file:"
          },
          {
            "number": 151,
            "text": "        writer = csv.writer(csv_file)"
          },
          {
            "number": 152,
            "text": "        writer.writerow(CSV_COLUMNS)"
          },
          {
            "number": 153,
            "text": ""
          },
          {
            "number": 154,
            "text": "        for transaction in transactions:"
          },
          {
            "number": 155,
            "text": "            writer.writerow("
          },
          {
            "number": 156,
            "text": "                ["
          },
          {
            "number": 157,
            "text": "                    transaction.date,"
          },
          {
            "number": 158,
            "text": "                    transaction.type,"
          },
          {
            "number": 159,
            "text": "                    transaction.category,"
          },
          {
            "number": 160,
            "text": "                    transaction.amount,"
          },
          {
            "number": 161,
            "text": "                    transaction.memo,"
          },
          {
            "number": 162,
            "text": "                    \",\".join(transaction.tags),"
          }
        ]
      },
      {
        "label": "가져오기 헤더 검사",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 171,
        "end": 189,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L171",
        "lines": [
          {
            "number": 171,
            "text": "def iter_csv_transactions(path: Path) -> Iterator[tuple[int, dict[str, str]]]:"
          },
          {
            "number": 172,
            "text": "    with path.open(\"r\", encoding=\"utf-8\", newline=\"\") as csv_file:"
          },
          {
            "number": 173,
            "text": "        # CSV 헤더와 각 행을 읽는 동안 형식 오류를 감시한다."
          },
          {
            "number": 174,
            "text": "        try:"
          },
          {
            "number": 175,
            "text": "            reader = csv.DictReader(csv_file, strict=True)"
          },
          {
            "number": 176,
            "text": "            headers = reader.fieldnames"
          },
          {
            "number": 177,
            "text": "            # 필수 헤더가 없거나 헤더가 중복되면 CSV를 거부한다."
          },
          {
            "number": 178,
            "text": "            if ("
          },
          {
            "number": 179,
            "text": "                headers is None"
          },
          {
            "number": 180,
            "text": "                or len(headers) != len(set(headers))"
          },
          {
            "number": 181,
            "text": "                or not set(CSV_COLUMNS).issubset(headers)"
          },
          {
            "number": 182,
            "text": "            ):"
          },
          {
            "number": 183,
            "text": "                raise ValueError(\"CSV 헤더에 date,type,category,amount,memo,tags가 필요합니다\")"
          },
          {
            "number": 184,
            "text": ""
          },
          {
            "number": 185,
            "text": "            for row in reader:"
          },
          {
            "number": 186,
            "text": "                # 행의 열 개수가 맞지 않으면 오류로 처리한다."
          },
          {
            "number": 187,
            "text": "                if None in row or any(row[column] is None for column in CSV_COLUMNS):"
          },
          {
            "number": 188,
            "text": "                    raise ValueError(f\"CSV {reader.line_num}행의 열 개수가 맞지 않습니다\")"
          },
          {
            "number": 189,
            "text": "                yield reader.line_num, {column: row[column] for column in CSV_COLUMNS}"
          }
        ]
      }
    ]
  },
  {
    "id": "1-6",
    "title": "사람이 이해할 수 있는 오류",
    "what": "잘못된 입력이나 처리 대상 파일 오류가 나면 긴 스택트레이스 대신 오류 이유와 확인할 내용을 출력한다.",
    "place": "decorators.py가 cli.py의 main을 감싸고, validators.py 등에서 발견한 문제를 공통으로 받는다.",
    "origin": "try/except와 stderr는 Python 언어·표준 출력 규칙이다. handle_cli_errors는 프로젝트 함수이고, 스택트레이스 대신 안내하라는 것은 평가 기준이다.",
    "steps": [
      "main을 실행한다.",
      "검증이나 파일 처리에서 지정된 예외가 발생하면 wrapper가 잡는다.",
      "오류 메시지와 확인 힌트를 표준 오류에 쓰고 1을 돌려준다."
    ],
    "connections": "validators.py·services.py·repositories.py에서 생긴 처리 대상 오류 → decorators.py → 사용자 출력으로 이어진다.",
    "why": "명령마다 같은 오류 처리 문장을 복사하지 않고 한곳에서 사용자용 표현으로 바꾼다.",
    "proof": "공통 except 분기와 실습 로그의 오류 메시지·힌트·스택트레이스 부재가 근거다.",
    "recall": "모든 오류가 아니라 데코레이터가 지정한 예외만 이 안내 흐름으로 처리한다.",
    "question": "잘못된 입력/파일 오류에서 스택트레이스 없이 오류 메시지와 해결 힌트를 출력하는가?",
    "status": "통과",
    "answer": "예. 처리 대상인 입력값·파일 오류는 공통 데코레이터가 오류 이유와 확인 안내를 표준 오류에 출력하고 종료 코드 1을 반환한다. 실습한 오류 명령에서는 스택트레이스가 나오지 않았다.",
    "practice": "[사용 중 카테고리 삭제 오류](./practice_session.log#L112), [잘못된 목록 개수 오류](./practice_session.log#L161), [없는 CSV 파일 오류](./practice_session.log#L170)에서 원인과 해결 안내가 출력되고 스택트레이스가 없는 것을 확인했다.",
    "excerpts": [
      {
        "label": "공통 오류 안내",
        "kind": "direct",
        "file": "budget_app/decorators.py",
        "start": 14,
        "end": 40,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/decorators.py#L14",
        "lines": [
          {
            "number": 14,
            "text": "    @wraps(func)"
          },
          {
            "number": 15,
            "text": "    def wrapper() -> int:"
          },
          {
            "number": 16,
            "text": "        # 원래 CLI 함수를 실행해 종료 코드를 받는다."
          },
          {
            "number": 17,
            "text": "        try:"
          },
          {
            "number": 18,
            "text": "            return func()"
          },
          {
            "number": 19,
            "text": "        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다."
          },
          {
            "number": 20,
            "text": "        except (OSError, ValueError) as error:"
          },
          {
            "number": 21,
            "text": "            print("
          },
          {
            "number": 22,
            "text": "                f\"오류: {error}\\n입력값과 저장 경로를 확인하세요.\","
          },
          {
            "number": 23,
            "text": "                file=sys.stderr,"
          },
          {
            "number": 24,
            "text": "            )"
          },
          {
            "number": 25,
            "text": "            return 1"
          },
          {
            "number": 26,
            "text": "        # 저장 데이터 형식 오류를 안내 메시지로 바꾼다."
          },
          {
            "number": 27,
            "text": "        except (TypeError, KeyError) as error:"
          },
          {
            "number": 28,
            "text": "            print("
          },
          {
            "number": 29,
            "text": "                f\"오류: 저장 데이터 형식이 올바르지 않습니다 ({error}).\\n저장 파일 내용을 확인하세요.\","
          },
          {
            "number": 30,
            "text": "                file=sys.stderr,"
          },
          {
            "number": 31,
            "text": "            )"
          },
          {
            "number": 32,
            "text": "            return 1"
          },
          {
            "number": 33,
            "text": "        # 입력 중단을 안내 메시지로 바꾼다."
          },
          {
            "number": 34,
            "text": "        except (EOFError, KeyboardInterrupt):"
          },
          {
            "number": 35,
            "text": "            print("
          },
          {
            "number": 36,
            "text": "                \"오류: 입력이 중단되었습니다.\\n필요한 값을 입력하고 다시 실행하세요.\","
          },
          {
            "number": 37,
            "text": "                file=sys.stderr,"
          },
          {
            "number": 38,
            "text": "            )"
          },
          {
            "number": 39,
            "text": "            return 1"
          },
          {
            "number": 40,
            "text": ""
          }
        ]
      },
      {
        "label": "날짜 검증",
        "kind": "related",
        "file": "budget_app/validators.py",
        "start": 10,
        "end": 19,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/validators.py#L10",
        "lines": [
          {
            "number": 10,
            "text": "# is_valid_date: 날짜가 실제로 존재하는 YYYY-MM-DD 형식인지 확인한다."
          },
          {
            "number": 11,
            "text": "def is_valid_date(value: str) -> bool:"
          },
          {
            "number": 12,
            "text": "    # 실제 날짜인지 확인하고 아래의 재출력 비교로 입력 형식도 맞춘다."
          },
          {
            "number": 13,
            "text": "    try:"
          },
          {
            "number": 14,
            "text": "        parsed = datetime.strptime(value, \"%Y-%m-%d\")"
          },
          {
            "number": 15,
            "text": "    # 날짜로 변환할 수 없으면 유효하지 않다고 판단한다."
          },
          {
            "number": 16,
            "text": "    except ValueError:"
          },
          {
            "number": 17,
            "text": "        return False"
          },
          {
            "number": 18,
            "text": "    return parsed.strftime(\"%Y-%m-%d\") == value"
          },
          {
            "number": 19,
            "text": ""
          }
        ]
      }
    ]
  },
  {
    "id": "1-7",
    "title": "성공·실패 종료 코드",
    "what": "정상 종료와 오류 종료를 숫자로 구분해 터미널에도 작업 결과를 알린다.",
    "place": "cli.py가 결과 숫자를 반환하고 __main__.py가 이를 프로그램 종료 코드로 전달한다.",
    "origin": "SystemExit는 Python 언어 기능이고 종료 코드 0/비0 규칙은 플랫폼 관례와 평가 조건이다. main은 프로젝트 함수다.",
    "steps": [
      "정상 작업이면 main이 0을 반환한다.",
      "처리된 오류면 wrapper가 1을 반환한다.",
      "SystemExit가 그 값을 프로세스 종료 코드로 사용한다."
    ],
    "connections": "decorators.py의 wrapper → cli.py의 main 호출 → __main__.py의 SystemExit로 이어진다.",
    "why": "사람뿐 아니라 명령을 실행한 터미널·스크립트도 성공과 실패를 구분할 수 있다.",
    "proof": "반환값과 SystemExit 연결 코드에 더해, 실습 로그의 오류 직후 종료 코드 1 확인이 근거다.",
    "recall": "화면의 오류 문구와 종료 코드는 서로 다른 결과이며 둘 다 확인할 수 있다.",
    "question": "오류 상황에서 종료 코드가 0이 아님을 확인할 수 있는가?",
    "status": "통과",
    "answer": "예. 정상 실행은 0, 처리된 오류는 1을 반환하고 __main__.py가 이를 프로세스 종료 코드로 사용한다. 오류 명령 뒤 echo $?가 1인 것을 실습 로그로 확인했다.",
    "practice": "[카테고리 삭제 오류 뒤 종료 코드 1](./practice_session.log#L118), [잘못된 목록 개수 오류 뒤 종료 코드 1](./practice_session.log#L166)을 확인했다.",
    "excerpts": [
      {
        "label": "종료 코드 전달",
        "kind": "direct",
        "file": "budget_app/__main__.py",
        "start": 6,
        "end": 8,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/__main__.py#L6",
        "lines": [
          {
            "number": 6,
            "text": "# 직접 실행할 때 main의 종료 코드를 프로그램 종료 코드로 사용한다."
          },
          {
            "number": 7,
            "text": "if __name__ == \"__main__\":"
          },
          {
            "number": 8,
            "text": "    raise SystemExit(main())"
          }
        ]
      },
      {
        "label": "오류에서 1 반환",
        "kind": "related",
        "file": "budget_app/decorators.py",
        "start": 18,
        "end": 25,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/decorators.py#L18",
        "lines": [
          {
            "number": 18,
            "text": "            return func()"
          },
          {
            "number": 19,
            "text": "        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다."
          },
          {
            "number": 20,
            "text": "        except (OSError, ValueError) as error:"
          },
          {
            "number": 21,
            "text": "            print("
          },
          {
            "number": 22,
            "text": "                f\"오류: {error}\\n입력값과 저장 경로를 확인하세요.\","
          },
          {
            "number": 23,
            "text": "                file=sys.stderr,"
          },
          {
            "number": 24,
            "text": "            )"
          },
          {
            "number": 25,
            "text": "            return 1"
          }
        ]
      },
      {
        "label": "정상에서 0 반환",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 250,
        "end": 251,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L250",
        "lines": [
          {
            "number": 250,
            "text": ""
          },
          {
            "number": 251,
            "text": "    return 0"
          }
        ]
      }
    ]
  },
  {
    "id": "2-1",
    "title": "모듈별 책임",
    "what": "한 파일에 모든 일을 넣지 않고 시작, 명령 해석, 업무 처리, 검증, 저장, 데이터 모양, 오류 처리를 나눴다.",
    "place": "budget_app 패키지의 각 .py 파일이 이 역할을 맡는다.",
    "origin": "모듈·import는 Python 개념이다. 3개 이상 모듈 분리는 평가 조건이고, cli.py·services.py 등의 파일명과 역할 배치는 프로젝트에서 정했다.",
    "steps": [
      "__main__.py가 CLI를 시작한다.",
      "cli.py가 입력을 해석해 services.py로 보낸다.",
      "서비스가 모델·검증·저장소를 사용하고 CLI가 결과를 출력한다."
    ],
    "connections": "시작점 → CLI → 서비스 → 검증·모델·저장소 → 파일. decorators.py는 CLI main을 감싼다.",
    "why": "각 파일의 책임이 분명하면 오류를 찾거나 기능을 수정할 때 관련 위치를 좁힐 수 있다.",
    "proof": "실제 7개 Python 모듈과 이들 사이의 import·호출 코드가 분리 근거다. 역할 설명은 평가 때 직접 말해야 한다.",
    "recall": "models.py는 데이터 모양, validators.py는 값 규칙, services.py는 작업 순서, repositories.py는 파일을 담당한다.",
    "question": "코드가 3개 이상 모듈로 분리되어 있고, 각 모듈의 책임을 \"어떻게\" 나눴는지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "budget_app은 시작점(__main__.py), 명령·입출력(cli.py), 업무 규칙(services.py), 값 검사(validators.py), 데이터 구조(models.py), 파일 저장(repositories.py), 공통 오류 처리(decorators.py)로 책임을 나눴다. add 실행 흐름은 아래에 정리했다.",
    "practice": "",
    "excerpts": [
      {
        "label": "프로그램 시작",
        "kind": "direct",
        "file": "budget_app/__main__.py",
        "start": 3,
        "end": 8,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/__main__.py#L3",
        "lines": [
          {
            "number": 3,
            "text": "# main: 명령줄 입력을 처리하는 시작 함수를 가져온다."
          },
          {
            "number": 4,
            "text": "from .cli import main"
          },
          {
            "number": 5,
            "text": ""
          },
          {
            "number": 6,
            "text": "# 직접 실행할 때 main의 종료 코드를 프로그램 종료 코드로 사용한다."
          },
          {
            "number": 7,
            "text": "if __name__ == \"__main__\":"
          },
          {
            "number": 8,
            "text": "    raise SystemExit(main())"
          }
        ]
      },
      {
        "label": "CLI의 요청 전달",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 99,
        "end": 104,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L99",
        "lines": [
          {
            "number": 99,
            "text": "# main: 명령을 해석하고 저장 파일을 준비한 뒤 해당 기능을 실행해 결과를 출력한다."
          },
          {
            "number": 100,
            "text": "@handle_cli_errors"
          },
          {
            "number": 101,
            "text": "def main() -> int:"
          },
          {
            "number": 102,
            "text": "    parser = build_parser()"
          },
          {
            "number": 103,
            "text": "    args = parser.parse_args()"
          },
          {
            "number": 104,
            "text": "    initialize_storage(args.data_dir)"
          }
        ]
      },
      {
        "label": "서비스의 거래 추가",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 118,
        "end": 132,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L118",
        "lines": [
          {
            "number": 118,
            "text": "# add_transaction: 새 거래를 만들어 저장한다."
          },
          {
            "number": 119,
            "text": "def add_transaction("
          },
          {
            "number": 120,
            "text": "    data_dir: Path,"
          },
          {
            "number": 121,
            "text": "    date: str,"
          },
          {
            "number": 122,
            "text": "    transaction_type: str,"
          },
          {
            "number": 123,
            "text": "    category: str,"
          },
          {
            "number": 124,
            "text": "    amount: str,"
          },
          {
            "number": 125,
            "text": "    memo: str = \"\","
          },
          {
            "number": 126,
            "text": "    tags: list[str] | None = None,"
          },
          {
            "number": 127,
            "text": ") -> Transaction:"
          },
          {
            "number": 128,
            "text": "    transaction = make_transaction("
          },
          {
            "number": 129,
            "text": "        data_dir, date, transaction_type, category, amount, memo, tags"
          },
          {
            "number": 130,
            "text": "    )"
          },
          {
            "number": 131,
            "text": "    append_transaction(data_dir, transaction)"
          },
          {
            "number": 132,
            "text": "    return transaction"
          }
        ]
      },
      {
        "label": "저장소의 파일 쓰기",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 57,
        "end": 61,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L57",
        "lines": [
          {
            "number": 57,
            "text": "# append_transaction: 새 거래를 저장 파일 끝에 추가한다."
          },
          {
            "number": 58,
            "text": "def append_transaction(data_dir: Path, transaction: Transaction) -> None:"
          },
          {
            "number": 59,
            "text": "    with (data_dir / TRANSACTIONS_FILE).open(\"a\", encoding=\"utf-8\") as transaction_file:"
          },
          {
            "number": 60,
            "text": "        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)"
          },
          {
            "number": 61,
            "text": "        transaction_file.write(\"\\n\")"
          }
        ]
      }
    ]
  },
  {
    "id": "2-2",
    "title": "클래스의 책임 경계",
    "what": "Transaction은 거래 한 건, Budget은 월 예산, MonthlySummary는 계산된 월별 결과에 필요한 값들을 담는다.",
    "place": "세 데이터 클래스는 models.py에 있고, 판단·계산·저장은 다른 모듈에서 한다.",
    "origin": "@dataclass는 Python 표준 라이브러리다. Transaction·Budget·MonthlySummary는 프로젝트가 정한 클래스 이름이고, 최소 2개 클래스는 평가 조건이다.",
    "steps": [
      "models.py가 각 객체의 필드와 예상 타입을 정의한다.",
      "서비스가 필요한 객체를 만들거나 계산 결과를 담는다.",
      "저장 대상은 저장소로, 화면에 보여줄 요약은 CLI로 전달한다."
    ],
    "connections": "services.py가 models.py의 클래스를 사용하며, repositories.py는 저장 대상 모델을 파일 값으로 바꾼다.",
    "why": "서로 다른 데이터의 모양을 섞지 않고, 모델에 입력 검증·파일 쓰기 책임을 떠넘기지 않는다.",
    "proof": "세 클래스의 필드가 서로 다른 대상과 목적을 표현한다. 책임 경계를 설명하는 것은 사용자가 평가 때 확인받는다.",
    "recall": "@dataclass 자체는 타입 힌트가 아니고, amount: int 같은 필드 표기가 타입 힌트다.",
    "question": "최소 2개 이상의 클래스에 부여한 책임 경계를 \"어떻게\" 정했는지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "클래스들을 models.py에 둔 이유는 거래·예산·요약 결과의 데이터 모양을 한곳에서 정의하기 위해서다. Transaction은 거래 한 건, Budget은 한 달의 예산, MonthlySummary는 계산된 월별 결과를 담는다. models.py는 \"어떤 값들로 이루어지는가\"를 정의하고, 거래를 추가할지 판단하고 계산하는 일은 services.py, 입력값 검사는 validators.py, 파일 저장은 repositories.py에 맡겼다.",
    "practice": "",
    "excerpts": [
      {
        "label": "거래 데이터",
        "kind": "direct",
        "file": "budget_app/models.py",
        "start": 8,
        "end": 16,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/models.py#L8",
        "lines": [
          {
            "number": 8,
            "text": "@dataclass"
          },
          {
            "number": 9,
            "text": "class Transaction:"
          },
          {
            "number": 10,
            "text": "    id: str"
          },
          {
            "number": 11,
            "text": "    type: str"
          },
          {
            "number": 12,
            "text": "    date: str"
          },
          {
            "number": 13,
            "text": "    amount: int"
          },
          {
            "number": 14,
            "text": "    category: str"
          },
          {
            "number": 15,
            "text": "    memo: str = \"\""
          },
          {
            "number": 16,
            "text": "    tags: list[str] = field(default_factory=list)"
          }
        ]
      },
      {
        "label": "예산과 요약 결과",
        "kind": "related",
        "file": "budget_app/models.py",
        "start": 19,
        "end": 34,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/models.py#L19",
        "lines": [
          {
            "number": 19,
            "text": "# Budget: 특정 월의 예산을 담는다."
          },
          {
            "number": 20,
            "text": "@dataclass"
          },
          {
            "number": 21,
            "text": "class Budget:"
          },
          {
            "number": 22,
            "text": "    month: str"
          },
          {
            "number": 23,
            "text": "    amount: int"
          },
          {
            "number": 24,
            "text": ""
          },
          {
            "number": 25,
            "text": ""
          },
          {
            "number": 26,
            "text": "# MonthlySummary: 파일에 저장하지 않는 월별 수입·지출·잔액과 상위 카테고리 계산 결과를 담는다."
          },
          {
            "number": 27,
            "text": "@dataclass"
          },
          {
            "number": 28,
            "text": "class MonthlySummary:"
          },
          {
            "number": 29,
            "text": "    month: str"
          },
          {
            "number": 30,
            "text": "    income: int"
          },
          {
            "number": 31,
            "text": "    expense: int"
          },
          {
            "number": 32,
            "text": "    balance: int"
          },
          {
            "number": 33,
            "text": "    top_categories: list[tuple[str, int]]"
          },
          {
            "number": 34,
            "text": "    transaction_count: int"
          }
        ]
      }
    ]
  },
  {
    "id": "2-3",
    "title": "파일 기반 수정·삭제",
    "what": "ID로 대상 거래를 찾아 한 건만 바꾸거나 제외하고, 나머지 거래와 함께 전체 파일을 다시 쓴다.",
    "place": "services.py가 찾기·검증·변경을 담당하고 repositories.py의 save_transactions가 파일을 다시 쓴다.",
    "origin": "list·enumerate는 Python 기본 기능이다. update/delete는 미션 명령이고, save_transactions는 프로젝트 함수다.",
    "steps": [
      "입력값을 먼저 검사한다.",
      "거래 전체를 읽어 요청한 ID를 찾는다.",
      "대상을 수정·제외한 목록을 저장한다. ID가 없으면 저장하지 않는다."
    ],
    "connections": "CLI의 update/delete → services.py → repositories.py → transactions.jsonl로 이어진다.",
    "why": "ID를 확인한 뒤 나머지 거래를 보존하며 저장하려는 방식이다. 다만 파일을 직접 덮어써 쓰기 중단에 대한 원자성은 없다.",
    "proof": "ID 탐색·변경·재저장 코드가 현재 처리 방식을 보여준다. '완전한 롤백'이라고 주장하지 않는다.",
    "recall": "대상 찾기와 쓰기 중단 안전성은 다른 문제다. 현재 구현은 후자를 보장하지 않는다.",
    "question": "파일 기반 update/delete를 \"어떻게\" 안전하게 처리했는지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "수정·삭제 전에 거래 전체를 읽어 ID를 찾고, 입력값을 검증한 뒤 대상만 바꿔 전체를 다시 저장한다. ID가 없으면 저장하지 않는다. 다만 파일을 직접 덮어써서 쓰기 중 중단에 대한 원자성은 보장하지 않는다.",
    "practice": "",
    "excerpts": [
      {
        "label": "수정 후 저장",
        "kind": "direct",
        "file": "budget_app/services.py",
        "start": 214,
        "end": 230,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L214",
        "lines": [
          {
            "number": 214,
            "text": "    transactions = list(iter_transactions(data_dir))"
          },
          {
            "number": 215,
            "text": "    for index, current in enumerate(transactions):"
          },
          {
            "number": 216,
            "text": "        # ID가 일치하는 거래를 찾으면 선택한 필드만 수정한다."
          },
          {
            "number": 217,
            "text": "        if current.id == transaction_id:"
          },
          {
            "number": 218,
            "text": "            # 수정 옵션이 없는 필드는 원래 값을 유지한다."
          },
          {
            "number": 219,
            "text": "            updated = replace("
          },
          {
            "number": 220,
            "text": "                current,"
          },
          {
            "number": 221,
            "text": "                date=current.date if date is None else date,"
          },
          {
            "number": 222,
            "text": "                type=current.type if transaction_type is None else transaction_type,"
          },
          {
            "number": 223,
            "text": "                category=current.category if category is None else category,"
          },
          {
            "number": 224,
            "text": "                amount=current.amount if amount is None else int(amount),"
          },
          {
            "number": 225,
            "text": "                memo=current.memo if memo is None else memo,"
          },
          {
            "number": 226,
            "text": "                tags=current.tags if tags is None else tags,"
          },
          {
            "number": 227,
            "text": "            )"
          },
          {
            "number": 228,
            "text": "            transactions[index] = updated"
          },
          {
            "number": 229,
            "text": "            save_transactions(data_dir, transactions)"
          },
          {
            "number": 230,
            "text": "            return updated"
          }
        ]
      },
      {
        "label": "삭제 후 저장",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 235,
        "end": 246,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L235",
        "lines": [
          {
            "number": 235,
            "text": "# delete_transaction: 전체 거래를 읽어 지정한 ID를 삭제한 뒤 다시 저장한다."
          },
          {
            "number": 236,
            "text": "def delete_transaction(data_dir: Path, transaction_id: str) -> str:"
          },
          {
            "number": 237,
            "text": "    transactions = list(iter_transactions(data_dir))"
          },
          {
            "number": 238,
            "text": ""
          },
          {
            "number": 239,
            "text": "    for index, transaction in enumerate(transactions):"
          },
          {
            "number": 240,
            "text": "        # ID가 일치하는 거래를 찾으면 삭제한다."
          },
          {
            "number": 241,
            "text": "        if transaction.id == transaction_id:"
          },
          {
            "number": 242,
            "text": "            del transactions[index]"
          },
          {
            "number": 243,
            "text": "            save_transactions(data_dir, transactions)"
          },
          {
            "number": 244,
            "text": "            return transaction_id"
          },
          {
            "number": 245,
            "text": ""
          },
          {
            "number": 246,
            "text": "    raise ValueError(f\"거래 id '{transaction_id}'에 해당하는 데이터가 없습니다\")"
          }
        ]
      },
      {
        "label": "파일 전체 재작성",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 64,
        "end": 71,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L64",
        "lines": [
          {
            "number": 64,
            "text": "# save_transactions: 거래 전체를 w 모드로 다시 쓰며, 쓰기 중 중단되면 원본 보존은 보장되지 않는다."
          },
          {
            "number": 65,
            "text": "def save_transactions(data_dir: Path, transactions: list[Transaction]) -> None:"
          },
          {
            "number": 66,
            "text": "    lines = ["
          },
          {
            "number": 67,
            "text": "        json.dumps(asdict(transaction), ensure_ascii=False) + \"\\n\""
          },
          {
            "number": 68,
            "text": "        for transaction in transactions"
          },
          {
            "number": 69,
            "text": "    ]"
          },
          {
            "number": 70,
            "text": "    with (data_dir / TRANSACTIONS_FILE).open(\"w\", encoding=\"utf-8\") as transaction_file:"
          },
          {
            "number": 71,
            "text": "        transaction_file.writelines(lines)"
          }
        ]
      }
    ]
  },
  {
    "id": "3-1",
    "title": "한 건씩 읽는 조회",
    "what": "파일에서 거래를 한 건씩 읽고, list는 요청한 개수만, search는 조건에 맞는 거래만 전달한다.",
    "place": "repositories.py가 읽기를 시작하고 services.py가 검색 조건을 적용하며 cli.py가 결과를 출력한다.",
    "origin": "yield·for·Iterator는 Python 언어와 타입 표기다. iter_transactions_latest·search_transactions는 프로젝트 함수이며 제너레이터 사용은 미션 조건이다.",
    "steps": [
      "iter_jsonl이 파일 한 줄을 읽어 넘긴다.",
      "최신순 조회가 후보 한 건을 찾고 yield한다.",
      "search는 조건에 맞지 않으면 continue, 맞으면 yield한다."
    ],
    "connections": "repositories.py의 JSONL 읽기·최신순 조회 → services.py의 검색 → cli.py의 list/search 출력으로 이어진다.",
    "why": "거래 전체를 한 번에 목록으로 만들지 않아 메모리를 아낀다. 다만 현재 최신순 함수는 결과 한 건마다 파일을 다시 훑는다.",
    "proof": "yield와 islice·continue 사용이 스트리밍 처리의 근거다. 메모리 이점과 반복 스캔 비용을 함께 설명해야 한다.",
    "recall": "yield는 하나씩 전달하는 문법이다. 메모리 절약은 함수가 전체 거래를 저장하지 않는 구조에서 나온다.",
    "question": "list/search를 제너레이터로 스트리밍 처리한 방식을 \"어떻게\" 구현했고, \"왜\" 유리한지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "JSONL을 한 줄씩 yield로 읽고, 최신순 거래를 하나씩 찾아 list는 필요한 건수만, search는 조건에 맞는 거래만 소비한다. 전체를 한꺼번에 메모리에 올리지 않는 장점이 있지만 최신순 조회는 파일을 반복해서 읽는다.",
    "practice": "",
    "excerpts": [
      {
        "label": "한 줄씩 읽기",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 44,
        "end": 54,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L44",
        "lines": [
          {
            "number": 44,
            "text": "# iter_jsonl: yield로 JSONL을 한 줄씩 변환해 파일 전체를 메모리에 올리지 않는다."
          },
          {
            "number": 45,
            "text": "def iter_jsonl(path: Path) -> Iterator[dict[str, object]]:"
          },
          {
            "number": 46,
            "text": "    with path.open(\"r\", encoding=\"utf-8\") as data_file:"
          },
          {
            "number": 47,
            "text": "        for line in data_file:"
          },
          {
            "number": 48,
            "text": "            yield json.loads(line)"
          },
          {
            "number": 49,
            "text": ""
          },
          {
            "number": 50,
            "text": ""
          },
          {
            "number": 51,
            "text": "# iter_transactions: 저장된 거래를 한 건씩 읽는다."
          },
          {
            "number": 52,
            "text": "def iter_transactions(data_dir: Path) -> Iterator[Transaction]:"
          },
          {
            "number": 53,
            "text": "    for record in iter_jsonl(data_dir / TRANSACTIONS_FILE):"
          },
          {
            "number": 54,
            "text": "        yield Transaction(**record)"
          }
        ]
      },
      {
        "label": "최신 거래를 한 건씩 찾기",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 120,
        "end": 142,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L120",
        "lines": [
          {
            "number": 120,
            "text": "# iter_transactions_latest: 메모리를 아끼며 최신순으로 읽되, 결과 한 건마다 파일을 다시 훑는다."
          },
          {
            "number": 121,
            "text": "def iter_transactions_latest(data_dir: Path) -> Iterator[Transaction]:"
          },
          {
            "number": 122,
            "text": "    before: tuple[str, str] | None = None"
          },
          {
            "number": 123,
            "text": ""
          },
          {
            "number": 124,
            "text": "    while True:"
          },
          {
            "number": 125,
            "text": "        latest: Transaction | None = None"
          },
          {
            "number": 126,
            "text": ""
          },
          {
            "number": 127,
            "text": "        for transaction in iter_transactions(data_dir):"
          },
          {
            "number": 128,
            "text": "            key = transaction_sort_key(transaction)"
          },
          {
            "number": 129,
            "text": ""
          },
          {
            "number": 130,
            "text": "            # 이미 내보낸 거래보다 최신이거나 같으면 건너뛴다."
          },
          {
            "number": 131,
            "text": "            if before is not None and key >= before:"
          },
          {
            "number": 132,
            "text": "                continue"
          },
          {
            "number": 133,
            "text": "            # 아직 후보가 없거나 더 최신 거래를 찾으면 후보를 바꾼다."
          },
          {
            "number": 134,
            "text": "            if latest is None or key > transaction_sort_key(latest):"
          },
          {
            "number": 135,
            "text": "                latest = transaction"
          },
          {
            "number": 136,
            "text": ""
          },
          {
            "number": 137,
            "text": "        # 다음으로 내보낼 거래가 없으면 조회를 종료한다."
          },
          {
            "number": 138,
            "text": "        if latest is None:"
          },
          {
            "number": 139,
            "text": "            return"
          },
          {
            "number": 140,
            "text": ""
          },
          {
            "number": 141,
            "text": "        yield latest"
          },
          {
            "number": 142,
            "text": "        before = transaction_sort_key(latest)"
          }
        ]
      },
      {
        "label": "검색 조건과 yield",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 159,
        "end": 178,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L159",
        "lines": [
          {
            "number": 159,
            "text": "    for transaction in iter_transactions_latest(data_dir):"
          },
          {
            "number": 160,
            "text": "        # 시작일보다 이른 거래는 검색 결과에서 제외한다."
          },
          {
            "number": 161,
            "text": "        if date_from is not None and transaction.date < date_from:"
          },
          {
            "number": 162,
            "text": "            continue"
          },
          {
            "number": 163,
            "text": "        # 종료일보다 늦은 거래는 검색 결과에서 제외한다."
          },
          {
            "number": 164,
            "text": "        if date_to is not None and transaction.date > date_to:"
          },
          {
            "number": 165,
            "text": "            continue"
          },
          {
            "number": 166,
            "text": "        # 카테고리 조건에 맞지 않는 거래는 제외한다."
          },
          {
            "number": 167,
            "text": "        if category is not None and transaction.category != category:"
          },
          {
            "number": 168,
            "text": "            continue"
          },
          {
            "number": 169,
            "text": "        # 타입 조건에 맞지 않는 거래는 제외한다."
          },
          {
            "number": 170,
            "text": "        if transaction_type is not None and transaction.type != transaction_type:"
          },
          {
            "number": 171,
            "text": "            continue"
          },
          {
            "number": 172,
            "text": "        # 메모에 검색어가 없는 거래는 제외한다."
          },
          {
            "number": 173,
            "text": "        if query is not None and query not in transaction.memo:"
          },
          {
            "number": 174,
            "text": "            continue"
          },
          {
            "number": 175,
            "text": "        # 요청한 태그가 없는 거래는 제외한다."
          },
          {
            "number": 176,
            "text": "        if tag is not None and tag not in transaction.tags:"
          },
          {
            "number": 177,
            "text": "            continue"
          },
          {
            "number": 178,
            "text": "        yield transaction"
          }
        ]
      },
      {
        "label": "목록 개수 제한",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 128,
        "end": 140,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L128",
        "lines": [
          {
            "number": 128,
            "text": "    # 목록 명령이면 최신 거래를 지정한 개수만 출력한다."
          },
          {
            "number": 129,
            "text": "    elif args.command == \"list\":"
          },
          {
            "number": 130,
            "text": "        # 목록 개수가 0 이하이면 잘못된 옵션으로 처리한다."
          },
          {
            "number": 131,
            "text": "        if args.limit <= 0:"
          },
          {
            "number": 132,
            "text": "            raise ValueError(\"--limit은 1 이상의 정수여야 합니다\")"
          },
          {
            "number": 133,
            "text": ""
          },
          {
            "number": 134,
            "text": "        for transaction in islice(iter_transactions_latest(args.data_dir), args.limit):"
          },
          {
            "number": 135,
            "text": "            print("
          },
          {
            "number": 136,
            "text": "                f\"{transaction.date} | {transaction.type} | \""
          },
          {
            "number": 137,
            "text": "                f\"{transaction.category} | {transaction.amount} | \""
          },
          {
            "number": 138,
            "text": "                f\"id: {transaction.id} | 메모: {transaction.memo} | \""
          },
          {
            "number": 139,
            "text": "                f\"태그: {', '.join(transaction.tags)}\""
          },
          {
            "number": 140,
            "text": "            )"
          }
        ]
      }
    ]
  },
  {
    "id": "3-2",
    "title": "공통 오류 데코레이터",
    "what": "main을 감싸 여러 명령에서 생길 수 있는 처리 대상 오류를 같은 방식으로 안내한다.",
    "place": "decorators.py에 공통 처리 함수를 두고 cli.py의 main 위에 적용했다.",
    "origin": "@ 데코레이터 문법과 try/except는 Python 언어다. wraps는 functools 표준 라이브러리이고, handle_cli_errors는 프로젝트가 지은 이름이다.",
    "steps": [
      "@handle_cli_errors가 원래 main을 func로 받는다.",
      "이름 main이 반환된 wrapper를 가리킨다.",
      "호출 시 wrapper가 func()로 원래 main을 실행하고 지정한 오류를 처리한다."
    ],
    "connections": "cli.py의 @handle_cli_errors → decorators.py의 wrapper → 원래 cli.py main으로 이어진다.",
    "why": "모든 명령 분기에 같은 try/except를 반복하지 않고 오류 안내를 한곳에서 관리한다.",
    "proof": "데코레이터 정의와 main 위 적용 코드가 공통 기능이 실제 연결됐음을 보여준다.",
    "recall": "@wraps(func)는 함수 정보를 유지하고, 원래 main을 실행하는 곳은 wrapper 안의 func()다.",
    "question": "데코레이터로 분리한 공통 기능이 무엇이며, \"왜\" 분리가 필요했는지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "handle_cli_errors 데코레이터가 main을 감싸 여러 명령의 입력값·파일·저장 형식 오류를 한곳에서 처리한다. 명령마다 같은 try/except와 안내 문구를 반복하지 않기 위해 분리했다.",
    "practice": "",
    "excerpts": [
      {
        "label": "함수를 감싸고 실행",
        "kind": "direct",
        "file": "budget_app/decorators.py",
        "start": 11,
        "end": 25,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/decorators.py#L11",
        "lines": [
          {
            "number": 11,
            "text": "# handle_cli_errors: CLI 오류를 스택트레이스 대신 안내 메시지로 처리한다."
          },
          {
            "number": 12,
            "text": "def handle_cli_errors(func: Callable[[], int]) -> Callable[[], int]:"
          },
          {
            "number": 13,
            "text": "    # wrapper: 원래 함수를 실행하고 오류가 나면 메시지와 종료 코드를 돌려준다."
          },
          {
            "number": 14,
            "text": "    @wraps(func)"
          },
          {
            "number": 15,
            "text": "    def wrapper() -> int:"
          },
          {
            "number": 16,
            "text": "        # 원래 CLI 함수를 실행해 종료 코드를 받는다."
          },
          {
            "number": 17,
            "text": "        try:"
          },
          {
            "number": 18,
            "text": "            return func()"
          },
          {
            "number": 19,
            "text": "        # 입력값이나 파일 작업 오류를 안내 메시지로 바꾼다."
          },
          {
            "number": 20,
            "text": "        except (OSError, ValueError) as error:"
          },
          {
            "number": 21,
            "text": "            print("
          },
          {
            "number": 22,
            "text": "                f\"오류: {error}\\n입력값과 저장 경로를 확인하세요.\","
          },
          {
            "number": 23,
            "text": "                file=sys.stderr,"
          },
          {
            "number": 24,
            "text": "            )"
          },
          {
            "number": 25,
            "text": "            return 1"
          }
        ]
      },
      {
        "label": "CLI main에 적용",
        "kind": "related",
        "file": "budget_app/cli.py",
        "start": 99,
        "end": 104,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/cli.py#L99",
        "lines": [
          {
            "number": 99,
            "text": "# main: 명령을 해석하고 저장 파일을 준비한 뒤 해당 기능을 실행해 결과를 출력한다."
          },
          {
            "number": 100,
            "text": "@handle_cli_errors"
          },
          {
            "number": 101,
            "text": "def main() -> int:"
          },
          {
            "number": 102,
            "text": "    parser = build_parser()"
          },
          {
            "number": 103,
            "text": "    args = parser.parse_args()"
          },
          {
            "number": 104,
            "text": "    initialize_storage(args.data_dir)"
          }
        ]
      }
    ]
  },
  {
    "id": "3-3",
    "title": "타입 힌트 읽기",
    "what": "필드에는 어떤 값이 들어가고 함수는 무엇을 돌려주는지 코드 옆에 표시한다.",
    "place": "models.py의 필드와 repositories.py·services.py의 함수 입력·반환값에 적용돼 있다.",
    "origin": ": 및 -> 타입 표기는 Python 언어다. Transaction·search_transactions는 프로젝트 이름이고, Iterator는 표준 라이브러리의 타입이다.",
    "steps": [
      "amount: int에서 금액의 예상 타입을 읽는다.",
      "str | None에서 검색 조건이 문자열이거나 생략될 수 있음을 읽는다.",
      "-> Iterator[Transaction]에서 거래를 하나씩 꺼낼 결과임을 읽는다."
    ],
    "connections": "services.py가 반환한 Transaction 객체의 필드 모양은 models.py에서 정의한다.",
    "why": "사람과 타입 검사 도구가 값의 예상 모양을 이해하기 쉽다. 실행 중 값을 자동 검증하는 기능은 아니다.",
    "proof": "실제 필드·함수 시그니처에 타입 힌트가 있고, 그 이점을 구체적 예로 설명할 수 있어야 한다.",
    "recall": "@dataclass는 타입 힌트가 아니며 amount: int와 함수 뒤 -> 표기가 타입 힌트다.",
    "question": "타입 힌트를 적용해 얻는 이점을 실제 코드 예로 \"어떻게\" 확인했고 \"왜\" 도움이 되는지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "예를 들어 Transaction.amount: int는 금액의 예상 타입을, search_transactions(...) -> Iterator[Transaction]은 거래를 순차적으로 반환함을 보여준다. 타입 힌트는 코드 이해와 도구의 오류 탐지에 도움이 되지만 실행 시 값을 자동 검증하지는 않는다.",
    "practice": "",
    "excerpts": [
      {
        "label": "필드 타입",
        "kind": "direct",
        "file": "budget_app/models.py",
        "start": 8,
        "end": 16,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/models.py#L8",
        "lines": [
          {
            "number": 8,
            "text": "@dataclass"
          },
          {
            "number": 9,
            "text": "class Transaction:"
          },
          {
            "number": 10,
            "text": "    id: str"
          },
          {
            "number": 11,
            "text": "    type: str"
          },
          {
            "number": 12,
            "text": "    date: str"
          },
          {
            "number": 13,
            "text": "    amount: int"
          },
          {
            "number": 14,
            "text": "    category: str"
          },
          {
            "number": 15,
            "text": "    memo: str = \"\""
          },
          {
            "number": 16,
            "text": "    tags: list[str] = field(default_factory=list)"
          }
        ]
      },
      {
        "label": "함수 반환 타입",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 135,
        "end": 145,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L135",
        "lines": [
          {
            "number": 135,
            "text": "# search_transactions: 조건에 맞는 거래를 최신순으로 찾는다."
          },
          {
            "number": 136,
            "text": "def search_transactions("
          },
          {
            "number": 137,
            "text": "    data_dir: Path,"
          },
          {
            "number": 138,
            "text": "    *,"
          },
          {
            "number": 139,
            "text": "    date_from: str | None = None,"
          },
          {
            "number": 140,
            "text": "    date_to: str | None = None,"
          },
          {
            "number": 141,
            "text": "    category: str | None = None,"
          },
          {
            "number": 142,
            "text": "    transaction_type: str | None = None,"
          },
          {
            "number": 143,
            "text": "    query: str | None = None,"
          },
          {
            "number": 144,
            "text": "    tag: str | None = None,"
          },
          {
            "number": 145,
            "text": ") -> Iterator[Transaction]:"
          }
        ]
      },
      {
        "label": "저장소 반환 타입",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 44,
        "end": 48,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L44",
        "lines": [
          {
            "number": 44,
            "text": "# iter_jsonl: yield로 JSONL을 한 줄씩 변환해 파일 전체를 메모리에 올리지 않는다."
          },
          {
            "number": 45,
            "text": "def iter_jsonl(path: Path) -> Iterator[dict[str, object]]:"
          },
          {
            "number": 46,
            "text": "    with path.open(\"r\", encoding=\"utf-8\") as data_file:"
          },
          {
            "number": 47,
            "text": "        for line in data_file:"
          },
          {
            "number": 48,
            "text": "            yield json.loads(line)"
          }
        ]
      }
    ]
  },
  {
    "id": "4-1",
    "title": "JSONL과 CSV의 쓰임",
    "what": "프로그램 안에서는 거래·카테고리·예산을 JSONL로 보관하고, 다른 곳과 주고받을 때 CSV를 사용한다.",
    "place": "repositories.py가 내부 .jsonl 파일과 외부 CSV 형식을 모두 읽고 쓴다.",
    "origin": "json·csv는 Python 표준 라이브러리다. JSONL 내부 저장은 구현에서 선택했고, CSV 스키마는 미션의 교환 규칙이다.",
    "steps": [
      "거래를 저장하면 JSON 객체 한 건을 한 줄로 기록한다.",
      "내보내기에서는 정해진 헤더와 열의 CSV로 바꾼다.",
      "가져오기에서는 CSV를 읽고 검증해 내부 거래로 만든다."
    ],
    "connections": "repositories.py의 JSONL 읽기·쓰기와 CSV 읽기·쓰기를 services.py의 import/export가 연결한다.",
    "why": "JSONL은 태그 목록을 그대로 표현하고 뒤에 거래를 추가하기 쉽다. CSV는 열 형태로 교환하기 쉽지만 목록 태그를 한 칸에 변환해야 한다.",
    "proof": "실제 세 .jsonl 파일명과 json.dump·csv.writer 코드가 두 형식의 역할을 보여준다. 수정·삭제는 JSONL 전체 재작성 비용이 있다.",
    "recall": "두 형식을 모두 쓰지만 평가의 '선택한 저장 포맷'은 내부 보관용 JSONL을 가리킨다.",
    "question": "JSONL과 CSV 중 선택한 저장 포맷의 장단점을 비교하고, \"왜\" 그 포맷을 택했는지 근거를 말할 수 있는가?",
    "status": "확인 필요",
    "answer": "내부 저장에는 JSONL을 사용한다. 거래를 한 줄씩 추가·읽고 태그 목록을 그대로 표현하기 쉽다. CSV는 정해진 열로 외부 교환하기 좋지만 목록형 값을 별도로 표현해야 한다. JSONL도 최신순 탐색과 수정·삭제에는 반복 읽기·전체 재작성 비용이 있다.",
    "practice": "",
    "excerpts": [
      {
        "label": "내부 파일과 CSV 열",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 18,
        "end": 22,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L18",
        "lines": [
          {
            "number": 18,
            "text": "DEFAULT_DATA_DIR = Path(\"data\")"
          },
          {
            "number": 19,
            "text": "TRANSACTIONS_FILE = \"transactions.jsonl\""
          },
          {
            "number": 20,
            "text": "CATEGORIES_FILE = \"categories.jsonl\""
          },
          {
            "number": 21,
            "text": "BUDGETS_FILE = \"budgets.jsonl\""
          },
          {
            "number": 22,
            "text": "CSV_COLUMNS = (\"date\", \"type\", \"category\", \"amount\", \"memo\", \"tags\")"
          }
        ]
      },
      {
        "label": "JSONL 한 줄 추가",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 57,
        "end": 61,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L57",
        "lines": [
          {
            "number": 57,
            "text": "# append_transaction: 새 거래를 저장 파일 끝에 추가한다."
          },
          {
            "number": 58,
            "text": "def append_transaction(data_dir: Path, transaction: Transaction) -> None:"
          },
          {
            "number": 59,
            "text": "    with (data_dir / TRANSACTIONS_FILE).open(\"a\", encoding=\"utf-8\") as transaction_file:"
          },
          {
            "number": 60,
            "text": "        json.dump(asdict(transaction), transaction_file, ensure_ascii=False)"
          },
          {
            "number": 61,
            "text": "        transaction_file.write(\"\\n\")"
          }
        ]
      },
      {
        "label": "CSV 헤더와 태그 변환",
        "kind": "related",
        "file": "budget_app/repositories.py",
        "start": 149,
        "end": 162,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L149",
        "lines": [
          {
            "number": 149,
            "text": "    count = 0"
          },
          {
            "number": 150,
            "text": "    with output_path.open(\"w\", encoding=\"utf-8\", newline=\"\") as csv_file:"
          },
          {
            "number": 151,
            "text": "        writer = csv.writer(csv_file)"
          },
          {
            "number": 152,
            "text": "        writer.writerow(CSV_COLUMNS)"
          },
          {
            "number": 153,
            "text": ""
          },
          {
            "number": 154,
            "text": "        for transaction in transactions:"
          },
          {
            "number": 155,
            "text": "            writer.writerow("
          },
          {
            "number": 156,
            "text": "                ["
          },
          {
            "number": 157,
            "text": "                    transaction.date,"
          },
          {
            "number": 158,
            "text": "                    transaction.type,"
          },
          {
            "number": 159,
            "text": "                    transaction.category,"
          },
          {
            "number": 160,
            "text": "                    transaction.amount,"
          },
          {
            "number": 161,
            "text": "                    transaction.memo,"
          },
          {
            "number": 162,
            "text": "                    \",\".join(transaction.tags),"
          }
        ]
      }
    ]
  },
  {
    "id": "4-2",
    "title": "10만 건에서 느려지는 곳",
    "what": "병목은 거래가 많아질 때 읽는 시간이나 메모리를 크게 쓰는 코드다. 현재 최신순 조회는 결과마다 파일을 재탐색하고, 수정·가져오기는 거래 전체를 list()에 담는다.",
    "place": "repositories.py의 최신순 조회와 services.py의 수정·가져오기 처리에 나타난다.",
    "origin": "list()는 Python 기본 함수다. iter_transactions_latest는 프로젝트 함수이고, 10만 건 상황은 평가 문항의 가정이다.",
    "steps": [
      "최신순 함수는 파일 전체에서 가장 최신 1건을 찾는다.",
      "다음 결과가 필요하면 파일을 처음부터 다시 훑는다.",
      "수정·가져오기는 list(...)로 읽은 전체 거래를 메모리에 올린다."
    ],
    "connections": "list/search는 최신순 조회를 사용하고, update/import는 저장소의 거래 반복자를 list()로 모두 수집한다.",
    "why": "현재 방식은 작은 데이터에서 이해하기 쉽고 최신순 조회의 메모리를 아끼지만, 데이터가 많아지면 반복 파일 읽기와 전체 수집이 부담이다.",
    "proof": "while 안의 전체 for와 list(iter_transactions(...))가 병목의 직접 근거다. 인덱스·정렬된 저장·부분 갱신 가능한 저장소는 향후 개선안이며 현재 구현은 아니다.",
    "recall": "yield는 메모리를 줄일 수 있지만 반복해서 파일을 읽는 시간까지 없애지는 않는다.",
    "question": "거래가 10만 건으로 늘어난다면, 현재 구조에서 병목이 어디이며 \"어떻게\" 개선할지 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "10만 건에서는 최신순 조회가 결과 한 건마다 파일을 다시 훑는 부분과 수정·삭제·가져오기에서 거래 전체를 메모리에 올리는 부분이 병목이다. 향후 날짜·ID 인덱스나 정렬된 저장 구조로 조회를 줄이고, 부분 갱신이 가능한 저장소로 전환할 수 있다.",
    "practice": "",
    "excerpts": [
      {
        "label": "결과마다 전체 탐색",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 120,
        "end": 142,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L120",
        "lines": [
          {
            "number": 120,
            "text": "# iter_transactions_latest: 메모리를 아끼며 최신순으로 읽되, 결과 한 건마다 파일을 다시 훑는다."
          },
          {
            "number": 121,
            "text": "def iter_transactions_latest(data_dir: Path) -> Iterator[Transaction]:"
          },
          {
            "number": 122,
            "text": "    before: tuple[str, str] | None = None"
          },
          {
            "number": 123,
            "text": ""
          },
          {
            "number": 124,
            "text": "    while True:"
          },
          {
            "number": 125,
            "text": "        latest: Transaction | None = None"
          },
          {
            "number": 126,
            "text": ""
          },
          {
            "number": 127,
            "text": "        for transaction in iter_transactions(data_dir):"
          },
          {
            "number": 128,
            "text": "            key = transaction_sort_key(transaction)"
          },
          {
            "number": 129,
            "text": ""
          },
          {
            "number": 130,
            "text": "            # 이미 내보낸 거래보다 최신이거나 같으면 건너뛴다."
          },
          {
            "number": 131,
            "text": "            if before is not None and key >= before:"
          },
          {
            "number": 132,
            "text": "                continue"
          },
          {
            "number": 133,
            "text": "            # 아직 후보가 없거나 더 최신 거래를 찾으면 후보를 바꾼다."
          },
          {
            "number": 134,
            "text": "            if latest is None or key > transaction_sort_key(latest):"
          },
          {
            "number": 135,
            "text": "                latest = transaction"
          },
          {
            "number": 136,
            "text": ""
          },
          {
            "number": 137,
            "text": "        # 다음으로 내보낼 거래가 없으면 조회를 종료한다."
          },
          {
            "number": 138,
            "text": "        if latest is None:"
          },
          {
            "number": 139,
            "text": "            return"
          },
          {
            "number": 140,
            "text": ""
          },
          {
            "number": 141,
            "text": "        yield latest"
          },
          {
            "number": 142,
            "text": "        before = transaction_sort_key(latest)"
          }
        ]
      },
      {
        "label": "수정 시 전체 수집",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 214,
        "end": 215,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L214",
        "lines": [
          {
            "number": 214,
            "text": "    transactions = list(iter_transactions(data_dir))"
          },
          {
            "number": 215,
            "text": "    for index, current in enumerate(transactions):"
          }
        ]
      },
      {
        "label": "가져오기 시 전체 수집",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 383,
        "end": 386,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L383",
        "lines": [
          {
            "number": 383,
            "text": "def import_transactions(data_dir: Path, csv_path: Path) -> int:"
          },
          {
            "number": 384,
            "text": "    existing = list(iter_transactions(data_dir))"
          },
          {
            "number": 385,
            "text": "    used_ids = {transaction.id for transaction in existing}"
          },
          {
            "number": 386,
            "text": "    imported: list[Transaction] = []"
          }
        ]
      }
    ]
  },
  {
    "id": "4-3",
    "title": "깨진 CSV 행 처리",
    "what": "CSV의 한 행이 잘못되면 행 번호와 이유를 알리고, 그 파일의 정상 행도 포함해 아무 거래도 저장하지 않는다.",
    "place": "repositories.py가 CSV 형식과 열을 확인하고 services.py가 모든 행을 거래 규칙으로 검증한 뒤 저장한다.",
    "origin": "csv.DictReader는 Python 표준 라이브러리다. import 명령과 CSV 스키마는 미션 규칙이고, '부분 성공/롤백/리포트'는 평가 문항의 설명 관점이다.",
    "steps": [
      "헤더와 각 행의 열 수를 확인한다.",
      "각 행을 거래로 만들며 값의 유효성을 검사하고 임시 목록에 모은다.",
      "전부 통과했을 때만 저장한다. 잘못된 행이 있으면 번호를 붙여 오류를 낸다."
    ],
    "connections": "CSV 파일 → repositories.py의 행 읽기 → services.py의 make_transaction → 저장소의 JSONL 저장으로 이어진다.",
    "why": "정상 행 일부만 들어가면 사용자가 저장 결과를 오해할 수 있어 검증 중에는 부분 성공을 허용하지 않는다.",
    "proof": "행 번호를 붙이는 예외와 모든 검증을 마친 뒤에만 save_transactions를 호출하는 코드가 근거다. 실제 파일 쓰기 중단에 대한 롤백은 보장하지 않는다.",
    "recall": "검증 중 오류에는 저장 전 중단이 적용된다. 이미 저장한 것을 되돌리는 롤백과는 다르다.",
    "question": "import CSV에 일부 깨진 행이 섞이면, \"어떻게\" 처리해 사용자 신뢰를 지킬지 (부분 성공/롤백/리포트) 설명할 수 있는가?",
    "status": "확인 필요",
    "answer": "현재 정책은 부분 성공 없이 일괄 실패다. CSV의 모든 행을 검증해 임시 목록에 모은 뒤에만 저장하고, 깨진 행에는 행 번호와 오류를 알린다. 따라서 검증 중 오류가 나면 앞의 정상 행도 저장되지 않는다. 다만 실제 파일 쓰기는 원자적 교체가 아니다.",
    "practice": "",
    "excerpts": [
      {
        "label": "CSV 형식 검사와 행 번호",
        "kind": "direct",
        "file": "budget_app/repositories.py",
        "start": 171,
        "end": 189,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/repositories.py#L171",
        "lines": [
          {
            "number": 171,
            "text": "def iter_csv_transactions(path: Path) -> Iterator[tuple[int, dict[str, str]]]:"
          },
          {
            "number": 172,
            "text": "    with path.open(\"r\", encoding=\"utf-8\", newline=\"\") as csv_file:"
          },
          {
            "number": 173,
            "text": "        # CSV 헤더와 각 행을 읽는 동안 형식 오류를 감시한다."
          },
          {
            "number": 174,
            "text": "        try:"
          },
          {
            "number": 175,
            "text": "            reader = csv.DictReader(csv_file, strict=True)"
          },
          {
            "number": 176,
            "text": "            headers = reader.fieldnames"
          },
          {
            "number": 177,
            "text": "            # 필수 헤더가 없거나 헤더가 중복되면 CSV를 거부한다."
          },
          {
            "number": 178,
            "text": "            if ("
          },
          {
            "number": 179,
            "text": "                headers is None"
          },
          {
            "number": 180,
            "text": "                or len(headers) != len(set(headers))"
          },
          {
            "number": 181,
            "text": "                or not set(CSV_COLUMNS).issubset(headers)"
          },
          {
            "number": 182,
            "text": "            ):"
          },
          {
            "number": 183,
            "text": "                raise ValueError(\"CSV 헤더에 date,type,category,amount,memo,tags가 필요합니다\")"
          },
          {
            "number": 184,
            "text": ""
          },
          {
            "number": 185,
            "text": "            for row in reader:"
          },
          {
            "number": 186,
            "text": "                # 행의 열 개수가 맞지 않으면 오류로 처리한다."
          },
          {
            "number": 187,
            "text": "                if None in row or any(row[column] is None for column in CSV_COLUMNS):"
          },
          {
            "number": 188,
            "text": "                    raise ValueError(f\"CSV {reader.line_num}행의 열 개수가 맞지 않습니다\")"
          },
          {
            "number": 189,
            "text": "                yield reader.line_num, {column: row[column] for column in CSV_COLUMNS}"
          }
        ]
      },
      {
        "label": "행 검증 후 저장",
        "kind": "related",
        "file": "budget_app/services.py",
        "start": 388,
        "end": 413,
        "url": "https://github.com/duswls98952/Codyssey_B2-1/blob/main/budget_app/services.py#L388",
        "lines": [
          {
            "number": 388,
            "text": "    for line_number, row in iter_csv_transactions(csv_path):"
          },
          {
            "number": 389,
            "text": "        # 쉼표로 나눈 태그에서 빈 항목을 제외한다."
          },
          {
            "number": 390,
            "text": "        tags = [tag.strip() for tag in row[\"tags\"].split(\",\") if tag.strip()]"
          },
          {
            "number": 391,
            "text": "        # CSV 한 행을 기존 거래 검증 규칙으로 검사하고 객체로 만든다."
          },
          {
            "number": 392,
            "text": "        try:"
          },
          {
            "number": 393,
            "text": "            transaction = make_transaction("
          },
          {
            "number": 394,
            "text": "                data_dir,"
          },
          {
            "number": 395,
            "text": "                date=row[\"date\"],"
          },
          {
            "number": 396,
            "text": "                transaction_type=row[\"type\"],"
          },
          {
            "number": 397,
            "text": "                category=row[\"category\"],"
          },
          {
            "number": 398,
            "text": "                amount=row[\"amount\"],"
          },
          {
            "number": 399,
            "text": "                memo=row[\"memo\"],"
          },
          {
            "number": 400,
            "text": "                tags=tags,"
          },
          {
            "number": 401,
            "text": "            )"
          },
          {
            "number": 402,
            "text": "        # 오류에 CSV 행 번호를 붙여 문제 위치를 알린다."
          },
          {
            "number": 403,
            "text": "        except ValueError as error:"
          },
          {
            "number": 404,
            "text": "            raise ValueError(f\"CSV {line_number}행: {error}\") from error"
          },
          {
            "number": 405,
            "text": ""
          },
          {
            "number": 406,
            "text": "        while transaction.id in used_ids:"
          },
          {
            "number": 407,
            "text": "            transaction = replace(transaction, id=uuid4().hex)"
          },
          {
            "number": 408,
            "text": "        used_ids.add(transaction.id)"
          },
          {
            "number": 409,
            "text": "        imported.append(transaction)"
          },
          {
            "number": 410,
            "text": ""
          },
          {
            "number": 411,
            "text": "    # 가져온 거래가 있을 때만 파일에 한 번에 저장한다."
          },
          {
            "number": 412,
            "text": "    if imported:"
          },
          {
            "number": 413,
            "text": "        save_transactions(data_dir, existing + imported)"
          }
        ]
      }
    ]
  }
];
