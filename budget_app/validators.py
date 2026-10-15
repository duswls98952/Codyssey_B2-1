# 사용자가 입력한 날짜, 타입, 금액, 카테고리를 검사한다.

# datetime: 날짜와 월이 실제로 존재하는지 확인한다.
from datetime import datetime


ALLOWED_TRANSACTION_TYPES = {"income", "expense"}


# is_valid_date: 날짜가 실제로 존재하는 YYYY-MM-DD 형식인지 확인한다.
def is_valid_date(value: str) -> bool:
    # 입력 문자열을 실제 날짜로 변환해 본다.
    try:
        parsed = datetime.strptime(value, "%Y-%m-%d")
    # 날짜로 변환할 수 없으면 유효하지 않다고 판단한다.
    except ValueError:
        return False
    return parsed.strftime("%Y-%m-%d") == value


# is_valid_month: 월이 YYYY-MM 형식인지 확인한다.
def is_valid_month(value: str) -> bool:
    # 입력 문자열을 월로 변환해 본다.
    try:
        parsed = datetime.strptime(value, "%Y-%m")
    # 월로 변환할 수 없으면 유효하지 않다고 판단한다.
    except ValueError:
        return False
    return parsed.strftime("%Y-%m") == value


# is_valid_transaction_type: 거래 타입이 income 또는 expense인지 확인한다.
def is_valid_transaction_type(value: str) -> bool:
    return value in ALLOWED_TRANSACTION_TYPES


# is_valid_amount: 금액이 0보다 큰 정수인지 확인한다.
def is_valid_amount(value: str) -> bool:
    # 금액 문자열을 정수로 변환해 본다.
    try:
        amount = int(value)
    # 정수로 바꿀 수 없으면 유효하지 않다고 판단한다.
    except ValueError:
        return False
    return amount > 0


# is_valid_category: 카테고리가 등록된 목록에 있는지 확인한다.
def is_valid_category(value: str, registered_categories: set[str]) -> bool:
    return value in registered_categories
