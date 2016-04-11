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

var outputToWindow = function(data, finishedCallback) {
  $('#window').empty();
  var delayCounter = 0;
  for (var i = 0; i < data.length; ++i) {
    delayCounter += data[i].delay;
    (function(text, clear, delay) {
      setTimeout(function() {
        if (clear) {
          $('#window').empty();
        } else {
          $('#window').append(text);
          $('#window').scrollTop(999999);
        }
      }, delay);
    })(data[i].text, data[i].clear, delayCounter);
  }
  setTimeout(function() {
    finishedCallback();
  }, delayCounter);
};

var toggleNavigationBar = (function() {
  var showing = false;

  var wrapped_fn = function(delay) {
    showing = !showing;
    if (delay == 0 || !delay) {
      delay = 0;
    }
    $('#navigation').delay(delay).animate({
      left: showing ? "0px": "-50px"
    }, {
      duration: 500,
      easing: "swing"
    })
  };

  return wrapped_fn;
})();

var toggleOptionsMenu = (function() {
  var showing = false;

  var wrapped_fn = function(delay) {
    showing = !showing;
    if (delay == 0 || !delay) {
      delay = 0;
    }

    $('#options').delay(delay).animate({
      right: showing ? "0px": "-250px"
    }, {
      duration: 500,
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

  // Stuff that happens first.
  toggleOptionsMenu(1000);
  toggleNavigationBar(1000);
  createMatrixAnimation(1000);

  // If the user clicks the 'X', then close the sidebar.
  $('#close-sidebar').click(function() {
    toggleOptionsMenu();
  });

  // The available commands are stored in an object here along with their
  // corresponding actions.
  var commands = {
    hack: function(terminal) {
      terminal.pause();
      terminal.echo('[[;;;green]hacking...]');
      createMatrixAnimation();
      setTimeout(function() {
        terminal.echo('[[;;;green]hacked! All your base are belong to us!]');
        terminal.resume();
      }, 1000);
    },
    help: function(terminal) {
      terminal.echo('Available commands: ' + Object.keys(commands).join(', '));
    },
    navigation: function(terminal) {
      terminal.echo('Toggling navigation bar...');
      toggleNavigationBar();
    },
    options: function(terminal) {
      terminal.echo('Toggling options menu...');
      toggleOptionsMenu();
    },
    who: function(terminal) {
      terminal.pause();
      terminal.echo('[[bg;;;red]Alvin Lin] (alvin.lin.dev@gmail.com) is a ' +
          'software developer from NYC.');
      outputToWindow(dataWho, function() {
        terminal.resume();
      });
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
