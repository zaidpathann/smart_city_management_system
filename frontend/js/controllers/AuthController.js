/**
 * AuthController
 * Handles user registration and login
 */
app.controller('AuthController', ['$scope', '$location', 'ApiService', 'AuthService',
function($scope, $location, ApiService, AuthService) {

  // Redirect if already logged in
  if (AuthService.isLoggedIn()) {
    $location.path(AuthService.isAdmin() ? '/admin' : '/dashboard');
    return;
  }

  $scope.user = {};
  $scope.loading = false;
  $scope.error = '';
  $scope.success = '';

  /* ── Register ── */
  $scope.register = function() {
    $scope.error = '';
    if (!$scope.user.name || !$scope.user.email || !$scope.user.password) {
      $scope.error = 'Please fill in all required fields.';
      return;
    }
    if ($scope.user.password.length < 6) {
      $scope.error = 'Password must be at least 6 characters.';
      return;
    }
    $scope.loading = true;

    ApiService.register($scope.user)
      .then(function(res) {
        AuthService.saveSession(res.data.token, res.data.user);
        var role = res.data.user.role;
        $location.path(role === 'admin' ? '/admin' : '/dashboard');
      })
      .catch(function(err) {
        $scope.error = err.data ? err.data.message : 'Registration failed. Try again.';
      })
      .finally(function() { $scope.loading = false; });
  };

  /* ── Login ── */
  $scope.login = function() {
    $scope.error = '';
    if (!$scope.user.email || !$scope.user.password) {
      $scope.error = 'Please enter your email and password.';
      return;
    }
    $scope.loading = true;

    ApiService.login({ email: $scope.user.email, password: $scope.user.password })
      .then(function(res) {
        AuthService.saveSession(res.data.token, res.data.user);
        var role = res.data.user.role;
        $location.path(role === 'admin' ? '/admin' : '/dashboard');
      })
      .catch(function(err) {
        $scope.error = err.data ? err.data.message : 'Login failed. Check credentials.';
      })
      .finally(function() { $scope.loading = false; });
  };

}]);
