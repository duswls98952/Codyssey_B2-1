from datetime import datetime


ALLOWED_TRANSACTION_TYPES = {"income", "expense"}


def is_valid_date(value: str) -> bool:
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return False
    return parsed.strftime("%Y-%m-%d") == value


def is_valid_transaction_type(value: str) -> bool:
    return value in ALLOWED_TRANSACTION_TYPES


def is_valid_amount(value: str) -> bool:
    try:
        amount = int(value)
    except ValueError:
        return False
    return amount > 0


def is_valid_category(value: str, registered_categories: set[str]) -> bool:
    return value in registered_categories