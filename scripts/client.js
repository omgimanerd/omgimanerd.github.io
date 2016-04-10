/**
 * Client side script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var randRange = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
};

var randRangeInt = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

var toggleOptionsMenu = (function() {
  var showing = false;

  var wrapped_fn = function(delay) {
    showing = !showing;
    if (delay == 0 || !delay) {
      delay = 0;
    }

    $('#sidebar').delay(delay).animate({
      right: showing ? "0px": "-251px"
    }, {
      duration: 1000,
      easing: "swing"
    });
  };

  return wrapped_fn;
})();

var createMatrixAnimation = (function() {
  var divs = [];
  var maxWidth = $('#matrix').width() - 200;

  var wrapped_fn = function(delay) {
    if (delay == 0 || !delay) {
      delay = 0;
    }

    if (divs.length == 0) {
      for (var i = 0; i < 150; ++i) {
        $('#matrix').append($('<div></div>'));
      }
    }

    $('#matrix div').each(function(index) {
      $(this).text(randRangeInt(0, 2))
          .css({
            left: Math.floor(Math.random() * maxWidth) + 100,
            top: 0,
            opacity: 1
          })
          .delay(delay)
          .animate({
            top: $(document).height(),
            opacity: '0'
          }, randRange(500, 2500));
    });
  };

  return wrapped_fn;
})();

$(document).ready(function() {

  // Disable the right click menu
  window.oncontextmenu = function() {
    return false;
  };

  toggleOptionsMenu(1000);

  createMatrixAnimation(1000);

  // If the user clicks the 'X', then close the sidebar.
  $('#close-sidebar').click(function() {
    toggleOptionsMenu();
  });

  // The available commands are stored in an object here along with their
  // corresponding actions.
  var commands = {
    hack: function(terminal) {
      terminal.clear();
      terminal.pause();
      terminal.echo('[[;;;green]hacking...]');
      createMatrixAnimation();
      setTimeout(function() {
        terminal.echo('[[;;;green]hacked!]');
        terminal.resume();
      }, 1000);
    },
    help: function(terminal) {
      terminal.echo('Available commands: ' + Object.keys(commands).join(', '));
    },
    options: function(terminal) {
      terminal.echo('Toggling options menu...');
      toggleOptionsMenu();
    },
    who: function(terminal) {
      terminal.echo('[[bg;;;red]Alvin Lin] (alvin.lin.dev@gmail.com) is a ' +
          'full stack web developer from New York.');
    }
  }

  $('#terminal').terminal(function(command, terminal) {
    if (!command) {
      return;
    } else if (commands[command]) {
      commands[command](terminal);
    } else if (command == 'christine') {
      terminal.echo('sqrt(-1) [[;;;red]<3] u');
    } else {
      terminal.error(command + ': command not found');
    }
  }, {
    greetings: '[[;;;green]omgimanerd.github.io - Type help for available' +
      ' commands]',
    width: 600,
    height: 300,
    prompt: '[[;;;red]user_' + Math.floor(Math.random() * 10000) +
        ']:[[;;;green]$] ',
    completion: Object.keys(commands)
  });
});
