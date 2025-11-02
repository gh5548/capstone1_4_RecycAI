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
const savePost = document.getElementById('savePost');
const cancelPost = document.getElementById('cancelPost');
const postTableBody = document.getElementById('postTableBody');
const postTitleInput = document.getElementById('postTitle');
const editor = document.getElementById('editor');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontColorInput = document.getElementById('fontColor');

// 상세보기 관련 요소
const postDetail = document.getElementById('postDetail'); // 상세보기 컨테이너
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
// 커뮤니티 글쓰기
// ======================
function toggleWriteForm(show = true) {
  writeForm.style.display = show ? 'block' : 'none';
  postList.style.display = show ? 'none' : 'block';
  postDetail.style.display = 'none';
}

writePostBtn.addEventListener('click', () => toggleWriteForm(true));
cancelPost.addEventListener('click', () => toggleWriteForm(false));

// ======================
// 게시글 저장
// ======================
function saveNewPost() {
  const title = postTitleInput.value.trim();
  const content = editor?.innerHTML.trim() || '';

  if (!title || !content) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  const now = new Date().toLocaleString();
  const newRow = postTableBody.insertRow(0);
  const cellData = [
    { class: 'category talk', html: '잡담' },
    { class: 'title', html: `<a href="#" class="post-link">${title}</a>` },
    { class: '', html: '익명' },
    { class: '', html: now },
    { class: '', html: '0' },
    { class: '', html: '0' },
  ];

  newRow.dataset.title = title;
  newRow.dataset.content = content;

  cellData.forEach(({ class: className, html }) => {
    const cell = newRow.insertCell();
    cell.className = className;
    cell.innerHTML = html;
  });

  postTitleInput.value = '';
  editor.innerHTML = '';
  toggleWriteForm(false);
}

savePost.addEventListener('click', saveNewPost);

// ======================
// 글쓰기 툴바 기능
// ======================
function execCommand(command, value = null) {
  document.execCommand(command, false, value);
}

fontSizeSelect.addEventListener('change', (e) => {
  const size = e.target.value;
  document.execCommand('fontSize', false, '4');
  document.querySelectorAll('font[size="4"]').forEach((el) => {
    el.removeAttribute('size');
    el.style.fontSize = size;
  });
});

fontColorInput.addEventListener('input', (e) =>
  execCommand('foreColor', e.target.value)
);

// ======================
// 게시글 클릭 → 상세보기
// ======================
postTableBody.addEventListener('click', (e) => {
  const link = e.target.closest('.post-link');
  if (!link) return;

  const row = link.closest('tr');
  const title = row.dataset.title;
  const content = row.dataset.content;

  postDetailTitle.textContent = title;
  postDetailContent.innerHTML = content;

  postList.style.display = 'none';
  writeForm.style.display = 'none';
  postDetail.style.display = 'block';
});

// 상세보기 닫기 버튼
closeDetailBtn.addEventListener('click', () => {
  postDetail.style.display = 'none';
  postList.style.display = 'block';
});
