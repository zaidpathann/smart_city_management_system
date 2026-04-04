/**
 * DashboardController
 * Citizen dashboard — shows complaints, announcements, AQI, etc.
 */
app.controller('DashboardController', ['$scope', 'ApiService', 'AuthService',
function($scope, ApiService, AuthService) {

  var user = AuthService.getUser();
  $scope.userName  = user ? user.name : 'Citizen';
  $scope.complaints = [];
  $scope.announcements = [];
  $scope.services = [];
  $scope.reports  = [];
  $scope.loading  = true;

  // Dummy AQI data
  $scope.aqi = { value: 87, category: 'Moderate', color: 'aqi-moderate' };
  $scope.aqiPercent = Math.min(($scope.aqi.value / 300) * 100, 100);

  function loadAll() {
    // Complaints
    ApiService.getMyComplaints().then(function(res) {
      $scope.complaints = res.data.complaints || [];
    });
    // Announcements
    ApiService.getAnnouncements().then(function(res) {
      $scope.announcements = (res.data.announcements || []).slice(0, 5);
    });
    // Service requests
    ApiService.getMyServices().then(function(res) {
      $scope.services = res.data.requests || [];
    });
    // Reports
    ApiService.getMyReports().then(function(res) {
      $scope.reports = res.data.reports || [];
      $scope.loading = false;
    }).catch(function() { $scope.loading = false; });
  }

  loadAll();

  // Computed counts
  $scope.pendingCount  = function() { return $scope.complaints.filter(function(c) { return c.status === 'Pending'; }).length; };
  $scope.resolvedCount = function() { return $scope.complaints.filter(function(c) { return c.status === 'Resolved'; }).length; };

  $scope.statusClass = function(status) {
    if (status === 'Pending')     return 'badge-pending';
    if (status === 'In Progress') return 'badge-progress';
    if (status === 'Resolved')    return 'badge-resolved';
    return 'badge-pending';
  };

  $scope.priorityClass = function(p) {
    var m = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Emergency: 'badge-emergency' };
    return m[p] || 'badge-medium';
  };

  $scope.formatDate = function(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

}]);
