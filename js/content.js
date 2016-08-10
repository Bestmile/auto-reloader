var config, timeoutDisplayResetDialog, timeoutReload, heartbeatInterval;
var app, resetDialog;

var lastRefresh = new Date();

chrome.storage.local.get({
  inactivityTimeout:              120,
  resetModalTimeout:              15,
  forceReloadTimeout:             900,
  reloadTimeoutOnIncompleteLoad:  30,
  loadCheckClass:                 'App',
  confirmDialogName:              'resetDialog',
  runURL:                         '',
  heartbeatURL:                   '',
  heartbeatName:                  ''
}, function(options) {
  if (!options.runURL || options.runURL.length === 0 || location.href.indexOf(options.runURL) < 0) {
    return; // disables the reload logic if the configured target is empty or doesn't match the current url
  }

  app         = document.getElementsByClassName(options.loadCheckClass)[0];
  resetDialog = document.getElementById(options.confirmDialogName);
  config      = options;

  assignTimeouts();
  sendHeartbeat();
});

var sendHeartbeat = function() {
  if (config.heartbeatURL.length > 0) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', config.heartbeatURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      "name": config.heartbeatName,
      "loaded": !!app,
      "options": config,
      "URL": location.href,
      "lastRefresh": lastRefresh
    }));
  }
}

var reload = function() {
  location.reload();
}

var onDialogDelayBeforeResetTimeout = function() {
  clearTimeout(timeoutReload);
  if (resetDialog && resetDialog.style.visibility == 'visible') { // prevents the reload if the dialog has been cancelled and is hidden
    reload();
  }
}

var onReloadDialogTimeout = function() {
  clearTimeout(timeoutDisplayResetDialog);
  if (resetDialog && config.resetModalTimeout > 0 ) {
    resetDialog.style.visibility = 'visible';
    timeoutReload = setTimeout(onDialogDelayBeforeResetTimeout, config.resetModalTimeout * 1000);
  } else {
    // skips displaying the reset dialog if the latter is undefined or the timeout set to 0 and reloads immediately
    reload();
  }
}

var resetReloadDialogTimer = function() {
  clearTimeout(timeoutDisplayResetDialog);
  timeoutDisplayResetDialog = setTimeout(onReloadDialogTimeout, config.inactivityTimeout * 1000);
}

var assignTimeouts = function() {
  if (app) {
    // page is loaded correctly
    app.onmousedown = resetReloadDialogTimer;
    app.ontouchend = resetReloadDialogTimer;
    // after x minutes of inactivity, the page will be reloaded to load updates and prevent errors
    if (config.forceReloadTimeout > 0) {
      timeoutDisplayResetDialog = setTimeout(reload, config.forceReloadTimeout * 1000);
    }
  } else {
    // the page did not load be completely, the script will force a reload after a few seconds
    if (config.reloadTimeoutOnIncompleteLoad > 0) {
      timeoutDisplayResetDialog = setTimeout(reload, config.reloadTimeoutOnIncompleteLoad * 1000);
    }
  }
}
