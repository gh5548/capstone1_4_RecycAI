// ======================
// DOM 요소 선택
// ======================
const pages = document.querySelectorAll('.page');
const Logo = document.getElementById('Logo');
const shopBtn = document.getElementById('shopBTN');
const gameBtn = document.getElementById('gameBTN');
const communityBtn = document.getElementById('communityBTN');

const userPointEl = document.getElementById('userPoint');
let userPoint = 1250;

// 커뮤니티 관련
const writePostBtn = document.getElementById('writePostBtn');
const postList = document.getElementById('postList');
const writeForm = document.getElementById('writeForm');
const savePost = document.getElementById('savePost');
const cancelPost = document.getElementById('cancelPost');
const postTableBody = document.getElementById('postTableBody');

// ======================
// 페이지 전환
// ======================
function showPage(pageId) {
  pages.forEach((page) => (page.style.display = 'none'));
  document.getElementById(pageId).style.display = 'block';
}

const pageButtons = [
  { btn: Logo, page: 'searchPage' },
  { btn: shopBtn, page: 'shopPage' },
  { btn: gameBtn, page: 'gamePage' },
  { btn: communityBtn, page: 'communityPage' },
];

pageButtons.forEach(({ btn, page }) => {
  btn.addEventListener('click', () => showPage(page));
});

// 첫 로드 시 검색 페이지 보여주기
window.addEventListener('load', () => showPage('searchPage'));

// ======================
// 포인트 교환
// ======================
document.querySelectorAll('.exchange-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const itemCard = btn.closest('.item-card');
    const price = parseInt(itemCard.dataset.price);
    const name = itemCard.dataset.name;
    if (userPoint >= price) {
      userPoint -= price;
      userPointEl.textContent = userPoint;
      alert(`${name} 교환 완료!`);
    } else {
      alert('포인트가 부족합니다.');
    }
  });
});

// ======================
// 커뮤니티 글쓰기
// ======================
function toggleWriteForm(show = true) {
  writeForm.style.display = show ? 'block' : 'none';
  postList.style.display = show ? 'none' : 'block';
}

writePostBtn.addEventListener('click', () => toggleWriteForm(true));
cancelPost.addEventListener('click', () => toggleWriteForm(false));

savePost.addEventListener('click', () => {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();

  if (!title || !content) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  const newRow = postTableBody.insertRow(0);
  const cells = [
    { className: 'category talk', content: '잡담' },
    { className: 'title', content: `<a href="#">${title}</a>` },
    { className: '', content: '익명' },
    { className: '', content: new Date().toLocaleString() },
    { className: '', content: '0' },
    { className: '', content: '0' },
  ];

  cells.forEach((cell, idx) => {
    const newCell = newRow.insertCell(idx);
    newCell.className = cell.className;
    newCell.innerHTML = cell.content;
  });

  // 입력 초기화 및 목록으로 복귀
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  toggleWriteForm(false);
});
