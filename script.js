// ======================
// DOM 요소 선택
// ======================
const pages = document.querySelectorAll('.page');
const navButtons = {
  Logo: document.getElementById('Logo'),
  shop: document.getElementById('shopBTN'),
  game: document.getElementById('gameBTN'),
  community: document.getElementById('communityBTN'),
};

const userPointEl = document.getElementById('userPoint');
let userPoint = 1250;

// 커뮤니티 관련 요소
const writePostBtn = document.getElementById('writePostBtn');
const postList = document.getElementById('postList');
const writeForm = document.getElementById('writeForm');
const savePostBtn = document.getElementById('savePost');
const cancelPostBtn = document.getElementById('cancelPost');
const postTableBody = document.getElementById('postTableBody');
const postTitleInput = document.getElementById('postTitle');
const editor = document.getElementById('editor');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontColorInput = document.getElementById('fontColor');

// 상세보기 관련 요소
const postDetail = document.getElementById('postDetail');
const postDetailTitle = document.getElementById('detailTitle');
const postDetailContent = document.getElementById('detailContent');
const closeDetailBtn = document.getElementById('closeDetailBtn');

// ======================
// 페이지 전환
// ======================
function showPage(pageId) {
  pages.forEach((page) => (page.style.display = 'none'));
  document.getElementById(pageId).style.display = 'block';
}

Object.entries(navButtons).forEach(([key, btn]) => {
  const targetPage =
    key === 'Logo'
      ? 'searchPage'
      : key === 'shop'
      ? 'shopPage'
      : key === 'game'
      ? 'gamePage'
      : 'communityPage';

  btn.addEventListener('click', () => showPage(targetPage));
});

window.addEventListener('load', () => showPage('searchPage'));

// ======================
// 포인트 교환
// ======================
document.querySelectorAll('.exchange-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const itemCard = btn.closest('.item-card');
    const price = parseInt(itemCard.dataset.price, 10);
    const name = itemCard.dataset.name;

    if (userPoint < price) return alert('포인트가 부족합니다.');

    userPoint -= price;
    userPointEl.textContent = userPoint;
    alert(`${name} 교환 완료!`);
  });
});

// ======================
// 커뮤니티 기능
// ======================

// 글쓰기창 토글
function toggleWriteForm(show) {
  writeForm.style.display = show ? 'block' : 'none';
  postList.style.display = show ? 'none' : 'block';
  postDetail.style.display = 'none';
  if (!show) resetWriteForm();
}

// 글쓰기 초기화
function resetWriteForm() {
  postTitleInput.value = '';
  editor.innerHTML = '';
}

// 게시글 저장
function saveNewPost() {
  const title = postTitleInput.value.trim();
  const content = editor.innerHTML.trim();

  if (!title || !content) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  const now = new Date().toLocaleString();
  const newRow = document.createElement('tr');
  newRow.dataset.title = title;
  newRow.dataset.content = content;

  const cellData = [
    { class: 'category talk', html: '잡담' },
    { class: 'title', html: `<a href="#" class="post-link">${title}</a>` },
    { html: '익명' },
    { html: now },
    { html: '0' },
    { html: '0' },
  ];

  cellData.forEach(({ class: className = '', html }) => {
    const cell = document.createElement('td');
    cell.className = className;
    cell.innerHTML = html;
    newRow.appendChild(cell);
  });

  const noticeRow = postTableBody.querySelector('.notice-row');
  if (noticeRow) {
    postTableBody.insertBefore(newRow, noticeRow.nextSibling);
  } else {
    postTableBody.prepend(newRow);
  }

  toggleWriteForm(false);
}

// 상세보기 표시
function showPostDetail(title, content) {
  postDetailTitle.textContent = title;
  postDetailContent.innerHTML = content;

  postList.style.display = 'none';
  writeForm.style.display = 'none';
  postDetail.style.display = 'block';
}

// ======================
// 이벤트 등록
// ======================
writePostBtn.addEventListener('click', () => toggleWriteForm(true));
cancelPostBtn.addEventListener('click', () => toggleWriteForm(false));
savePostBtn.addEventListener('click', saveNewPost);

postTableBody.addEventListener('click', (e) => {
  const link = e.target.closest('.post-link');
  if (!link) return;

  const row = link.closest('tr');
  showPostDetail(row.dataset.title, row.dataset.content);
});

closeDetailBtn.addEventListener('click', () => {
  postDetail.style.display = 'none';
  postList.style.display = 'block';
});

// ======================
// 글쓰기 툴바
// ======================
let currentFontSize = fontSizeSelect.value;
let currentFontColor = fontColorInput.value;

// 툴바 명령
function format(command, value = null) {
  document.execCommand(command, false, value);
  editor.focus();
}

