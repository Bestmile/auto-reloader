Auto Reloader
==============

Chrome extension to automatically reload the tab(s) matching a given (partial) URL after a duration of inactivity.

Features
--------

* Prevents reloading the page if someone is actively using it (timeout reset on click)
* Display a confirmation dialog from the current page (if available) before reloading the page
* Allows to set a second delay that will reload the page without confirmation
* Checks for a css class after the page has loaded and forces a reload if not found (used the check that the page loaded successfully)
* Can send a heartbeat post to a given remote server on each load of the target page
* All above options are configurable
