function save_options() {
  chrome.storage.local.set({
    inactivityTimeout:             document.getElementById('inactivity_timeout').value,
    resetModalTimeout:             document.getElementById('reset_modal_timeout').value,
    forceReloadTimeout:            document.getElementById('force_reload_timeout').value,
    reloadTimeoutOnIncompleteLoad: document.getElementById('incomplete_load_timeout').value,
    loadCheckClass:                document.getElementById('load_check_class').value,
    confirmDialogName:             document.getElementById('confirm_dialog_name').value,
    runURL:                        document.getElementById('run_url').value,
    heartbeatURL:                  document.getElementById('heartbeat_url').value,
    heartbeatName:                 document.getElementById('heartbeat_name').value,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function restore_options() {
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
    document.getElementById('inactivity_timeout').value       = options.inactivityTimeout;
    document.getElementById('reset_modal_timeout').value      = options.resetModalTimeout;
    document.getElementById('force_reload_timeout').value     = options.forceReloadTimeout;
    document.getElementById('incomplete_load_timeout').value  = options.reloadTimeoutOnIncompleteLoad;
    document.getElementById('load_check_class').value         = options.loadCheckClass;
    document.getElementById('run_url').value                  = options.runURL;
    document.getElementById('confirm_dialog_name').value      = options.confirmDialogName;
    document.getElementById('heartbeat_url').value            = options.heartbeatURL;
    document.getElementById('heartbeat_name').value           = options.heartbeatName;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
