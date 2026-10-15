# 거래, 예산, 월별 요약의 데이터 구조를 정의한다.

# dataclass와 field: 데이터 클래스와 목록 필드의 기본값을 정의한다.
from dataclasses import dataclass, field


# Transaction: 거래 한 건의 필드를 담는다.
@dataclass
class Transaction:
    id: str
    type: str
    date: str
    amount: int
    category: str
    memo: str = ""
    tags: list[str] = field(default_factory=list)


# Budget: 특정 월의 예산을 담는다.
@dataclass
class Budget:
    month: str
    amount: int


# MonthlySummary: 한 달의 수입·지출·잔액과 지출 상위 카테고리를 담는다.
@dataclass
class MonthlySummary:
    month: str
    income: int
    expense: int
    balance: int
    top_categories: list[tuple[str, int]]
    transaction_count: int
