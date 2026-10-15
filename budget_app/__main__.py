# python -m budget_app 실행 시 프로그램을 시작한다.

# main: 명령줄 입력을 처리하는 시작 함수를 가져온다.
from .cli import main

# 직접 실행할 때 main의 종료 코드를 프로그램 종료 코드로 사용한다.
if __name__ == "__main__":
    raise SystemExit(main())