// ======================
// 글씨 크기 변경 (커서 위치에도 즉시 적용)
// ======================
fontSizeSelect.addEventListener('change', (e) => {
  currentFontSize = e.target.value;

  // 현재 선택 영역이 있다면 거기에 적용
  if (document.getSelection().toString()) {
    format('fontSize', 4);
    editor.querySelectorAll('font[size="4"]').forEach((el) => {
      el.removeAttribute('size');
      el.style.fontSize = currentFontSize;
    });
  } else {
    // 선택 영역이 없을 때 (커서만 있을 때)
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const span = document.createElement('span');
      span.style.fontSize = currentFontSize;
      span.textContent = '\u200B'; // zero-width space (커서 표시용)
      const range = selection.getRangeAt(0);
      range.insertNode(span);
      // 커서를 span 안쪽으로 이동
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, 1);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
});

// ======================
// 글자색 변경 (커서 위치에도 즉시 적용)
// ======================
fontColorInput.addEventListener('input', (e) => {
  currentFontColor = e.target.value;

  if (document.getSelection().toString()) {
    format('foreColor', currentFontColor);
  } else {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const span = document.createElement('span');
      span.style.color = currentFontColor;
      span.textContent = '\u200B'; // zero-width space
      const range = selection.getRangeAt(0);
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, 1);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
});

// 입력 처리
editor.addEventListener('keydown', (e) => {
  const allowDefaultKeys = [
    'Enter',
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ];

  // ======================
  // 탭키 처리 (스타일 적용된 공백 4칸 삽입)
  // ======================
  if (e.key === 'Tab') {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // span으로 감싸서 스타일 적용
    const span = document.createElement('span');
    span.style.fontSize = currentFontSize;
    span.style.color = currentFontColor;
    span.textContent = '\u00A0\u00A0\u00A0\u00A0'; // 공백 4칸

    range.deleteContents();
    range.insertNode(span);

    // 커서를 삽입된 스페이스 뒤로 이동
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    return;
  }

  if (allowDefaultKeys.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey) return;
  if (e.key.length !== 1) return;

  e.preventDefault();

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  const char = e.key === ' ' ? '\u00A0' : e.key;

  const span = document.createElement('span');
  span.style.fontSize = currentFontSize;
  span.style.color = currentFontColor;
  span.textContent = char;

  range.deleteContents();
  range.insertNode(span);

  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
});

// 드래그 영역에 스타일 적용
editor.addEventListener('mouseup', () => {
  applyStyleToSelection();
});

function applyStyleToSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement('span');
  span.style.fontSize = currentFontSize;
  span.style.color = currentFontColor;
  span.appendChild(range.extractContents());
  range.insertNode(span);

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.addRange(newRange);
}

const boldBtn = document.querySelector('button[onclick="format(\'bold\')"]');
const italicBtn = document.querySelector(
  'button[onclick="format(\'italic\')"]'
);
const underlineBtn = document.querySelector(
  'button[onclick="format(\'underline\')"]'
);

function updateToolbar() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // bold, italic, underline 상태
  boldBtn.classList.toggle('active', document.queryCommandState('bold'));
  italicBtn.classList.toggle('active', document.queryCommandState('italic'));
  underlineBtn.classList.toggle(
    'active',
    document.queryCommandState('underline')
  );

  // 글자 크기와 색상 (span 확인)
  let fontSize = currentFontSize;
  let fontColor = currentFontColor;

  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const parent = range.startContainer.parentNode;
    if (parent && parent.nodeType === 1) {
      // Element
      if (parent.style.fontSize) fontSize = parent.style.fontSize;
      if (parent.style.color) fontColor = parent.style.color;
    }
  }

  fontSizeSelect.value = fontSize;
  fontColorInput.value = fontColor;
}

// 커서 이동 또는 선택 변경 시
document.addEventListener('selectionchange', updateToolbar);

// =========================
// ChatGPT 스타일 검색 실행
// =========================

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const chatContainer = document.getElementById('chatContainer');

// AI 자동 답변 함수
function getRecycleAnswer(question) {
  return 'AI테스트용 답변입니다';
}

// 메시지 UI 생성 함수
function addChatMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;
  msg.innerText = text;
  chatContainer.appendChild(msg);
}

// 검색 버튼 클릭
searchBtn.addEventListener('click', () => {
  const question = searchInput.value.trim();
  if (question === '') return;

  // 대화 UI 나타나기
  chatContainer.style.display = 'flex';

  // 사용자 메시지 추가
  addChatMessage(question, 'user');

  // AI 메시지 추가
  const answer = getRecycleAnswer(question);
  setTimeout(() => {
    addChatMessage(answer, 'ai');
  }, 500);

  searchInput.value = '';
});
