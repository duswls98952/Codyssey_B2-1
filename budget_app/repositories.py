import json
from pathlib import Path


DEFAULT_DATA_DIR = Path("data")
TRANSACTIONS_FILE = "transactions.jsonl"
CATEGORIES_FILE = "categories.jsonl"
BUDGETS_FILE = "budgets.jsonl"
DEFAULT_CATEGORIES: tuple[str, ...] = ("food", "transport", "rent", "etc")


def initialize_storage(data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)

    for filename in (TRANSACTIONS_FILE, CATEGORIES_FILE, BUDGETS_FILE):
        (data_dir / filename).touch(exist_ok=True)

    categories_path = data_dir / CATEGORIES_FILE
    if categories_path.stat().st_size == 0:
        with categories_path.open("w", encoding="utf-8") as category_file:
            for category in DEFAULT_CATEGORIES:
                json.dump(
                    {"name": category}, category_file, ensure_ascii=False
                )
                category_file.write("\n")