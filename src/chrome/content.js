
function update() {
  chrome.storage.sync.get(['matchRule'], (value) => {
    let matchRule = value.matchRule ? value.matchRule : '[0-9a-zA-Z_-]{3,99}';
    let items = document.body.innerText.match(RegExp(matchRule, 'g'));
    items = Array.from(new Set(items));
    chrome.runtime.sendMessage(null, {
      type: 'commit',
      data: items
    });
  });
}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request == "update") {
      update();
    }
  }
);
update();


