const ICONBAR_WIDTH = 40;
const IFRAME_WIDTH_VW = 25; // 幅は25vw（画面の約4分の1）

if (!document.getElementById("left-sidebar")) {
  const sidebar = document.createElement("div");
  sidebar.id = "left-sidebar";
  document.body.appendChild(sidebar);

  // ページ全体をサイドバー幅だけ押し出す
  document.body.style.marginLeft = ICONBAR_WIDTH + "px";
}

function getOrCreateIframe() {
  let iframe = document.getElementById("custom-iframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "custom-iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }
  return iframe;
}

// iframe表示トグルとマージン管理
function toggleIframe(url) {
  const iframe = getOrCreateIframe();
  const vwToPx = window.innerWidth * (IFRAME_WIDTH_VW / 100);

  // 拡張の中のページか判定
  const runtimeUrl = chrome.runtime.getURL(""); // 拡張のベースURL
  const isInternalPage = url.startsWith(runtimeUrl);

  if (!isInternalPage) {
    // もし外部URLならiframe表示はやめて別タブ開く(任意)
    window.open(url, "_blank");
    return;
  }

  if (iframe.style.display === "block" && iframe.src === url) {
    iframe.style.display = "none";
    iframe.src = "";
    document.body.style.marginLeft = ICONBAR_WIDTH + "px";
  } else {
    iframe.style.display = "block";
    if (iframe.src !== url) {
      iframe.src = url;
    }
    document.body.style.marginLeft = `calc(${ICONBAR_WIDTH}px + ${IFRAME_WIDTH_VW}vw)`;
  }
}

// サイドバーにボタンを追加する関数
function addSidebarButton(iconHtml, url) {
  const sidebar = document.getElementById("left-sidebar");
  if (!sidebar) return;

  const btn = document.createElement("div");
  btn.className = "sidebar-button";
  btn.innerHTML = iconHtml;
  btn.title = url; // 何のページかツールチップに表示
  btn.style.userSelect = "none"; // 選択防止

  btn.addEventListener("click", () => {
    toggleIframe(url);
  });

  sidebar.appendChild(btn);
}

// 例：拡張内のHTMLページでボタン追加（manifest.jsonでweb_accessible_resourcesに含めること）
addSidebarButton("&#x1F5D2;", chrome.runtime.getURL("panels/memo/index.html")); // ノートアイコン
addSidebarButton("&#x1F4D6;", chrome.runtime.getURL("panels/readinglists/index.html")); // リーディングリスト

