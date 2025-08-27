let memos = [];
if (localStorage.getItem('memos')) {
  memos = JSON.parse(localStorage.getItem('memos'));
} else {
  memos = [
    {id: 1, title: "メモ1", content: "メモ1の内容です。"}
  ];
  localStorage.setItem('memos', JSON.stringify(memos));
}

window.onbeforeunload = (e) => {
  if (!window.saved) {
    if (!window.confirm("保存せずに終了しますか？")) {
      e.preventDefault();
    }
  }
}

document.getElementById('memo-content').addEventListener("keydown", () => {window.saved = false;});

window.onload = function () {
  const memoList = document.getElementById('memo-list');
  const newMemoBtn = document.getElementById('new-memo-btn');
  const saveMemoBtn = document.getElementById('save-memo-btn');
  const exportMemoBtn = document.getElementById("export-memo-btn");
  const fileInputE = document.getElementById("file-input");

  memos.forEach(memo => {
    const li = document.createElement('li');
    li.textContent = memo.title;
    li.classList.add("memos-li");
    li.dataset.memoId = memo.id; // データ属性にmemoのidを設定


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteMemo(memo.id); // memo.idを渡す
    });


    li.appendChild(deleteBtn);


    li.addEventListener('click', function () {
      displayMemo(memo);
    });
    memoList.appendChild(li);
  });


  newMemoBtn.addEventListener('click', function () {
    const newMemo = {id: memos.length + 1, title: "新しいメモ", content: ""};
    memos.push(newMemo);
    localStorage.setItem('memos', JSON.stringify(memos));
    const li = document.createElement('li');
    li.textContent = newMemo.title;
    li.classList.add("memos-li");
    li.dataset.memoId = newMemo.id; // データ属性に新しいmemoのidを設定


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteMemo(newMemo.id); // newMemo.idを渡す
    });


    li.appendChild(deleteBtn);


    li.addEventListener('click', function () {
      displayMemo(newMemo);
    });
    memoList.appendChild(li);
    displayMemo(newMemo);
  });


  saveMemoBtn.addEventListener('click', function () {
    const memoId = parseInt(document.getElementById('memo-content').dataset.memoId);
    const memoTitle = document.getElementById('memo-title').value;
    const memoBody = document.getElementById('memo-body').value;


    const selectedMemo = memos.find(memo => memo.id === memoId);
    if (selectedMemo) {
      selectedMemo.title = memoTitle;
      selectedMemo.content = memoBody;
      localStorage.setItem('memos', JSON.stringify(memos));
      window.saved = true;
      refreshMemoList();
      displayMemo(selectedMemo);
    }
  });

  exportMemoBtn.addEventListener("click", () => {
    const memoData = localStorage.getItem("memos");
    const blob = new Blob([memoData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'memos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  fileInputE.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
        const contents = ev.target.result;
        if (window.confirm("上書きします。よろしいですか？")) {
          localStorage.setItem("memos", contents);
          window.location.reload();
        }
    };
    reader.readAsText(file);
  });

  if (memos.length > 0) {
    displayMemo(memos[0]);
  }
};


function displayMemo(memo) {
  const memoContent = document.getElementById('memo-content');
  const displayMarkdownE = document.getElementById("display-markdown");
  const markdownResultE = document.getElementById("markdown-result");
  const markdownAreaE = document.getElementById("markdown-area");
  const markdownReloadBtn = document.getElementById("markdown-reload");

  memoContent.dataset.memoId = memo.id; // データ属性にmemoのidを設定
  memoContent.innerHTML = `
            <input type="text" id="memo-title" value="${memo.title}"><br>
            <textarea id="memo-body">${memo.content}</textarea>
        `;

  if (displayMarkdownE.checked) {
    markdownAreaE.style.visibility = "visible";
    markdownReloadBtn.style.display = "inline-block";
    markdownResultE.innerHTML = `<h1>${memo.title}</h1>`;
    markdownResultE.innerHTML += marked.parse(memo.content);
  } else {
    markdownAreaE.style.visibility = "hidden";
    markdownReloadBtn.style.display = "none";
  }
}


function deleteMemo(memoId) {
  if (window.confirm('本当に削除しますか？')) {
    const memoContent = document.getElementById('memo-content');
    const currentMemoId = parseInt(memoContent.dataset.memoId);

    // 配列とlocalStorageから削除
    memos = memos.filter(memo => memo.id !== memoId);
    localStorage.setItem('memos', JSON.stringify(memos));

    // DOMからli要素を削除
    const liToDelete = document.querySelector(`li[data-memo-id="${memoId}"]`);
    if (liToDelete) {
      liToDelete.remove();
    }

    // 表示中のメモが削除された場合の処理
    if (currentMemoId === memoId) {
      if (memos.length > 0) {
        displayMemo(memos[0]);
      } else {
        clearMemoContent();
      }
    }
  }
}


function refreshMemoList() {
  const memoList = document.getElementById('memo-list');
  memoList.innerHTML = '';


  memos.forEach(memo => {
    const li = document.createElement('li');
    li.textContent = memo.title;
    li.classList.add("memos-li");
    li.dataset.memoId = memo.id; // データ属性にmemoのidを設定


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      deleteMemo(memo.id); // memo.idを渡す
    });


    li.appendChild(deleteBtn);


    li.addEventListener('click', function () {
      displayMemo(memo);
    });
    memoList.appendChild(li);
  });
}


function clearMemoContent() {
  const memoContent = document.getElementById('memo-content');
  memoContent.innerHTML = '';
  memoContent.removeAttribute('data-memo-id');

  const markdownResult = document.getElementById('markdown-result');
  markdownResult.innerHTML = '';
}

document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // デフォルトのブラウザの動作（保存ダイアログなど）を無効化
    const button = document.getElementById('save-memo-btn');
    if (button) {
      button.click(); // ボタンをプログラム的にクリック
    }
  } else if (event.ctrlKey && event.key === 'n') {
    event.preventDefault(); // デフォルトのブラウザの動作（保存ダイアログなど）を無効化
    const button = document.getElementById('new-memo-btn');
    if (button) {
      button.click(); // ボタンをプログラム的にクリック
    }
  }
});

document.getElementById("display-markdown").addEventListener("change", () => {
  document.getElementById("save-memo-btn").click();
});
document.getElementById("markdown-reload").addEventListener("click", () => {
  document.getElementById("save-memo-btn").click();
});
