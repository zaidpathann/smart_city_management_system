/**
 * ParkingController
 * Citizen view for parking availability
 */
app.controller('ParkingController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.parkings = [];
  $scope.loading  = true;
  $scope.error    = '';

  ApiService.getParkings()
    .then(function(res) {
      $scope.parkings = res.data.parkings || [];
    })
    .catch(function() { $scope.error = 'Failed to load parking data.'; })
    .finally(function() { $scope.loading = false; });

  // Compute fill percentage for the progress bar
  $scope.fillPercent = function(p) {
    if (!p.totalSlots) return 0;
    return Math.round(((p.totalSlots - p.availableSlots) / p.totalSlots) * 100);
  };

  // Color for parking bar
  $scope.barColor = function(p) {
    var pct = $scope.fillPercent(p);
    if (pct >= 90) return '#f85149';
    if (pct >= 60) return '#d29922';
    return '#3fb950';
  };

  $scope.statusClass = function(s) {
    if (s === 'Available') return 'badge-available';
    if (s === 'Full')      return 'badge-full';
    return 'badge-closed';
  };

}]);
