// 평가 문항·코드 발췌는 content.js가 현재 자료에서 생성한 값이다.
const cards = window.REVIEW_CARDS || [];
const cardElement = document.getElementById("evaluation-card");
const jumpElement = document.getElementById("card-jump");
const previousButton = document.getElementById("previous-card");
const nextButton = document.getElementById("next-card");
const groupNames = {"1": "기능", "2": "구조와 책임", "3": "언어 기능", "4": "설계 선택"};
const repoBlobBase = "https://github.com/duswls98952/Codyssey_B2-1/blob/main";
let activeIndex = 0;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function displayFilePath(file) {
  return `/${file.replace(/^budget_app\//, "")}`;
}

function codePanel(excerpt) {
  const lines = excerpt.lines.map((line) =>
    `<span class="code-line"><span class="line-number" aria-hidden="true">${line.number}</span><span class="line-text">${escapeHtml(line.text) || " "}</span></span>`
  ).join("");
  return `<figure class="code-panel ${excerpt.kind === "direct" ? "is-direct" : ""}">
    <figcaption><span class="code-kind">${excerpt.kind === "direct" ? "직접 근거" : "연결 코드"}</span><strong>${escapeHtml(excerpt.label)}</strong>
      <a href="${escapeHtml(excerpt.url)}" title="원본 코드 파일 열기">${escapeHtml(displayFilePath(excerpt.file))}:${excerpt.start}${excerpt.end !== excerpt.start ? `–${excerpt.end}` : ""} ↗</a></figcaption>
    <pre tabindex="0" aria-label="${escapeHtml(excerpt.file)} ${excerpt.start}행부터 ${excerpt.end}행까지"><code>${lines}</code></pre>
  </figure>`;
}

