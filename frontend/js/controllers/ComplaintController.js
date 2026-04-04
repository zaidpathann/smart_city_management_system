/**
 * ComplaintController
 * Handles complaint submission with image upload
 */
app.controller('ComplaintController', ['$scope', '$location', 'ApiService',
function($scope, $location, ApiService) {

  $scope.complaint = { category: 'Other' };
  $scope.loading   = false;
  $scope.error     = '';
  $scope.success   = '';
  $scope.imagePreview = null;
  $scope.selectedFile = null;

  $scope.categories = ['Road', 'Water', 'Electricity', 'Sanitation', 'Noise', 'Other'];

  // Handle file selection & preview
  $scope.onFileSelect = function(element) {
    var file = element.files[0];
    if (!file) return;
    $scope.selectedFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      $scope.$apply(function() { $scope.imagePreview = e.target.result; });
    };
    reader.readAsDataURL(file);
  };

  $scope.submitComplaint = function() {
    $scope.error = '';
    if (!$scope.complaint.title || !$scope.complaint.description) {
      $scope.error = 'Title and description are required.';
      return;
    }
    $scope.loading = true;

    // Build FormData for multipart upload
    var fd = new FormData();
    fd.append('title',       $scope.complaint.title);
    fd.append('description', $scope.complaint.description);
    fd.append('category',    $scope.complaint.category);
    if ($scope.selectedFile) {
      fd.append('image', $scope.selectedFile);
    }

    ApiService.submitComplaint(fd)
      .then(function() {
        $scope.success = 'Complaint submitted successfully!';
        setTimeout(function() { $scope.$apply(function() { $location.path('/dashboard'); }); }, 1500);
      })
      .catch(function(err) {
        $scope.error = err.data ? err.data.message : 'Submission failed.';
      })
      .finally(function() { $scope.loading = false; });
  };

}]);

/**
 * ReportController
 * Cleanliness / Waste report submission
 */
app.controller('ReportController', ['$scope', '$location', 'ApiService',
function($scope, $location, ApiService) {

  $scope.report = { category: 'Garbage' };
  $scope.loading = false;
  $scope.error   = '';
  $scope.success = '';
  $scope.imagePreview = null;
  $scope.selectedFile = null;

  $scope.categories = ['Garbage', 'Open Drain', 'Stagnant Water', 'Illegal Dumping', 'Other'];

  $scope.onFileSelect = function(element) {
    var file = element.files[0];
    if (!file) return;
    $scope.selectedFile = file;
    var reader = new FileReader();
    reader.onload = function(e) {
      $scope.$apply(function() { $scope.imagePreview = e.target.result; });
    };
    reader.readAsDataURL(file);
  };

  $scope.submitReport = function() {
    $scope.error = '';
    if (!$scope.report.category || !$scope.report.location || !$scope.report.description) {
      $scope.error = 'All fields are required.';
      return;
    }
    $scope.loading = true;

    var fd = new FormData();
    fd.append('category',    $scope.report.category);
    fd.append('location',    $scope.report.location);
    fd.append('description', $scope.report.description);
    if ($scope.selectedFile) fd.append('image', $scope.selectedFile);

    ApiService.submitReport(fd)
      .then(function() {
        $scope.success = 'Report submitted successfully!';
        setTimeout(function() { $scope.$apply(function() { $location.path('/dashboard'); }); }, 1500);
      })
      .catch(function(err) {
        $scope.error = err.data ? err.data.message : 'Submission failed.';
      })
      .finally(function() { $scope.loading = false; });
  };

}]);
