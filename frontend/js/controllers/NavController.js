/**
 * NavController
 * Controls the dynamic navigation bar
 */
app.controller('NavController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

  $scope.isLoggedIn = function() { return AuthService.isLoggedIn(); };
  $scope.isAdmin    = function() { return AuthService.isAdmin(); };

  $scope.getUserName = function() {
    var u = AuthService.getUser();
    return u ? u.name : '';
  };

  $scope.getInitial = function() {
    var name = $scope.getUserName();
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  $scope.logout = function() {
    AuthService.logout();
    $location.path('/login');
  };

}]);

// ─── Home Controller ──────────────────────────────────────────────────────────
app.controller('HomeController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
  // Redirect if already logged in
  if (AuthService.isLoggedIn()) {
    $location.path(AuthService.isAdmin() ? '/admin' : '/dashboard');
  }
}]);
