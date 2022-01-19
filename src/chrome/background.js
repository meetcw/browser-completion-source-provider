chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, 'update');
});

chrome.windows.onFocusChanged.addListener(() => {
  chrome.windows.getCurrent({}, (window) => {
    chrome.tabs.query({ active: true, windowId: window.id }, (tabs) => {
      if (tabs.length > 0) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, 'update');
      }
    });
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, 'update');
})

function showState(tabId, state, message) {
  if (state == 'success') {
    chrome.action.setBadgeBackgroundColor({
      color: 'gray'
    });
    chrome.action.setBadgeText({
      text: message,
      tabId: tabId
    });
  } else if ('error') {
    chrome.action.setBadgeBackgroundColor({
      color: 'red'
    });
    chrome.action.setBadgeText({
      text: message,
      tabId: tabId
    });
  } else {
    chrome.action.setBadgeBackgroundColor({
      color: 'gray'
    });
    chrome.action.setBadgeText({
      text: message,
      tabId: tabId
    });
  }
}

chrome.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  if (request.type == 'commit') {
    if (sender.tab) {
      chrome.storage.sync.get(['serverPort'], (value) => {
        let serverPort = value.serverPort ? value.serverPort : '18998';
        let data = request.data ?? [];
        console.log(sender.tab.title, data);
        let ws = new WebSocket('ws://127.0.0.1:' + serverPort);
        ws.onopen = () => {
          ws.send(data.join('\n'));
          showState(sender.tab.id, 'success', String(data.length));
          ws.close();
        }
        ws.onerror = () => {
          showState(sender.tab.id, 'error', String(0));
        }
      });
    }
  }
});