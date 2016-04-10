/**
 * Client side script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {

  // Disable the right click menu
  window.oncontextmenu = function() {
    return false;
  };

  // Create the matrix animation in the beginning.
  for (var i = 0; i < 150; ++i) {
    var maxWidth = $('#matrix').width() - 200;
    var fallingDiv = $('<div></div>').text(Math.floor(Math.random() * 2));
    fallingDiv.css('left', Math.floor(Math.random() * maxWidth) + 100);
    fallingDiv.delay(1000).animate({
      top: $(document).height(),
      opacity: '0'
    }, Math.floor(Math.random() * 2500) + 1000);
    $('#matrix').append(fallingDiv);
  }

  // If the user clicks the 'X', then close the sidebar.
  $('#close-sidebar').click(function() {
    $('#sidebar').animate({
      right: "-251px"
    }, {
      duration: 1000,
      easing: "swing"
    });
  });

  // The available commands are stored in an object here along with their
  // corresponding actions.
  var commands = {
    hack: function(terminal) {
      terminal.clear();
      terminal.pause();
      terminal.echo('[[;;;green]hacking...]');
      setTimeout(function() {
        terminal.echo('[[;;;green]hacking...]');
        setTimeout(function() {
          terminal.echo('[[;;;green]hacked!]');
          terminal.resume();
        }, 1000);
      }, 1000);
    },
    help: function(terminal) {
      terminal.echo('Available commands: ' + Object.keys(commands).join(', '));
    },
    options: function(terminal) {
      terminal.echo('Opening options menu...');
      $('#sidebar').animate({
        right: "0px"
      }, {
        duration: 1000,
        easing: "swing"
      });
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
