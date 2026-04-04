/**
 * AuthService
 * Manages JWT storage, user session, login/logout
 */

app.service('AuthService', ['$window', function($window) {

  var TOKEN_KEY = 'sc_token';
  var USER_KEY  = 'sc_user';

  // Save token and user to localStorage
  this.saveSession = function(token, user) {
    $window.localStorage.setItem(TOKEN_KEY, token);
    $window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  // Get stored user object
  this.getUser = function() {
    var u = $window.localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  };

  // Get token
  this.getToken = function() {
    return $window.localStorage.getItem(TOKEN_KEY);
  };

  // Check if logged in
  this.isLoggedIn = function() {
    return !!$window.localStorage.getItem(TOKEN_KEY);
  };

  // Check if admin
  this.isAdmin = function() {
    var user = this.getUser();
    return user && user.role === 'admin';
  };

  // Clear session (logout)
  this.logout = function() {
    $window.localStorage.removeItem(TOKEN_KEY);
    $window.localStorage.removeItem(USER_KEY);
  };

}]);
