chrome.storage.local.get({
  runURL: ''
}, function(options) {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (options.runURL.length > 0 && tab.url.indexOf(options.runURL) >= 0) {
        // inject the content script into the page
        chrome.tabs.executeScript(tabId, {
            file: 'js/content.js',
            runAt: 'document_idle'
        });
      }
    }
  });
});
