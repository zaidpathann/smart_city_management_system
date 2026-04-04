/**
 * Admin Controllers
 * AdminController, AdminComplaintsController, AdminAnnouncementsController,
 * AdminParkingController, AdminFeedbackController,
 * AdminReportsController, AdminServicesController, AdminUsersController
 */

/* ── Admin Dashboard (overview) ── */
app.controller('AdminController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.stats = { total: 0, pending: 0, inProgress: 0, resolved: 0 };
  $scope.recentComplaints  = [];
  $scope.recentAnnouncements = [];
  $scope.loading = true;

  // Load stats
  ApiService.getComplaintStats().then(function(res) {
    $scope.stats = res.data.stats || $scope.stats;
  });

  // Load recent complaints
  ApiService.getAllComplaints().then(function(res) {
    $scope.recentComplaints = (res.data.complaints || []).slice(0, 8);
    $scope.loading = false;
  }).catch(function() { $scope.loading = false; });

  // Load announcements
  ApiService.getAnnouncements().then(function(res) {
    $scope.recentAnnouncements = (res.data.announcements || []).slice(0, 5);
  });

  $scope.statusClass = function(s) {
    return { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved' }[s] || 'badge-pending';
  };

  $scope.formatDate = function(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
}]);

/* ── Admin: Manage All Complaints ── */
app.controller('AdminComplaintsController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.complaints = [];
  $scope.loading    = true;
  $scope.filter     = 'all';

  function load() {
    ApiService.getAllComplaints().then(function(res) {
      $scope.complaints = res.data.complaints || [];
      $scope.loading = false;
    });
  }
  load();

  $scope.filteredComplaints = function() {
    if ($scope.filter === 'all') return $scope.complaints;
    return $scope.complaints.filter(function(c) {
      return c.status.toLowerCase().replace(' ', '') === $scope.filter;
    });
  };

  $scope.updateStatus = function(c, status) {
    ApiService.updateComplaint(c._id, { status: status, adminNote: c.adminNote || '' })
      .then(function(res) { c.status = res.data.complaint.status; })
      .catch(function() { alert('Update failed'); });
  };

  $scope.deleteComplaint = function(id) {
    if (!confirm('Delete this complaint?')) return;
    ApiService.deleteComplaint(id).then(function() {
      $scope.complaints = $scope.complaints.filter(function(c) { return c._id !== id; });
    });
  };

  $scope.statusClass = function(s) {
    return { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved' }[s] || 'badge-pending';
  };
  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);

/* ── Admin: Announcements ── */
app.controller('AdminAnnouncementsController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.announcements = [];
  $scope.ann = { priority: 'Medium' };
  $scope.priorities = ['Low', 'Medium', 'High', 'Emergency'];
  $scope.loading  = false;
  $scope.error    = '';
  $scope.success  = '';

  function load() {
    ApiService.getAnnouncements().then(function(res) {
      $scope.announcements = res.data.announcements || [];
    });
  }
  load();

  $scope.postAnnouncement = function() {
    $scope.error = '';
    if (!$scope.ann.title || !$scope.ann.content) {
      $scope.error = 'Title and content are required.';
      return;
    }
    $scope.loading = true;
    ApiService.postAnnouncement($scope.ann)
      .then(function(res) {
        $scope.announcements.unshift(res.data.announcement);
        $scope.ann = { priority: 'Medium' };
        $scope.success = 'Announcement posted!';
        setTimeout(function() { $scope.$apply(function() { $scope.success = ''; }); }, 2500);
      })
      .catch(function(err) { $scope.error = err.data ? err.data.message : 'Failed.'; })
      .finally(function() { $scope.loading = false; });
  };

  $scope.deleteAnnouncement = function(id) {
    if (!confirm('Delete this announcement?')) return;
    ApiService.deleteAnnouncement(id).then(function() {
      $scope.announcements = $scope.announcements.filter(function(a) { return a._id !== id; });
    });
  };

  $scope.priorityClass = function(p) {
    return { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Emergency: 'badge-emergency' }[p] || 'badge-medium';
  };
  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);

/* ── Admin: Parking Management ── */
app.controller('AdminParkingController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.parkings  = [];
  $scope.parking   = { status: 'Available', fee: 'Free' };
  $scope.statuses  = ['Available', 'Full', 'Closed'];
  $scope.loading   = false;
  $scope.error     = '';
  $scope.success   = '';

  function load() {
    ApiService.getParkings().then(function(res) {
      $scope.parkings = res.data.parkings || [];
    });
  }
  load();

  $scope.addParking = function() {
    $scope.error = '';
    if (!$scope.parking.name || !$scope.parking.address || !$scope.parking.totalSlots) {
      $scope.error = 'Name, address and total slots are required.';
      return;
    }
    $scope.parking.availableSlots = $scope.parking.availableSlots || $scope.parking.totalSlots;
    $scope.loading = true;
    ApiService.addParking($scope.parking)
      .then(function(res) {
        $scope.parkings.push(res.data.parking);
        $scope.parking = { status: 'Available', fee: 'Free' };
        $scope.success = 'Parking location added!';
        setTimeout(function() { $scope.$apply(function() { $scope.success = ''; }); }, 2000);
      })
      .catch(function(err) { $scope.error = err.data ? err.data.message : 'Failed.'; })
      .finally(function() { $scope.loading = false; });
  };

  $scope.toggleStatus = function(p) {
    var next = p.status === 'Available' ? 'Full' : 'Available';
    ApiService.updateParking(p._id, { status: next, availableSlots: next === 'Full' ? 0 : p.totalSlots })
      .then(function(res) {
        p.status = res.data.parking.status;
        p.availableSlots = res.data.parking.availableSlots;
      });
  };

  $scope.deleteParking = function(id) {
    if (!confirm('Delete this parking location?')) return;
    ApiService.deleteParking(id).then(function() {
      $scope.parkings = $scope.parkings.filter(function(p) { return p._id !== id; });
    });
  };

  $scope.statusClass = function(s) {
    return { Available: 'badge-available', Full: 'badge-full', Closed: 'badge-closed' }[s] || 'badge-closed';
  };
}]);

