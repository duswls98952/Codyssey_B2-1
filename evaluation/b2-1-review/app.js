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

function codePanel(excerpt) {
  const lines = excerpt.lines.map((line) =>
    `<span class="code-line"><span class="line-number" aria-hidden="true">${line.number}</span><span class="line-text">${escapeHtml(line.text) || " "}</span></span>`
  ).join("");
  return `<figure class="code-panel ${excerpt.kind === "direct" ? "is-direct" : ""}">
    <figcaption><span class="code-kind">${excerpt.kind === "direct" ? "직접 근거" : "연결 코드"}</span><strong>${escapeHtml(excerpt.label)}</strong>
      <a href="${escapeHtml(excerpt.url)}" title="원본 코드 파일 열기">${escapeHtml(excerpt.file)}:${excerpt.start}${excerpt.end !== excerpt.start ? `–${excerpt.end}` : ""} ↗</a></figcaption>
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

function explanation(number, title, content) {
  return `<section class="learning-step"><span class="step-number">${number}</span><div><h4>${title}</h4>${content}</div></section>`;
}

function flowDiagram(diagram) {
  const nodes = diagram.nodes.map((node, index) =>
    `<li class="flow-node"><span class="flow-node-number">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(node.label)}</strong><span>${escapeHtml(node.detail)}</span></li>`
  ).join("");
  const outcomes = diagram.outcomes ? `<div class="flow-outcomes" aria-label="실행 결과">${diagram.outcomes.map((outcome) =>
    `<div class="flow-outcome"><strong>${escapeHtml(outcome.label)}</strong><span>${escapeHtml(outcome.detail)}</span></div>`
  ).join("")}</div>` : "";
  return `<figure class="card-flow"><figcaption><span class="eyebrow">CODE FLOW</span><strong>${escapeHtml(diagram.title)}</strong></figcaption>
    <ol class="flow-track">${nodes}</ol>${outcomes}
    ${diagram.note ? `<p class="flow-note">${escapeHtml(diagram.note)}</p>` : ""}
  </figure>`;
}

function cardMarkup(card) {
  const group = card.id.split("-")[0];
  return `<header class="card-heading">
    <div class="card-heading-top"><span class="item-id">${escapeHtml(card.id)}</span><span class="status ${card.status === "통과" ? "status-pass" : "status-check"}">${escapeHtml(card.status)}</span></div>
    <p class="card-subject">${escapeHtml(card.title)}</p>
    <h3>${escapeHtml(card.question)}</h3>
    <div class="card-source-list" aria-label="관련 최종 코드 위치">${card.excerpts.map((excerpt) =>
      `<a href="${escapeHtml(excerpt.url)}">${escapeHtml(excerpt.file)}:${excerpt.start}${excerpt.end !== excerpt.start ? `–${excerpt.end}` : ""}</a>`
    ).join("")}</div>
    <p class="quick-answer"><strong>답변 요점</strong>${escapeHtml(card.answer)}</p>
  </header>
  <div class="code-heading"><div><p class="eyebrow">SOURCE CODE</p><h4>최종 코드에서 확인하기</h4></div><span>관련 줄만 발췌 · 파일명 클릭 시 원본 열기</span></div>
  <div class="code-grid">${card.excerpts.map(codePanel).join("")}</div>
  ${card.diagram ? flowDiagram(card.diagram) : ""}
  <div class="explanation-heading"><p class="eyebrow">STEP BY STEP</p><h4>이 코드 이해하기</h4></div>
  <div class="learning-list">
    ${explanation("01", "무슨 일을 하나요?", `<p>${escapeHtml(card.what)}</p>`)}
    ${explanation("02", "프로그램의 어디에 있나요?", `<p>${escapeHtml(card.place)}</p>`)}
    ${explanation("03", "누가 정한 이름·기능인가요?", `<p>${escapeHtml(card.origin)}</p>`)}
    ${explanation("04", "어떤 순서로 실행되나요?", `<ol>${card.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`)}
    ${explanation("05", "다른 파일과 어떻게 이어지나요?", `<p>${escapeHtml(card.connections)}</p>`)}
    ${explanation("06", "왜 이 방식으로 작성했나요?", `<p>${escapeHtml(card.why)}</p>`)}
    ${explanation("07", "평가항목의 근거는 무엇인가요?", `<p>${escapeHtml(card.proof)}</p>${practiceLinks(card.practice)}`)}
    ${explanation("08", "복습할 한 가지", `<p>${escapeHtml(card.recall)}</p>`)}
  </div>
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
  cardElement.id = `evaluation-${card.id}`;
  cardElement.innerHTML = cardMarkup(card);
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
  if (scroll) document.getElementById("evaluation").scrollIntoView({behavior: "smooth", block: "start"});
}

function showFromHash() {
  const match = location.hash.match(/^#evaluation-(\d+-\d+)$/);
  if (!match) return;
  const index = cards.findIndex((card) => card.id === match[1]);
  if (index >= 0) {
    showCard(index, false);
    requestAnimationFrame(() => document.getElementById("evaluation").scrollIntoView({block: "start"}));
  }
}

if (cards.length) {
  renderJump();
  showCard(0, false);
  showFromHash();
  document.getElementById("count-all").textContent = cards.length;
  document.getElementById("count-pass").textContent = cards.filter((card) => card.status === "통과").length;
  document.getElementById("count-check").textContent = cards.filter((card) => card.status === "확인 필요").length;
  previousButton.addEventListener("click", () => showCard(activeIndex - 1, true, true));
  nextButton.addEventListener("click", () => showCard(activeIndex + 1, true, true));
  jumpElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-index]");
    if (button) showCard(Number(button.dataset.index), true, true);
  });
  window.addEventListener("hashchange", showFromHash);
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
