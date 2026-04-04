/**
 * MiscController.js
 * FeedbackController, ServiceController, EmergencyController
 */

/* ── Feedback ── */
app.controller('FeedbackController', ['$scope', '$location', 'ApiService',
function($scope, $location, ApiService) {
  $scope.feedback = { rating: 4 };
  $scope.loading  = false;
  $scope.error    = '';
  $scope.success  = '';
  $scope.stars    = [1, 2, 3, 4, 5];

  $scope.setRating = function(r) { $scope.feedback.rating = r; };

  $scope.submitFeedback = function() {
    $scope.error = '';
    if (!$scope.feedback.subject || !$scope.feedback.message) {
      $scope.error = 'Subject and message are required.';
      return;
    }
    $scope.loading = true;
    ApiService.submitFeedback($scope.feedback)
      .then(function() {
        $scope.success = 'Thank you for your feedback!';
        setTimeout(function() { $scope.$apply(function() { $location.path('/dashboard'); }); }, 1500);
      })
      .catch(function(err) { $scope.error = err.data ? err.data.message : 'Failed.'; })
      .finally(function() { $scope.loading = false; });
  };
}]);

/* ── Utility Service Request ── */
app.controller('ServiceController', ['$scope', '$location', 'ApiService',
function($scope, $location, ApiService) {
  $scope.service = { serviceType: 'Water' };
  $scope.loading = false;
  $scope.error   = '';
  $scope.success = '';
  $scope.serviceTypes = ['Water', 'Electricity', 'Gas', 'Internet', 'Sewage', 'Other'];

  $scope.submitService = function() {
    $scope.error = '';
    if (!$scope.service.serviceType || !$scope.service.description || !$scope.service.address) {
      $scope.error = 'All fields are required.';
      return;
    }
    $scope.loading = true;
    ApiService.submitService($scope.service)
      .then(function() {
        $scope.success = 'Service request submitted!';
        setTimeout(function() { $scope.$apply(function() { $location.path('/dashboard'); }); }, 1500);
      })
      .catch(function(err) { $scope.error = err.data ? err.data.message : 'Failed.'; })
      .finally(function() { $scope.loading = false; });
  };
}]);

/* ── Emergency Contacts ── */
app.controller('EmergencyController', ['$scope', function($scope) {
  $scope.contacts = [
    { name: 'Police',              number: '100',  icon: '🚔', cls: 'police',    desc: 'Law enforcement emergency' },
    { name: 'Fire Brigade',        number: '101',  icon: '🚒', cls: 'fire',      desc: 'Fire & rescue services' },
    { name: 'Ambulance',           number: '102',  icon: '🚑', cls: 'ambulance', desc: 'Medical emergency' },
    { name: 'Women Helpline',      number: '1091', icon: '🛡️', cls: 'women',    desc: 'Women safety & support' },
    { name: 'Disaster Management', number: '108',  icon: '⚠️', cls: 'disaster', desc: 'Natural disasters & accidents' },
    { name: 'Child Helpline',      number: '1098', icon: '👶', cls: 'ambulance', desc: 'Child welfare services' }
  ];
}]);
