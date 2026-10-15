# B2-1 나만의 용돈 기입장

Python 3.10 이상에서 표준 라이브러리만으로 실행하는 명령줄 프로그램입니다. 프로젝트 루트에서 다음 명령을 실행하세요.

macOS 등에서 `python` 명령이 없다면 아래 예시의 `python`을 `python3`로 바꿔 실행하세요.

## 실행 방법

```bash
python -m budget_app --help
python -m budget_app add
```

`add`는 날짜, 타입(`income` 또는 `expense`), 카테고리, 금액, 메모, 태그를 순서대로 묻습니다. 메모와 태그는 비워 둘 수 있습니다. `category add`와 `category remove`도 실행 후 카테고리 이름을 입력합니다. 각 명령의 옵션은 `python -m budget_app <명령> --help`로 확인할 수 있습니다.

저장 폴더를 바꾸려면 `--data-dir`을 **명령 앞에** 지정합니다.

```bash
python -m budget_app --data-dir ./my_data list --limit 10
```

## 주요 명령 예시

```bash
python -m budget_app category list
python -m budget_app category add
python -m budget_app add
python -m budget_app list --limit 10
python -m budget_app search --from 2026-10-01 --to 2026-10-31 --category food
python -m budget_app summary --month 2026-10 --top 3
python -m budget_app budget set --month 2026-10 --amount 100000
python -m budget_app update --id 거래ID --amount 12000
python -m budget_app delete --id 거래ID
python -m budget_app category remove
python -m budget_app export --out october.csv --month 2026-10
python -m budget_app import --from october.csv
```

`거래ID`에는 `add` 또는 `list`에서 표시된 실제 ID를 넣습니다. 거래 수정은 `update --id`와 변경할 필드의 **옵션**을 함께 지정하는 방식입니다. 수정 가능한 필드는 `--date`, `--type`, `--category`, `--amount`, `--memo`, `--tags`입니다. 사용 중인 카테고리는 삭제할 수 없습니다.

## 저장 파일 위치와 형식

기본 저장 폴더는 프로젝트 루트에서 실행할 때의 `./data`입니다. 첫 실행 시 폴더와 다음 파일이 자동으로 만들어지며, 종료 후에도 데이터가 유지됩니다.

| 파일 | 내용 |
| --- | --- |
| `data/transactions.jsonl` | 거래 내역 |
| `data/categories.jsonl` | 등록된 카테고리 |
| `data/budgets.jsonl` | 월별 예산 |

세 파일 모두 JSONL 형식이며 한 줄에 데이터 한 건을 저장합니다. 카테고리 파일이 처음 비어 있으면 `food`, `transport`, `rent`, `etc`가 등록됩니다. `--data-dir`을 사용하면 위 파일들은 지정한 폴더에 저장됩니다.

## CSV 가져오기·내보내기

CSV는 UTF-8이며 첫 줄에 다음 헤더가 있어야 합니다.

```csv
date,type,category,amount,memo,tags
```

| 열 | 필수 | 내용 |
| --- | --- | --- |
| `date` | 예 | 날짜 (`YYYY-MM-DD`) |
| `type` | 예 | `income` 또는 `expense` |
| `category` | 예 | 등록된 카테고리 |
| `amount` | 예 | 0보다 큰 정수 |
| `memo` | 아니요 | 문자열 |
| `tags` | 아니요 | 쉼표로 구분한 태그 문자열 |

내보내기에는 월(`--month YYYY-MM`) 또는 기간(`--from YYYY-MM-DD --to YYYY-MM-DD`) 조건이 필요합니다. 가져오기는 `--from`으로 CSV 파일을 지정합니다. 두 명령 모두 처리한 건수를 출력합니다.

```bash
python -m budget_app export --out october.csv --from 2026-10-01 --to 2026-10-31
python -m budget_app import --from october.csv
```
