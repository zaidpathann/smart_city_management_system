/**
 * SmartCity AngularJS Application
 * Defines the main module and client-side routing
 */

var app = angular.module('smartCityApp', ['ngRoute']);

// ─── Route Configuration ──────────────────────────────────────────────────────
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    // Public routes
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthController'
    })

    // Citizen routes
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
      resolve: { auth: requireUser }
    })
    .when('/add-complaint', {
      templateUrl: 'views/add-complaint.html',
      controller: 'ComplaintController',
      resolve: { auth: requireUser }
    })
    .when('/add-report', {
      templateUrl: 'views/add-report.html',
      controller: 'ReportController',
      resolve: { auth: requireUser }
    })
    .when('/add-service', {
      templateUrl: 'views/add-service.html',
      controller: 'ServiceController',
      resolve: { auth: requireUser }
    })
    .when('/add-feedback', {
      templateUrl: 'views/add-feedback.html',
      controller: 'FeedbackController',
      resolve: { auth: requireUser }
    })
    .when('/parking', {
      templateUrl: 'views/parking.html',
      controller: 'ParkingController',
      resolve: { auth: requireUser }
    })
    .when('/emergency', {
      templateUrl: 'views/emergency.html',
      controller: 'EmergencyController',
      resolve: { auth: requireUser }
    })

    // Admin routes
    .when('/admin', {
      templateUrl: 'views/admin-dashboard.html',
      controller: 'AdminController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/complaints', {
      templateUrl: 'views/admin-complaints.html',
      controller: 'AdminComplaintsController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/announcements', {
      templateUrl: 'views/admin-announcements.html',
      controller: 'AdminAnnouncementsController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/parking', {
      templateUrl: 'views/admin-parking.html',
      controller: 'AdminParkingController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/feedback', {
      templateUrl: 'views/admin-feedback.html',
      controller: 'AdminFeedbackController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/reports', {
      templateUrl: 'views/admin-reports.html',
      controller: 'AdminReportsController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/services', {
      templateUrl: 'views/admin-services.html',
      controller: 'AdminServicesController',
      resolve: { auth: requireAdmin }
    })
    .when('/admin/users', {
      templateUrl: 'views/admin-users.html',
      controller: 'AdminUsersController',
      resolve: { auth: requireAdmin }
    })

    .otherwise({ redirectTo: '/' });

}]);

// ─── Route Guards ─────────────────────────────────────────────────────────────
function requireUser($q, $location, AuthService) {
  var deferred = $q.defer();
  var user = AuthService.getUser();
  if (user) {
    deferred.resolve(user);
  } else {
    $location.path('/login');
    deferred.reject('Not authenticated');
  }
  return deferred.promise;
}
requireUser.$inject = ['$q', '$location', 'AuthService'];

function requireAdmin($q, $location, AuthService) {
  var deferred = $q.defer();
  var user = AuthService.getUser();
  if (user && user.role === 'admin') {
    deferred.resolve(user);
  } else if (user) {
    $location.path('/dashboard');
    deferred.reject('Not admin');
  } else {
    $location.path('/login');
    deferred.reject('Not authenticated');
  }
  return deferred.promise;
}
requireAdmin.$inject = ['$q', '$location', 'AuthService'];

// ─── HTTP Interceptor: Attach JWT to every request ────────────────────────────
app.factory('AuthInterceptor', ['$window', function($window) {
  return {
    request: function(config) {
      var token = $window.localStorage.getItem('sc_token');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    }
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);
