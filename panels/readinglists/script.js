document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('add-form');
  const titleInput = document.getElementById('title-input');
  const urlInput = document.getElementById('url-input');
  const readingList = document.getElementById('reading-list');

  let items = JSON.parse(localStorage.getItem('readingListItems')) || [];

  function saveItems() {
    localStorage.setItem('readingListItems', JSON.stringify(items));
  }

  function renderItems() {
    readingList.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      a.target = '_blank'; // リンクを新しいタブで開く

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm(`「${item.title}」を削除しますか？`)) {
          items.splice(index, 1);
          saveItems();
          renderItems();
        }
      });

      li.appendChild(a);
      li.appendChild(deleteBtn);
      readingList.appendChild(li);
    });
  }

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    // タイトルかURLが空欄の場合
    if (title === '' || url === '') {
      // バックグラウンドスクリプトに現在のアクティブタブの情報を要求
      chrome.runtime.sendMessage({ type: 'getActiveTabInfo' }, (response) => {
        if (response && response.url) {
          // 入力が空だったフィールドをタブ情報で埋める
          const newTitle = title === '' ? response.title : title;
          const newUrl = url === '' ? response.url : url;
          
          items.unshift({ title: newTitle, url: newUrl });
          saveItems();
          renderItems();
          titleInput.value = '';
          urlInput.value = '';
        }
      });
    } else {
      // 両方のフィールドが入力されている場合
      items.unshift({ title, url });
      saveItems();
      renderItems();
      titleInput.value = '';
      urlInput.value = '';
    }
  });

  renderItems();
});
