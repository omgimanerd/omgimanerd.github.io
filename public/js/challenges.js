/**
 * @fileoverview Client side script for challenges.html
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

 /**
  * All the JavaScript necessary for challenges.html is wrapped with this
  * closure to prevent pollution of the global namespace.
  */
var challengesJs = function() {

  var alert = function(options) {
    $('#message-modal .material-icons').text(options['icon']);
    $('#message-modal .title').text(options['title']);
    $('#message-modal .text').text(options['text']);
    $('#message-modal').openModal();
  };

  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.modal-trigger').leanModal();

    $('#challenges-login-modal form').submit(function(event) {
      event.preventDefault();
      $('#challenges-login-modal button').addClass('disabled');
      $('#challenges-login-modal input').attr('disabled', true);
      $.post('/challenges/login', {
        'username': $('#challenges-login-username').val(),
        'password': $('#challenges-login-password').val()
      }, function(response) {

        if (response['error']) {
          console.log(response['error']);
        } else {
          location.reload();
        }
      });
    });

    $('#challenges-register').click(function() {
      $.post('/challenges/register', {
        'email': $('#challenges-register-email').val(),
        'username': $('#challenges-register-username').val(),
        'password': $('#challenges-register-password').val()
      }, function(response) {
        if (response['error']) {
          console.log(response['error']);
        } else {
          location.reload();
        };
      });
    });
  });

  /**
   * Angular linkages.
   */
  var app = angular.module('challenges', []);

  app.service('userDataService', function($http) {
    var service = this;
    service.loadUserData = function(callback) {
      $http.post('/challenges/whoami').success(function(response) {
        service.username = response['username'];
        service.admin = response['admin'];
        if (callback) {
          callback();
        }
      });
    }
  });

  app.controller(
      'usernameDisplayController', function($scope, userDataService) {
    userDataService.loadUserData(function() {
      $scope.username = userDataService['username'];
      $scope.admin = userDataService['admin'];
    });
  });

  app.controller('challengesDisplayController', function($scope, $http) {
    $scope.loadChallenges = function() {
      $http.post('/challenges/challenges').success(function(response) {
        if (response.error) {
          alert({
            'icon': 'error',
            'title': 'Error!',
            'text': response['error']
          });
          return;
        }
        $scope.challenges = response['challenges'];
      });
    };
    $scope.loadChallenges();
  });

  app.controller('challengeSubmitController', function($scope) {
    $scope.submitChallenge = function() {
      $.post('/challenges/answer', {
        'challengeId': $scope.challenge._id,
        'answer': $scope.answer
      }, function(result) {
        // TODO
        $scope.loadChallenges();
      });
    };
  });

  app.controller('leaderboardDisplayController', function($scope, $http) {
    $http.post('/challenges/leaderboard').success(function(response) {
      if (response['error']) {
        showError({
          'icon': 'error',
          'title': 'Error!',
          'text': response['error']
        });
        return;
      }
      $scope.users = response['users'];
    });
  });
};

window['challengesJs'] = challengesJs;
