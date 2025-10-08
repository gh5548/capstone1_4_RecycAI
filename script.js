const mainContent = document.getElementById('MainContent');
const shopBtn = document.getElementById('shopBTN');
const Logo = document.getElementById('Logo');
const gameBtn = document.getElementById('gameBTN');

// 기본 검색창 UI
const searchUI = `
  <h2>올바른 분리수거 방법을 물어보세요.</h2>
  <div class="search-box">
    <input type="text" placeholder="무엇이든 물어보세요" />
    <button onclick="search()">검색</button>
  </div>
  <div class="tip">
    <span>👉</span> 음식물 묻은 스티로폼은 어디에 버릴까?
  </div>
`;

// 포인트 상점 UI
const shopUI = `
  <h2>포인트 상점</h2>
  <p>내 포인트: <span id="userPoint">1250</span>P</p>
  <div class="shop-grid">
    <div class="item-card">
      <img src="image/coffee.png" alt="상품1">
      <h3>스타벅스 쿠폰</h3>
      <p class="price">700P</p>
      <button class="exchange-btn" onclick="exchange(700, '스타벅스 쿠폰')">교환하기</button>
    </div>
    <div class="item-card">
      <img src="image/recycle.png" alt="상품2">
      <h3>재활용 봉투</h3>
      <p class="price">100P</p>
      <button class="exchange-btn" onclick="exchange(100, '편의점 상품권')">교환하기</button>
    </div>
  </div>
`;

const gameUI = `
  <h2>게임</h2>
  <div class="game-grid">
    <div class="game-card">
      <img src="" alt="게임1">
      <h3>gmae1</h3>
    </div>
    <div class="game-card">
      <img src="" alt="게임2">
      <h3>game2</h3>
    </div>
    <div class="game-card">
      <img src="" alt="게임3">
      <h3>game3</h3>
    </div>
  </div>
`;

let userPoint = 1250;

// 포인트 차감 함수
function exchange(price, name) {
  if (userPoint >= price) {
    userPoint -= price;
    document.getElementById('userPoint').textContent = userPoint;
    alert(`${name} 교환 완료!`);
  } else {
    alert('포인트가 부족합니다.');
  }
}

//포인트 상점 버튼 이벤트
shopBtn.addEventListener('click', () => {
  mainContent.innerHTML = shopUI;
});

//로고를 눌렀을 때 검색창으로 가기
Logo.addEventListener('click', () => {
  mainContent.innerHTML = searchUI;
});

// 새로고침 시 기본 검색창 유지
window.addEventListener('load', () => {
  mainContent.innerHTML = searchUI;
});

//게임 버틑 이벤트
gameBtn.addEventListener('click', () => {
  mainContent.innerHTML = gameUI;
});
