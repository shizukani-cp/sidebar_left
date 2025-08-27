chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // メッセージのタイプが'getActiveTabInfo'であるかを確認
  if (request.type === 'getActiveTabInfo') {
    // 現在アクティブで、現在のウィンドウにあるタブを問い合わせる
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        // タブのタイトルとURLをレスポンスとして送信
        sendResponse({ title: tab.title, url: tab.url });
      } else {
        // タブが見つからなかった場合は空の情報を返す
        sendResponse({ title: '', url: '' });
      }
    });
    // 非同期でレスポンスを返すことを示すためにtrueを返す
    return true;
  }
});
