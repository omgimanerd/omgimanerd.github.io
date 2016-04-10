/**
 * Client side script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  window.oncontextmenu = function() {
    return false;
  };

  var userNumber = Math.round(Math.random() * 10000);
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
      terminal.echo("Available commands: " + Object.keys(commands).join(", "));
    },
    who: function(terminal) {
      terminal.echo("[[bg;;;red]Alvin Lin] (alvin.lin.dev@gmail.com) is a " +
          "full stack web developer from New York.");
    }
  }

  $('#terminal').terminal(function(command, terminal) {
    if (commands[command]) {
      commands[command](terminal);
    } else if (command == 'christine') {
      terminal.echo('i <3 u');
    } else {
      terminal.error(command + ': command not found');
    }
  }, {
    greetings: '[[;;;green]omgimanerd.github.io - Type help for available' +
      ' commands]',
    width: 600,
    height: 300,
    prompt: '[[;;;red]user_' + userNumber + ']:[[;;;green]$] ',
    completion: Object.keys(commands)
  });
});