/* ── Admin: Feedback ── */
app.controller('AdminFeedbackController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.feedbacks = [];
  $scope.loading   = true;

  ApiService.getAllFeedback().then(function(res) {
    $scope.feedbacks = res.data.feedbacks || [];
    $scope.loading = false;
  }).catch(function() { $scope.loading = false; });

  $scope.markRead = function(f) {
    ApiService.markFeedbackRead(f._id).then(function() { f.isRead = true; });
  };

  $scope.deleteFeedback = function(id) {
    if (!confirm('Delete this feedback?')) return;
    ApiService.deleteFeedback(id).then(function() {
      $scope.feedbacks = $scope.feedbacks.filter(function(f) { return f._id !== id; });
    });
  };

  $scope.stars = function(r) { return new Array(r); };
  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);

/* ── Admin: Reports ── */
app.controller('AdminReportsController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.reports  = [];
  $scope.loading  = true;

  ApiService.getAllReports().then(function(res) {
    $scope.reports = res.data.reports || [];
    $scope.loading = false;
  }).catch(function() { $scope.loading = false; });

  $scope.updateStatus = function(r, status) {
    ApiService.updateReport(r._id, { status: status }).then(function(res) {
      r.status = res.data.report.status;
    });
  };

  $scope.deleteReport = function(id) {
    if (!confirm('Delete this report?')) return;
    ApiService.deleteReport(id).then(function() {
      $scope.reports = $scope.reports.filter(function(r) { return r._id !== id; });
    });
  };

  $scope.statusClass = function(s) {
    return { Pending: 'badge-pending', 'In Progress': 'badge-progress', Resolved: 'badge-resolved' }[s] || 'badge-pending';
  };
  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);

/* ── Admin: Service Requests ── */
app.controller('AdminServicesController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.requests = [];
  $scope.loading  = true;

  ApiService.getAllServices().then(function(res) {
    $scope.requests = res.data.requests || [];
    $scope.loading = false;
  }).catch(function() { $scope.loading = false; });

  $scope.updateStatus = function(r, status) {
    ApiService.updateService(r._id, { status: status }).then(function(res) {
      r.status = res.data.request.status;
    });
  };

  $scope.deleteService = function(id) {
    if (!confirm('Delete this request?')) return;
    ApiService.deleteService(id).then(function() {
      $scope.requests = $scope.requests.filter(function(r) { return r._id !== id; });
    });
  };

  $scope.statusClass = function(s) {
    return { Pending: 'badge-pending', Assigned: 'badge-progress', Resolved: 'badge-resolved' }[s] || 'badge-pending';
  };
  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);

/* ── Admin: Users ── */
app.controller('AdminUsersController', ['$scope', 'ApiService',
function($scope, ApiService) {

  $scope.users   = [];
  $scope.loading = true;

  ApiService.getAllUsers().then(function(res) {
    $scope.users = res.data.users || [];
    $scope.loading = false;
  }).catch(function() { $scope.loading = false; });

  $scope.deleteUser = function(id) {
    if (!confirm('Delete this user?')) return;
    ApiService.deleteUser(id).then(function() {
      $scope.users = $scope.users.filter(function(u) { return u._id !== id; });
    });
  };

  $scope.formatDate = function(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
}]);