function practiceLinks(markdown) {
  if (!markdown) return "";
  const links = [...markdown.matchAll(/\[([^\]]+)\]\(\.\/practice_session\.log#L(\d+)\)/g)];
  if (!links.length) return "";
  return `<div class="practice-links"><h4>실습 기록</h4><p>${links.map((match) =>
    `<a href="${repoBlobBase}/evaluation/practice_session.log#L${match[2]}">${escapeHtml(match[1])} ↗</a>`
  ).join("")}</p></div>`;
}

const noteStorageKey = "b2-1-review-notes-v1";
const noteFormat = "b2-1-review-notes";
const notes = new Map();
let storageError = "";

const initialExplanations = {
  "1-1": [
    "argparse에 add, list, search, summary 명령을 등록합니다. list의 --limit과 search의 검색 조건도 여기서 정의하며, 실제 작업은 main의 명령별 분기에서 실행합니다.",
    "update는 선택한 변경 옵션을 update_transaction에 전달합니다. 태그 문자열은 쉼표로 나누고, delete는 ID를 delete_transaction에 전달한 뒤 결과를 출력합니다.",
    "export는 출력 경로와 조회 조건을 서비스에 넘겨 CSV 파일을 만듭니다. import는 입력 CSV 경로를 전달해 거래를 가져오고 처리 건수를 출력합니다."
  ],
  "1-2": [
    "거래·카테고리·예산 파일명을 각각 정하고, initialize_storage가 저장 폴더와 파일을 준비합니다. 메모리의 변수와 달리 이 파일들은 프로그램이 끝나도 남습니다.",
    "CLI가 명령과 --data-dir을 해석한 직후 initialize_storage를 호출합니다. 따라서 명령을 처리하기 전에 필요한 저장 파일을 준비합니다.",
    "거래 객체를 asdict로 딕셔너리로 바꾼 뒤 JSON으로 기록합니다. a 모드로 파일 끝에 추가하고 줄바꿈을 붙여, 거래 한 건을 JSONL 한 줄로 보관합니다."
  ],
  "1-3": [
    "삭제할 카테고리가 비어 있거나 등록되지 않았다면 오류를 냅니다. 거래에서 사용 중인 이름도 삭제를 막고, 사용할 수 있는 경우에만 해당 이름을 제외한 목록을 다시 저장합니다.",
    "category의 list, add, remove 하위 명령을 구분합니다. 목록은 저장소에서 읽어 출력하고, 추가·삭제는 이름을 입력받아 서비스 함수를 호출합니다."
  ],
  "1-4": [
    "월과 예산 금액을 검증한 뒤 같은 월의 기존 예산을 바꾸거나 새 예산을 추가합니다. 변경한 예산 목록은 저장소를 통해 파일에 기록합니다.",
    "월 지출을 예산으로 나누고 100을 곱해 사용률을 구합니다. 지출이 예산보다 클 때 초과로 판단하며, 예산이 0 이하인 경우에는 계산을 거부합니다.",
    "해당 월의 예산이 있을 때 사용률과 초과 여부를 출력합니다. 예산을 초과했다면 경고 문구도 덧붙여 사용자에게 알립니다."
  ],
  "1-5": [
    "CSV_COLUMNS가 date, type, category, amount, memo, tags 열을 정의합니다. 내보내기와 가져오기가 같은 스키마를 기준으로 데이터를 주고받습니다.",
    "UTF-8로 출력 파일을 열고 헤더를 기록한 뒤 거래 값을 한 행씩 씁니다. 태그 목록은 쉼표로 합쳐 하나의 CSV 필드에 담습니다.",
    "DictReader로 헤더와 행을 읽으며 필수 헤더 누락, 중복 헤더, 열 개수 오류를 검사합니다. 잘못된 CSV를 거래 데이터로 넘기기 전에 형식 문제를 찾는 부분입니다."
  ],
  "1-6": [
    "wrapper가 원래 CLI 함수를 실행하고 지정한 예외를 처리합니다. 입력·파일·저장 형식 오류나 입력 중단을 안내 메시지로 바꾸고 실패 종료 코드를 반환합니다.",
    "문자열을 실제 날짜로 바꾸고 다시 YYYY-MM-DD 형식으로 출력해 원래 입력과 비교합니다. 존재하지 않는 날짜와 형식이 다른 값을 거부합니다."
  ],
  "1-7": [
    "__main__.py가 main의 반환값을 SystemExit에 전달합니다. 이 값이 프로세스 종료 코드가 되어 터미널에서도 성공·실패를 확인할 수 있습니다.",
    "입력값이나 파일 작업 오류를 잡으면 안내 메시지를 표준 오류에 출력하고 1을 반환합니다. 데코레이터가 원래 함수의 정상 결과와 오류 결과를 구분하는 부분입니다.",
    "정상 처리를 마친 main은 0을 반환합니다. 오류에서 반환하는 1과 구분해 호출한 터미널이나 다른 프로그램이 결과를 판단할 수 있습니다."
  ],
  "2-1": [
    "패키지 실행의 시작점입니다. CLI의 main을 가져와 실행하고 반환값을 종료 코드로 전달합니다.",
    "main은 명령과 옵션을 해석하고 저장 파일을 준비합니다. CLI가 사용자 입력과 작업 요청을 맡는다는 책임을 보여주는 부분입니다.",
    "서비스의 add_transaction은 거래 생성과 파일 저장을 연결합니다. 입력·출력 세부 처리와 파일 쓰기 구현을 각각 CLI와 저장소에 맡깁니다.",
    "저장소는 전달받은 거래를 JSONL 형식으로 파일에 추가합니다. 거래의 업무 규칙보다 파일 열기, 변환, 기록에 집중합니다."
  ],
  "2-2": [
    "Transaction은 거래 한 건의 ID, 타입, 날짜, 금액, 카테고리, 메모와 태그를 담습니다. dataclass는 데이터 객체 작성을 돕고, 필드 타입 표기는 예상 값의 형태를 알려줍니다.",
    "Budget은 특정 월의 예산을 담고, MonthlySummary는 수입·지출·잔액 등 계산 결과를 담습니다. 두 클래스는 서로 다른 데이터의 책임을 가지며 월별 요약 자체를 저장 파일에 기록하지는 않습니다."
  ],
  "2-3": [
    "ID가 같은 거래를 찾아 지정된 필드만 바꿉니다. 수정 후 전체 목록을 다시 저장하며, 수정 옵션을 주지 않은 필드는 기존 값을 유지합니다.",
    "전체 거래를 읽어 해당 ID를 찾으면 삭제하고 남은 목록을 저장합니다. 존재하지 않는 ID는 오류로 처리해 성공으로 안내하지 않습니다.",
    "w 모드로 파일을 열어 전체 거래를 다시 기록합니다. 파일을 직접 덮어쓰므로 기록 도중 중단되면 이전 파일 보존이나 원자적 교체를 보장하지 않습니다."
  ],
  "3-1": [
    "iter_jsonl은 파일을 한 줄씩 읽어 JSON을 해석하고 yield합니다. iter_transactions는 그 값을 Transaction 객체로 바꾸어 전달하므로 전체 거래 목록을 한꺼번에 만들지 않습니다.",
    "아직 내보내지 않은 거래 중 가장 최신 거래를 찾아 한 건씩 반환합니다. 메모리는 적게 쓰지만 결과 한 건을 찾을 때마다 파일을 다시 훑는 비용이 있습니다.",
    "날짜·카테고리 등 검색 조건에 맞지 않는 거래는 continue로 건너뜁니다. 조건을 만족한 거래만 yield하여 호출자가 차례로 소비하게 합니다.",
    "--limit이 양수인지 검사한 뒤 islice로 최신 거래 중 필요한 개수만 소비합니다. 거래를 읽는 제너레이터와 화면에 출력하는 CLI가 연결되는 부분입니다."
  ],
  "3-2": [
    "handle_cli_errors는 원래 함수를 실행하는 wrapper를 만들어 반환합니다. wraps는 원래 함수 정보를 유지하고, try/except는 여러 명령의 공통 오류 안내를 담당합니다.",
    "@handle_cli_errors를 main에 적용해 실제 CLI 실행을 감쌉니다. 각 명령에 오류 처리 코드를 반복해서 넣지 않고 공통 안내로 연결합니다."
  ],
  "3-3": [
    "amount: int, memo: str, tags: list[str]처럼 각 필드의 예상 타입을 적습니다. 타입 힌트는 코드 이해와 도구의 검사를 돕지만 실행 중 값을 자동 검증하지는 않습니다.",
    "함수 입력 매개변수와 Iterator[Transaction] 반환 타입을 표시합니다. 검색 결과가 거래 객체를 차례로 제공한다는 계약을 호출하는 쪽에 알려줍니다.",
    "Iterator[dict[str, object]]는 JSONL을 읽으며 딕셔너리를 순서대로 제공한다는 뜻입니다. 실제 순차 전달은 함수 안의 yield가 수행합니다."
  ],
  "4-1": [
    "내부 보관 파일은 세 종류의 JSONL로 나누고, 외부 교환을 위한 CSV 열도 별도로 정의합니다. 두 형식을 서로 다른 목적으로 사용하는 구조입니다.",
    "JSONL은 거래를 한 줄씩 덧붙이고 읽기 쉽고 태그 목록도 표현할 수 있습니다. 이 코드는 기존 파일 끝에 새 거래 한 건을 추가하는 사례입니다.",
    "CSV는 헤더에 맞춰 값을 행으로 내보냅니다. 목록인 tags는 쉼표로 합쳐 한 칸에 담으므로, JSONL과 달리 목록 값을 별도로 변환해야 합니다."
  ],
  "4-2": [
    "최신 거래 한 건을 찾는 동안 파일 전체를 훑고, 다음 거래를 찾을 때 다시 읽습니다. 결과가 많아지면 반복 탐색이 늘어나며 yield만으로 이 시간 비용까지 없어지지는 않습니다.",
    "수정할 거래를 찾기 전에 전체 거래를 list로 수집합니다. 거래가 많을수록 이 목록이 차지하는 메모리와 이후 전체 재작성 비용이 커집니다.",
    "CSV를 가져올 때도 기존 거래를 전체 목록으로 읽습니다. 입력 거래가 늘면 기존 데이터와 임시 거래 목록을 함께 다루는 비용을 검토해야 합니다."
  ],
  "4-3": [
    "CSV의 헤더와 각 행의 열 개수를 검사합니다. 행 번호를 함께 사용해 문제가 있는 위치를 알릴 수 있도록 합니다.",
    "각 행을 거래로 만들며 검증하고 임시 목록에 모읍니다. 검증 오류에는 행 번호를 붙이고, 모든 행의 검증이 끝난 뒤에 저장합니다. 실제 파일 쓰기 중단까지 되돌리는 롤백은 아닙니다."
  ]
};

function noteId(card, excerpt) {
  return `${card.id}:${excerpt.file}:${excerpt.start}-${excerpt.end}`;
}

const noteSpecs = new Map(cards.flatMap((card) => card.excerpts.map((excerpt, index) => [
  noteId(card, excerpt), {card, excerpt, index}
])));

function defaultNote(spec) {
  return initialExplanations[spec.card.id]?.[spec.index] || spec.excerpt.label;
}

function noteText(id) {
  return notes.has(id) ? notes.get(id).text : defaultNote(noteSpecs.get(id));
}

function validateNotes(data) {
  if (!data || data.format !== noteFormat || data.version !== 1 || !Array.isArray(data.notes) || data.notes.length > 1000) {
    throw new Error("이 페이지에서 내보낸 메모 JSON 파일을 선택해 주세요.");
  }
  const ids = new Set();
  return data.notes.map((entry) => {
    if (!entry || typeof entry.id !== "string" || typeof entry.text !== "string" || entry.text.length > 100000 || ids.has(entry.id)) {
      throw new Error("메모 파일의 내용이나 항목 형식이 올바르지 않습니다.");
    }
    ids.add(entry.id);
    return {id: entry.id, text: entry.text, updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : ""};
  });
}

function notesPayload() {
  return {
    format: noteFormat, version: 1, exportedAt: new Date().toISOString(),
    notes: Array.from(notes, ([id, note]) => {
      const spec = noteSpecs.get(id);
      return {id, cardId: spec.card.id, file: spec.excerpt.file, start: spec.excerpt.start, end: spec.excerpt.end, label: spec.excerpt.label, ...note};
    })
  };
}

function notesMessage(message, error = false) {
  const status = document.getElementById("notes-status");
  status.textContent = message;
  status.classList.toggle("is-error", error);
}

function updateNotesStatus() {
  notesMessage(storageError || `편집한 설명 ${notes.size}개 · 이 브라우저에 자동 저장됩니다.`, Boolean(storageError));
}

function loadNotes() {
  try {
    const stored = localStorage.getItem(noteStorageKey);
    if (stored) validateNotes(JSON.parse(stored)).forEach(({id, ...note}) => {
      if (noteSpecs.has(id)) notes.set(id, note);
    });
  } catch {
    storageError = "저장된 메모를 읽을 수 없습니다. 편집 내용은 내보내기로 백업해 주세요.";
  }
  updateNotesStatus();
}

function persistNotes() {
  try {
    localStorage.setItem(noteStorageKey, JSON.stringify(notesPayload()));
    storageError = "";
    return true;
  } catch {
    storageError = "브라우저에 저장하지 못했습니다. 페이지를 닫기 전에 메모를 내보내 주세요.";
    return false;
  } finally {
    updateNotesStatus();
  }
}

function fitNoteEditor(editor) {
  editor.style.height = "auto";
  editor.style.height = `${Math.max(190, editor.scrollHeight + 2)}px`;
}

function updateTimelineLine() {
  const flow = cardElement.querySelector(".review-flow");
  const markers = cardElement.querySelectorAll(".timeline-marker");
  if (!flow || !markers.length) return;
  const bounds = flow.getBoundingClientRect();
  const first = markers[0].getBoundingClientRect();
  const last = markers[markers.length - 1].getBoundingClientRect();
  flow.style.setProperty("--flow-start", `${first.top + first.height / 2 - bounds.top}px`);
  flow.style.setProperty("--flow-end", `${bounds.bottom - last.top - last.height / 2}px`);
}

const timelineObserver = window.ResizeObserver ? new ResizeObserver(updateTimelineLine) : null;

function timelineRow(card, excerpt, index) {
  const id = noteId(card, excerpt);
  const editorId = `note-${card.id}-${index}`;
  return `<li class="review-row">
    <div class="timeline-source">${codePanel(excerpt)}<div class="timeline-marker" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span></div></div>
    <div class="note-panel">
      <div class="note-heading"><label for="${editorId}">${escapeHtml(excerpt.label)}</label></div>
      <textarea id="${editorId}" class="note-editor" data-note-id="${escapeHtml(id)}" maxlength="100000" spellcheck="false" aria-label="${escapeHtml(card.id + " " + excerpt.label)} 설명과 메모" aria-describedby="notes-status">${escapeHtml(noteText(id))}</textarea>
      <div class="note-actions"><button type="button" data-export-note="${escapeHtml(id)}" aria-label="${escapeHtml(card.id + " " + excerpt.label)} 메모 내보내기">메모 내보내기</button></div>
    </div>
  </li>`;
}

function exportNote(id) {
  const spec = noteSpecs.get(id);
  if (!spec) return;
  const payload = {
    format: noteFormat, version: 1, exportedAt: new Date().toISOString(),
    notes: [{id, cardId: spec.card.id, file: spec.excerpt.file, start: spec.excerpt.start, end: spec.excerpt.end, label: spec.excerpt.label, text: noteText(id), updatedAt: notes.get(id)?.updatedAt || ""}]
  };
  const blob = new Blob([JSON.stringify(payload, null, 2) + "\n"], {type: "application/json;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `b2-1-${spec.card.id}-note-${spec.index + 1}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notesMessage(`${spec.card.id} · ${spec.excerpt.label} 메모를 내보냈습니다. 불러오기로 복원할 수 있습니다.`);
}

async function importNotes(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 20 * 1024 * 1024) throw new Error("메모 파일은 20MB 이하로 선택해 주세요.");
    const entries = validateNotes(JSON.parse(await file.text()));
    const matched = entries.filter((entry) => noteSpecs.has(entry.id));
    const conflicts = matched.filter((entry) => notes.has(entry.id) && notes.get(entry.id).text !== entry.text);
    if (conflicts.length && !window.confirm(`현재 메모 ${conflicts.length}개를 파일 내용으로 바꿀까요? 필요하면 먼저 현재 메모를 내보내 주세요.`)) return;
    if (!matched.length) {
      notesMessage("이 페이지에 적용할 편집 메모가 파일에 없습니다.");
      return;
    }
    matched.forEach(({id, ...note}) => notes.set(id, note));
    const saved = persistNotes();
    showCard(activeIndex, false);
    const skipped = entries.length - matched.length;
    if (saved) notesMessage(`${matched.length}개 메모를 불러와 저장했습니다.${skipped ? ` 현재 코드에 없는 ${skipped}개는 제외했습니다.` : ""}`);
  } catch (error) {
    notesMessage(error instanceof SyntaxError ? "JSON 파일을 읽을 수 없습니다. 내보낸 메모 파일을 선택해 주세요." : error.message, true);
  } finally {
    event.target.value = "";
  }
}

function explanation(number, title, content) {
  return `<section class="learning-step"><span class="step-number">${number}</span><div><h4>${title}</h4>${content}</div></section>`;
}

function cardMarkup(card) {
  const group = card.id.split("-")[0];
  return `<header class="card-heading">
    <div class="card-heading-top"><span class="item-id">${escapeHtml(card.id)}</span></div>
    <p class="card-subject">${escapeHtml(card.title)}</p>
    <h3>${escapeHtml(card.question)}</h3>
    <div class="card-source-list" aria-label="관련 최종 코드 위치">${card.excerpts.map((excerpt) =>
      `<a href="${escapeHtml(excerpt.url)}">${escapeHtml(displayFilePath(excerpt.file))}:${excerpt.start}${excerpt.end !== excerpt.start ? `–${excerpt.end}` : ""}</a>`
    ).join("")}</div>
    <p class="quick-answer"><strong>답변 요점</strong>${escapeHtml(card.answer)}</p>
  </header>
  <div class="review-column-headings"><h4>CODE FLOW</h4></div>
  <div class="review-flow">
    <ol class="review-timeline" aria-label="코드별 설명과 메모">${card.excerpts.map((excerpt, index) => timelineRow(card, excerpt, index)).join("")}</ol>
  </div>
  <details class="review-reference"><summary>항목 전체 설명 참고하기</summary>
  <div class="learning-list">
    ${explanation("01", "무슨 일을 하나요?", `<p>${escapeHtml(card.what)}</p>`)}
    ${explanation("02", "누가 정한 이름·기능인가요?", `<p>${escapeHtml(card.origin)}</p>`)}
    ${explanation("03", "어떤 순서로 실행되나요?", `<ol>${card.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`)}
    ${explanation("04", "다른 파일과 어떻게 이어지나요?", `<p>${escapeHtml(card.connections)}</p>`)}
    ${explanation("05", "왜 이 방식으로 작성했나요?", `<p>${escapeHtml(card.why)}</p>`)}
    ${explanation("06", "평가항목의 근거는 무엇인가요?", `<p>${escapeHtml(card.proof)}</p>${practiceLinks(card.practice)}`)}
  </div>
  </details>
  <div class="card-source-note">평가 문항 원문은 위 카드에 표시 · <a href="${repoBlobBase}/evaluation/evaluation_review.md#${card.id}">${escapeHtml(card.id)} 검토 기록</a> · 항목 ${group} ${groupNames[group] ? `(${groupNames[group]})` : ""}</div>`;
}

function renderJump() {
  jumpElement.innerHTML = cards.map((card, index) => {
    const firstInGroup = index === 0 || cards[index - 1].id.split("-")[0] !== card.id.split("-")[0];
    return `${firstInGroup ? `<span class="jump-group" aria-label="항목 ${card.id[0]}">${card.id[0]}</span>` : ""}<button type="button" data-index="${index}" aria-label="평가항목 ${card.id} 바로가기">${card.id}</button>`;
  }).join("");
}

function showCard(index, updateHash = true, scroll = false) {
  if (index < 0 || index >= cards.length) return;
  activeIndex = index;
  const card = cards[index];
  timelineObserver?.disconnect();
  cardElement.id = `evaluation-${card.id}`;
  cardElement.innerHTML = cardMarkup(card);
  cardElement.querySelectorAll(".note-editor").forEach(fitNoteEditor);
  updateTimelineLine();
  cardElement.querySelectorAll(".review-row").forEach((row) => timelineObserver?.observe(row));
  document.getElementById("card-counter").textContent = `${index + 1} / ${cards.length}`;
  const group = card.id.split("-")[0];
  document.getElementById("card-group").textContent = `항목 ${group} · ${groupNames[group]}`;
  previousButton.disabled = index === 0;
  nextButton.disabled = index === cards.length - 1;
  jumpElement.querySelectorAll("button").forEach((button, buttonIndex) => {
    if (buttonIndex === index) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
  if (updateHash) history.replaceState(null, "", `#evaluation-${card.id}`);
  if (scroll) cardElement.scrollIntoView({behavior: "smooth", block: "start"});
}

function showFromHash() {
  const match = location.hash.match(/^#evaluation-(\d+-\d+)$/);
  if (!match) return;
  const index = cards.findIndex((card) => card.id === match[1]);
  if (index >= 0) {
    showCard(index, false);
    requestAnimationFrame(() => cardElement.scrollIntoView({block: "start"}));
  }
}

if (cards.length) {
  loadNotes();
  renderJump();
  showCard(0, false);
  showFromHash();
  previousButton.addEventListener("click", () => showCard(activeIndex - 1, true, true));
  nextButton.addEventListener("click", () => showCard(activeIndex + 1, true, true));
  jumpElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-index]");
    if (button) showCard(Number(button.dataset.index), true, true);
  });
  window.addEventListener("hashchange", showFromHash);
  cardElement.addEventListener("input", (event) => {
    const editor = event.target.closest(".note-editor");
    if (!editor || !noteSpecs.has(editor.dataset.noteId)) return;
    notes.set(editor.dataset.noteId, {text: editor.value, updatedAt: new Date().toISOString()});
    persistNotes();
    fitNoteEditor(editor);
    updateTimelineLine();
  });
  cardElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-export-note]");
    if (button) exportNote(button.dataset.exportNote);
  });
  const fileInput = document.getElementById("import-notes-file");
  document.getElementById("import-notes").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", importNotes);
  window.addEventListener("resize", () => {
    cardElement.querySelectorAll(".note-editor").forEach(fitNoteEditor);
    updateTimelineLine();
  });
}

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("main-menu");
header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "목차 닫기" : "목차 열기");
  menu.classList.toggle("is-open", open);
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "목차 열기");
  menu.classList.remove("is-open");
}));
let previousScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  header.classList.toggle("is-scrolled", scrollY > 12);
  if (scrollY <= 12 || menu.classList.contains("is-open") || header.querySelector(":focus-visible")) {
    header.classList.remove("is-hidden");
  } else if (scrollY > previousScrollY && scrollY > header.offsetHeight) {
    header.classList.add("is-hidden");
  } else if (scrollY < previousScrollY) {
    header.classList.remove("is-hidden");
  }
  previousScrollY = scrollY;
}, {passive: true});
