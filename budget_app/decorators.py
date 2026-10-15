# 여러 명령에서 공통으로 쓰는 오류 처리 데코레이터를 정의한다.

# sys: 오류 메시지를 표준 오류 출력으로 보낸다.
import sys
# Callable: 감싸는 함수의 타입을 표시한다.
from collections.abc import Callable
# wraps: 데코레이터를 적용해도 원래 함수의 정보를 유지한다.
from functools import wraps


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
