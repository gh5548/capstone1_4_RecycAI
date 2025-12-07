(function () {
  'use strict';

  /* ======================
     유틸
  ====================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const guard = (el) => el !== null && el !== undefined;

  /* ======================
     DOM 캐시
  ====================== */
  const state = {
    pages: $$('.page'),
    navButtons: {
      Logo: $('#Logo'),
      shop: $('#shopBTN'),
      game: $('#gameBTN'),
      community: $('#communityBTN'),
      attendance: $('#attendanceBTN'),
    },
    userPointEl: $('#userPoint'),
    // community
    writePostBtn: $('#writePostBtn'),
    postList: $('#postList'),
    writeForm: $('#writeForm'),
    savePostBtn: $('#savePost'),
    cancelPostBtn: $('#cancelPost'),
    postTableBody: $('#postTableBody'),
    postTitleInput: $('#postTitle'),
    editor: $('#editor'),
    fontSizeSelect: $('#fontSizeSelect'),
    fontColorInput: $('#fontColor'),
    // detail view
    postDetail: $('#postDetail'),
    postDetailTitle: $('#detailTitle'),
    postDetailContent: $('#detailContent'),
    closeDetailBtn: $('#closeDetailBtn'),
    // chat
    searchBtn: $('#searchBtn'),
    searchInput: $('#searchInput'),
    chatContainer: $('#chatContainer'),
    // attendance
    attendanceBTN: $('#attendanceBTN'),
    attendancePage: $('#attendancePage'),
    attendanceGrid: $('#attendanceGrid'),
    attendanceCount: $('#attendanceCount'),
    attendanceCheckBtn: $('#attendanceCheckBtn'),
    todayRewardEl: $('#todayReward'),
    // calendar (secondary)
    attendanceCalendar: $('#attendanceCalendar'),
    checkAttendanceBtn: $('#checkAttendance'),
  };

  /* ======================
     공통 DOM 헬퍼
  ====================== */
  function hideAllPages() {
    state.pages.forEach((p) => (p.style.display = 'none'));
  }

  function showPageById(id) {
    hideAllPages();
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }

  /* ======================
     로그인/유틸
  ====================== */
  function getLoginUserId() {
    return localStorage.getItem('userId');
  }
  function requireLogin() {
    const uid = getLoginUserId();
    if (!uid) {
      alert('로그인이 필요합니다.');
      location.href = 'login.html';
      return null;
    }
    return uid;
  }

  /* ======================
     상점(포인트 교환) 서버 연동
  ====================== */
  async function refreshPoint() {
    const userPointEl = state.userPointEl;
    if (!guard(userPointEl)) return;
    const userId = getLoginUserId();
    if (!userId) {
      userPointEl.textContent = '0';
      return;
    }
    try {
      const res = await fetch(`/shop/point?user_id=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      userPointEl.textContent = data.point ?? 0;
    } catch (e) {
      console.error(e);
    }
  }

  let redeemBound = false;
  function bindRedeemButtons() {
    if (redeemBound) return;
    redeemBound = true;
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.exchange-btn');
      if (!btn) return;

      const userId = requireLogin();
      if (!userId) return;

      const itemCard = btn.closest('.item-card');
      if (!itemCard) return;
      const price = parseInt(itemCard.dataset.price || '0', 10);
      const name = itemCard.dataset.name || '상품';

      if (!confirm(`'${name}'을(를) ${price}P로 교환하시겠습니까?`)) return;

      try {
        const res = await fetch(
          `/shop/redeem?user_id=${encodeURIComponent(userId)}&price=${price}&item_name=${encodeURIComponent(name)}`,
          { method: 'POST' }
        );
        if (!res.ok) {
          let msg = '알 수 없는 오류가 발생했습니다.';
          try {
            const j = await res.json();
            msg = j.detail || JSON.stringify(j);
          } catch {
            msg = await res.text();
          }
          throw new Error(msg);
        }
        alert(`${name} 교환 완료!`);
        await refreshPoint();
      } catch (err) {
        if (String(err.message).includes('Method Not Allowed')) {
          alert('교환 실패: 요청 방법이 올바르지 않습니다.');
        } else {
          alert('교환 실패: ' + err.message);
        }
      }
    });
  }

  /* ======================
     내비게이션 초기화
  ====================== */
  function initNavigation() {
    Object.entries(state.navButtons).forEach(([key, btn]) => {
      if (!guard(btn)) return;
      btn.addEventListener('click', () => {
        if (key === 'Logo') {
          location.reload();
          return;
        }
        const map = {
          shop: 'shopPage',
          game: 'gamePage',
          community: 'communityPage',
          attendance: 'attendancePage',
        };
        const targetPage = map[key] || 'searchPage';
        showPageById(targetPage);
        if (key === 'shop') {
          refreshPoint();
          bindRedeemButtons();
        }
      });
    });

    // 초기 보여줄 페이지
    window.addEventListener('load', () => showPageById('searchPage'));
  }

  /* ======================
     상점(포인트 교환) 초기화
  ====================== */
  function initShop() {
    if (!guard(state.userPointEl)) return;
    refreshPoint();
    bindRedeemButtons();
  }

  /* ======================
     커뮤니티 초기화
  ====================== */
  function initCommunity() {
    const {
      writePostBtn,
      postList,
      writeForm,
      savePostBtn,
      cancelPostBtn,
      postTableBody,
      postTitleInput,
      editor,
      postDetail,
      postDetailTitle,
      postDetailContent,
      closeDetailBtn,
    } = state;

    if (!guard(postTableBody)) return;

    function resetWriteForm() {
      if (postTitleInput) postTitleInput.value = '';
      if (editor) editor.innerHTML = '';
    }

    function toggleWriteForm(show) {
      if (writeForm) writeForm.style.display = show ? 'block' : 'none';
      if (postList) postList.style.display = show ? 'none' : 'block';
      if (postDetail) postDetail.style.display = 'none';
      if (!show) resetWriteForm();
    }

    function saveNewPost() {
      const title = ((postTitleInput && postTitleInput.value) || '').trim();
      const content = ((editor && editor.innerHTML) || '').trim();

      if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
      }

      const now = new Date().toLocaleString();
      const newRow = document.createElement('tr');
      newRow.dataset.title = title;
      newRow.dataset.content = content;

      const cellData = [
        { className: 'category talk', html: '잡담' },
        {
          className: 'title',
          html: `<a href="#" class="post-link">${title}</a>`,
        },
        { className: '', html: '익명' },
        { className: '', html: now },
        { className: '', html: '0' },
        { className: '', html: '0' },
      ];

      cellData.forEach(({ className = '', html = '' }) => {
        const cell = document.createElement('td');
        if (className) cell.className = className;
        cell.innerHTML = html;
        newRow.appendChild(cell);
      });

      const noticeRow = postTableBody.querySelector('.notice-row');
      if (noticeRow) postTableBody.insertBefore(newRow, noticeRow.nextSibling);
      else postTableBody.prepend(newRow);

      toggleWriteForm(false);
    }

    function showPostDetail(title, content) {
      if (postDetailTitle) postDetailTitle.textContent = title;
      if (postDetailContent) postDetailContent.innerHTML = content;
      if (postList) postList.style.display = 'none';
      if (writeForm) writeForm.style.display = 'none';
      if (postDetail) postDetail.style.display = 'block';
    }

    // 버튼 바인딩
    if (guard(writePostBtn))
      writePostBtn.addEventListener('click', () => toggleWriteForm(true));
    if (guard(cancelPostBtn))
      cancelPostBtn.addEventListener('click', () => toggleWriteForm(false));
    if (guard(savePostBtn)) savePostBtn.addEventListener('click', saveNewPost);

    // 이벤트 위임: 게시글 링크 클릭 -> 상세보기
    postTableBody.addEventListener('click', (e) => {
      const link = e.target.closest('.post-link');
      if (!link) return;
      const row = link.closest('tr');
      if (!row) return;
      showPostDetail(row.dataset.title, row.dataset.content);
    });

    if (guard(closeDetailBtn)) {
      closeDetailBtn.addEventListener('click', () => {
        if (postDetail) postDetail.style.display = 'none';
        if (postList) postList.style.display = 'block';
      });
    }
  }

  /* ======================
     에디터 (툴바/스타일 적용) 초기화
     - execCommand는 레거시지만 편의상 유지
     - 키 입력 처리를 통해 포맷된 span 삽입
  ====================== */
  function initEditor() {
    const { editor, fontSizeSelect, fontColorInput } = state;
    if (!guard(editor)) return;

    let currentFontSize = (fontSizeSelect && fontSizeSelect.value) || '16px';
    let currentFontColor = (fontColorInput && fontColorInput.value) || '#000';

    function execFormat(command, value = null) {
      document.execCommand(command, false, value);
      editor.focus();
    }

    // 글자 크기 변경
    if (guard(fontSizeSelect)) {
      fontSizeSelect.addEventListener('change', (e) => {
        currentFontSize = e.target.value;
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          execFormat('fontSize', 4);
          editor.querySelectorAll('font[size="4"]').forEach((el) => {
            el.removeAttribute('size');
            el.style.fontSize = currentFontSize;
          });
        } else if (selection && selection.rangeCount) {
          const span = document.createElement('span');
          span.style.fontSize = currentFontSize;
          span.textContent = '\u200B';
          const range = selection.getRangeAt(0);
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.setStart(span.firstChild, 1);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      });
    }

    // 글자 색상 변경
    if (guard(fontColorInput)) {
      fontColorInput.addEventListener('input', (e) => {
        currentFontColor = e.target.value;
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          execFormat('foreColor', currentFontColor);
        } else if (selection && selection.rangeCount) {
          const span = document.createElement('span');
          span.style.color = currentFontColor;
          span.textContent = '\u200B';
          const range = selection.getRangeAt(0);
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.setStart(span.firstChild, 1);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      });
    }

    // 키 입력 처리
    editor.addEventListener('keydown', (e) => {
      const allowed = new Set([
        'Enter',
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ]);

      if (e.key === 'Tab') {
        e.preventDefault();
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = currentFontSize;
        span.style.color = currentFontColor;
        span.textContent = '\u00A0\u00A0\u00A0\u00A0';
        range.deleteContents();
        range.insertNode(span);
        const newRange = document.createRange();
        newRange.setStartAfter(span);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        return;
      }

      if (allowed.has(e.key) || e.ctrlKey || e.metaKey || e.key.length !== 1) {
        return;
      }

      e.preventDefault();
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
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
      sel.removeAllRanges();
      sel.addRange(newRange);
    });

    // 마우스 드래그로 텍스트 선택 후 스타일 적용
    editor.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || selection.isCollapsed) return;
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = currentFontSize;
      span.style.color = currentFontColor;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    });

    // 툴바 상태 업데이트
    const findToolbarBtn = (command) =>
      document.querySelector(`button[onclick*="${command}"]`) ||
      document.querySelector(`button[data-command="${command}"]`);

    const boldBtn = findToolbarBtn('bold');
    const italicBtn = findToolbarBtn('italic');
    const underlineBtn = findToolbarBtn('underline');

    function updateToolbar() {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      if (boldBtn)
        boldBtn.classList.toggle('active', document.queryCommandState('bold'));
      if (italicBtn)
        italicBtn.classList.toggle(
          'active',
          document.queryCommandState('italic')
        );
      if (underlineBtn)
        underlineBtn.classList.toggle(
          'active',
          document.queryCommandState('underline')
        );

      let fontSize =
        (state.fontSizeSelect && state.fontSizeSelect.value) || currentFontSize;
      let fontColor =
        (state.fontColorInput && state.fontColorInput.value) || currentFontColor;

      if (!sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const parent = range.startContainer.parentNode;
        if (parent && parent.nodeType === 1) {
          if (parent.style.fontSize) fontSize = parent.style.fontSize;
          if (parent.style.color) fontColor = parent.style.color;
        }
      }

      if (state.fontSizeSelect) state.fontSizeSelect.value = fontSize;
      if (state.fontColorInput) state.fontColorInput.value = fontColor;
    }

    document.addEventListener('selectionchange', updateToolbar);

    // expose
    window.format = execFormat;
  }

  /* ======================
     채팅 (타자효과 포함)
  ====================== */
  function initChat() {
    const { searchBtn, searchInput, chatContainer } = state;
    if (!guard(searchBtn) || !guard(searchInput) || !guard(chatContainer))
      return;

    function getRecycleAnswer(question) {
      return 'AI 테스트용 답변입니다.';
    }

    function addChatMessage(text, type = 'ai') {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${type}`;
      msg.innerText = text;
      chatContainer.appendChild(msg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return msg;
    }

    function showTypingIndicator() {
      const typing = document.createElement('div');
      typing.className = 'chat-msg ai typing-indicator';
      typing.innerText = '...';
      chatContainer.appendChild(typing);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      return typing;
    }

    function typeWriterEffect(element, text, speed = 30, callback) {
      let i = 0;
      const id = setInterval(() => {
        element.innerText = text.substring(0, i++);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        if (i > text.length) {
          clearInterval(id);
          if (typeof callback === 'function') callback();
        }
      }, speed);
    }

    searchBtn.addEventListener('click', () => {
      const question = (searchInput.value || '').trim();
      if (!question) return;

      chatContainer.style.display = 'flex';
      addChatMessage(question, 'user');

      searchInput.disabled = true;
      searchBtn.disabled = true;

      const indicator = showTypingIndicator();
      const answer = getRecycleAnswer(question);

      setTimeout(() => {
        indicator.remove();
        const aiMsg = addChatMessage('', 'ai');
        typeWriterEffect(aiMsg, answer, 25, () => {
          searchInput.disabled = false;
          searchBtn.disabled = false;
          searchInput.focus();
        });
      }, 600);
      searchInput.value = '';
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  /* ======================
     출석판
  ====================== */
  function initAttendance() {
    const gridEl = state.attendanceGrid;
    const calendarEl = state.attendanceCalendar;
    const countEl = state.attendanceCount;
    const todayRewardEl = state.todayRewardEl;
    const totalDays = 28;

    if (!gridEl && !calendarEl) return;

    const pointRewards = [
      10, 10, 10, 10, 10, 10, 30, 15, 15, 15, 15, 15, 15, 45, 20, 20, 20, 20,
      20, 20, 60, 25, 25, 25, 25, 25, 25, 75,
    ];

    const attendanceRewards = {
      3: '20P',
      5: '30P',
      7: '100P',
      10: '150P',
      14: '200P',
      21: '300P',
      28: '500P!',
    };

    function loadAttendance() {
      const lastCheckDate = localStorage.getItem('lastCheckDate');
      const todayDate = new Date().toISOString().split('T')[0];
      if (lastCheckDate !== todayDate) {
        localStorage.setItem('attendanceDays', JSON.stringify([]));
        localStorage.setItem('lastCheckDate', todayDate);
      }
      return JSON.parse(localStorage.getItem('attendanceDays') || '[]');
    }

    function saveAttendance(arr) {
      localStorage.setItem('attendanceDays', JSON.stringify(arr));
      localStorage.setItem(
        'lastCheckDate',
        new Date().toISOString().split('T')[0]
      );
    }

    function renderGrid() {
      if (!gridEl) return;
      const days = loadAttendance();
      gridEl.innerHTML = '';
      for (let i = 1; i <= totalDays; i++) {
        const cell = document.createElement('div');
        cell.className = 'attendance-cell';
        cell.dataset.day = String(i);
        cell.textContent = i;

        if (days.includes(i)) cell.classList.add('checked');

        if (pointRewards[i - 1] !== undefined) {
          const tag = document.createElement('div');
          tag.className = 'reward-text';
          tag.innerText = `🪙${pointRewards[i - 1]} point`;
          cell.appendChild(tag);
        }

        gridEl.appendChild(cell);
      }
      if (countEl) countEl.textContent = days.length;
    }

    function renderCalendar() {
      if (!calendarEl) return;
      const days = loadAttendance();
      calendarEl.innerHTML = '';
      for (let d = 1; d <= totalDays; d++) {
        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.dataset.day = String(d);
        btn.type = 'button';
        btn.innerHTML = `${d}`;
        if (days.includes(d)) {
          btn.classList.add('active');

          if (pointRewards[d - 1] !== undefined) {
            const r = document.createElement('div');
            r.className = 'reward-text';
            r.innerText = `🪙${pointRewards[d - 1]} point`;
            btn.appendChild(r);
          }
        }
        calendarEl.appendChild(btn);
      }
    }

    function checkTodayAttendance() {
      const today = new Date().getDate();
      if (today > totalDays) {
        alert(`이번 달 출석은 ${totalDays}일까지 가능합니다!`);
        return;
      }
      const days = loadAttendance();
      if (days.includes(today)) {
        alert('오늘은 이미 출석했습니다!');
        return;
      }
      days.push(today);
      saveAttendance(days);

      const count = days.length;
      const rewardText = attendanceRewards[count]
        ? `${attendanceRewards[count]} + 기본 ${pointRewards[today - 1]}P`
        : `기본 ${pointRewards[today - 1]}P`;

      if (todayRewardEl) todayRewardEl.textContent = rewardText;
      renderGrid();
      renderCalendar();
      alert(`출석 완료!\n오늘 보상: ${rewardText}`);
    }

    if (calendarEl) {
      calendarEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.day-btn');
        if (!btn) return;
      });
    }

    if (state.attendanceBTN) {
      state.attendanceBTN.addEventListener('click', () => {
        showPageById('attendancePage');
      });
    }

    if (state.attendanceCheckBtn) {
      state.attendanceCheckBtn.addEventListener('click', checkTodayAttendance);
    }

    if (state.checkAttendanceBtn) {
      state.checkAttendanceBtn.addEventListener('click', checkTodayAttendance);
    }

    renderGrid();
    renderCalendar();
  }

  /* ======================
     앱 초기화
  ====================== */
  function initApp() {
    initNavigation();
    initShop();
    initCommunity();
    initEditor();
    initChat();
    initAttendance();
  }

  // 시작
  initApp();
})();
