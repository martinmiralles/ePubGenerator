/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */
(function() {
  var tablist = document.querySelectorAll('[role="tablist"]');
  var tabs = [];
  var panels = [];
  var delay = 300;
  tablist.forEach(function(item, index) {
    tabs[index] = tablist[index].querySelectorAll('[role="tab"]');
    panels[index] = [];
    tabs[index].forEach(function(aitem, aindex) {
      panels[index][aindex] = document.getElementById(aitem.getAttribute("aria-controls"));
    });
  });

  // For easy reference
  var keys = {
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    delete: 46
  };

  // Add or substract depending on key pressed
  var direction = {
    37: -1,
    38: -1,
    39: 1,
    40: 1
  };

  // Bind listeners

  tabs.forEach(function(item, index) {
    for (i = 0; i < tabs[index].length; ++i) {
      addListeners(index, i);
    };
  });

  function addListeners(out_index, in_index) {
    tabs[out_index][in_index].addEventListener('click', clickEventListener);
    tabs[out_index][in_index].addEventListener('keydown', keydownEventListener);
    tabs[out_index][in_index].addEventListener('keyup', keyupEventListener);

    // Build an array with all tabs (<button>s) in it
    tabs[out_index][in_index].out_index = out_index;
    tabs[out_index][in_index].in_index = in_index;
  };

  function clickEventListener(event) {
    var tab = event.target;
    activateTab(tab, false);
  };

  // Handle keydown on tabs
  function keydownEventListener(event) {
    var key = event.keyCode;
    var out_index = event.target.out_index;
    switch (key) {
      case keys.end:
        event.preventDefault();
        // Activate last tab
        activateTab(tabs[out_index][tabs[out_index].length - 1]);
        break;
      case keys.home:
        event.preventDefault();
        // Activate first tab
        activateTab(tabs[out_index][0]);
        break;

        // Up and down are in keydown
        // because we need to prevent page scroll >:)
      case keys.up:
      case keys.down:
        determineOrientation(event);
        break;
    };
  };

  // Handle keyup on tabs
  function keyupEventListener(event) {
    var key = event.keyCode;

    switch (key) {
      case keys.left:
      case keys.right:
        determineOrientation(event);
        break;
      case keys.delete:
        determineDeletable(event);
        break;
    };
  };

  function activateTab(tab, setFocus) {
    setFocus = setFocus || true;
    // Deactivate all other tabs
    deactivateTabs(tab);

    // Remove tabindex attribute
    tab.removeAttribute('tabindex');

    // Set the tab as selected
    tab.setAttribute('aria-selected', 'true');

    // Get the value of aria-controls (which is an ID)
    var controls = tab.getAttribute('aria-controls');

    // Remove hidden attribute from tab panel to make it visible
    document.getElementById(controls).removeAttribute('hidden');

    // Set focus when required
    if (setFocus) {
      tab.focus();
    };
  };

  // When a tablistâ€™s aria-orientation is set to vertical,
  // only up and down arrow should function.
  // In all other cases only left and right arrow function.
  function determineOrientation(event) {
    var key = event.keyCode;
    var out_index = event.target.out_index;
    var vertical = tablist[out_index].getAttribute('aria-orientation') == 'vertical';
    var proceed = false;

    if (vertical) {
      if (key === keys.up || key === keys.down) {
        event.preventDefault();
        proceed = true;
      };
    } else {
      if (key === keys.left || key === keys.right) {
        proceed = true;
      };
    };
    if (proceed) {
      switchTabOnArrowPress(event);
    };
  };
  // Either focus the next, previous, first, or last tab
  // depening on key pressed
  function switchTabOnArrowPress(event) {
    var pressed = event.keyCode;
    var out_index = event.target.out_index;
    for (x = 0; x < tabs[out_index].length; x++) {
      tabs[out_index][x].addEventListener('focus', focusEventHandler);
    };
    if (direction[pressed]) {
      var target = event.target;
      if (out_index !== undefined) {
        if (tabs[out_index][target.in_index + direction[pressed]]) {
          tabs[out_index][target.in_index + direction[pressed]].focus();
        } else if (pressed === keys.left || pressed === keys.up) {
          focusLastTab(out_index);
        } else if (pressed === keys.right || pressed == keys.down) {
          focusFirstTab(out_index);
        };
      };
    };
  };

  //
  function focusEventHandler(event) {
    var target = event.target;
    setTimeout(checkTabFocus, delay, target);
  };

  // Only activate tab on focus if it still has focus after the delay
  function checkTabFocus(target) {
    focused = document.activeElement;

    if (target === focused) {
      activateTab(target, false);
    };
  };

  // Deactivate all tabs and tab panels
  function deactivateTabs(tab) {
    var out_index = tab.out_index;
    var in_index = tab.in_index;
    for (t = 0; t < tabs[out_index].length; t++) {
      tabs[out_index][t].setAttribute('tabindex', '-1');
      tabs[out_index][t].setAttribute('aria-selected', 'false');
      tabs[out_index][t].removeEventListener('focus', focusEventHandler);
    };

    for (p = 0; p < panels[out_index].length; p++) {
      panels[out_index][p].setAttribute('hidden', 'hidden');
    };
  };

  // Make a guess
  function focusFirstTab(out_index) {
    tabs[out_index][0].focus();
  };

  // Make a guess
  function focusLastTab(out_index) {
    tabs[out_index][tabs[out_index].length - 1].focus();
  };

}());