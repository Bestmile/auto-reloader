var inactivityTimeout, resetModalTimeout, forceReloadTimeout, reloadTimeoutOnIncompleteLoad;
var timeoutDisplayResetDialog, timeoutReload;
var app, resetDialog;

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
    // disables the reload logic if the configured target is empty or doesn't match the current url
    return;
  }

  inactivityTimeout             = options.inactivityTimeout;
  resetModalTimeout             = options.resetModalTimeout;
  forceReloadTimeout            = options.forceReloadTimeout;
  reloadTimeoutOnIncompleteLoad = options.reloadTimeoutOnIncompleteLoad;

  app                           = document.getElementsByClassName(options.loadCheckClass)[0];
  resetDialog                   = document.getElementById(options.confirmDialogName);

  // call the specified heartbeat endpoint on each reload
  if (options.heartbeatURL.length > 0) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', options.heartbeatURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"name": options.heartbeatName, "loaded": !!app}));
  }

  assignTimeouts();
});

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
  if (resetDialog && resetModalTimeout > 0 ) {
    resetDialog.style.visibility = 'visible';
    timeoutReload = setTimeout(onDialogDelayBeforeResetTimeout, resetModalTimeout * 1000);
  } else {
    // skips displaying the reset dialong if the latter is undefined or the timeout set to 0 and reloads immediately
    reload();
  }
}

var resetReloadDialogTimer = function() {
  clearTimeout(timeoutDisplayResetDialog);
  timeoutDisplayResetDialog = setTimeout(onReloadDialogTimeout, inactivityTimeout * 1000);
}

var assignTimeouts = function() {
  if (app) {
    // page is loaded correctly
    app.onmousedown = resetReloadDialogTimer;
    app.ontouchend = resetReloadDialogTimer;
    // after x minutes of inactivity, the page will be reloaded to load updates and prevent errors
    if (forceReloadTimeout > 0) {
      timeoutDisplayResetDialog = setTimeout(reload, forceReloadTimeout * 1000);
    }
  } else {
    // the page did not load be completely, the script will force a reload after a few seconds
    if (reloadTimeoutOnIncompleteLoad > 0) {
      timeoutDisplayResetDialog = setTimeout(reload, reloadTimeoutOnIncompleteLoad * 1000);
    }
  }
}
