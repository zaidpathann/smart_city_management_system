/**
 * ApiService
 * Centralised HTTP layer for all backend API calls
 */

app.service('ApiService', ['$http', function($http) {

  var BASE = 'http://localhost:5000/api';

  /* ── Users ── */
  this.register = function(data)  { return $http.post(BASE + '/users/register', data); };
  this.login    = function(data)  { return $http.post(BASE + '/users/login', data); };
  this.getProfile  = function()   { return $http.get(BASE + '/users/profile'); };
  this.getAllUsers  = function()   { return $http.get(BASE + '/users/all'); };
  this.deleteUser  = function(id) { return $http.delete(BASE + '/users/' + id); };

  /* ── Complaints ── */
  this.submitComplaint = function(fd)  { return $http.post(BASE + '/complaints', fd, { headers: { 'Content-Type': undefined } }); };
  this.getMyComplaints = function()    { return $http.get(BASE + '/complaints/my'); };
  this.getAllComplaints = function()    { return $http.get(BASE + '/complaints'); };
  this.getComplaintStats = function()  { return $http.get(BASE + '/complaints/stats'); };
  this.updateComplaint = function(id, data) { return $http.put(BASE + '/complaints/' + id, data); };
  this.deleteComplaint = function(id)  { return $http.delete(BASE + '/complaints/' + id); };

  /* ── Announcements ── */
  this.getAnnouncements    = function()     { return $http.get(BASE + '/announcements'); };
  this.postAnnouncement    = function(data) { return $http.post(BASE + '/announcements', data); };
  this.deleteAnnouncement  = function(id)   { return $http.delete(BASE + '/announcements/' + id); };

  /* ── Feedback ── */
  this.submitFeedback  = function(data) { return $http.post(BASE + '/feedback', data); };
  this.getMyFeedback   = function()     { return $http.get(BASE + '/feedback/my'); };
  this.getAllFeedback   = function()     { return $http.get(BASE + '/feedback'); };
  this.markFeedbackRead = function(id)  { return $http.put(BASE + '/feedback/' + id + '/read', {}); };
  this.deleteFeedback   = function(id)  { return $http.delete(BASE + '/feedback/' + id); };

  /* ── Parking ── */
  this.getParkings    = function()        { return $http.get(BASE + '/parking'); };
  this.addParking     = function(data)    { return $http.post(BASE + '/parking', data); };
  this.updateParking  = function(id, data){ return $http.put(BASE + '/parking/' + id, data); };
  this.deleteParking  = function(id)      { return $http.delete(BASE + '/parking/' + id); };

  /* ── Service Requests ── */
  this.submitService   = function(data)      { return $http.post(BASE + '/services', data); };
  this.getMyServices   = function()          { return $http.get(BASE + '/services/my'); };
  this.getAllServices   = function()          { return $http.get(BASE + '/services'); };
  this.updateService   = function(id, data)  { return $http.put(BASE + '/services/' + id, data); };
  this.deleteService   = function(id)        { return $http.delete(BASE + '/services/' + id); };

  /* ── Cleanliness Reports ── */
  this.submitReport  = function(fd)      { return $http.post(BASE + '/reports', fd, { headers: { 'Content-Type': undefined } }); };
  this.getMyReports  = function()        { return $http.get(BASE + '/reports/my'); };
  this.getAllReports  = function()        { return $http.get(BASE + '/reports'); };
  this.updateReport  = function(id, data){ return $http.put(BASE + '/reports/' + id, data); };
  this.deleteReport  = function(id)      { return $http.delete(BASE + '/reports/' + id); };

}]);
