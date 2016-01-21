// Functions

_formatTime = function(milliseconds, format) {
  if(!format) format = "h:mm A, MMMM DD";
  return moment(milliseconds).format(format);
}

_showModal = function(selector) {
  $(selector)
    .modal({
      "transition": "fade up",
      "duration": 200,
      "detachable": false // Needed to maintain Blaze events
    })
    .modal("show");
}

_activeQueues = function() {
  return Queues.find({"status": {$nin: ["ended", "cancelled"]}}).fetch();
}

_activeTickets = function(ticketIds) {
  // Get and filter tickets
  var allTickets = Tickets.find({_id: {$in: ticketIds}}).fetch();
  var activeTickets = _filterActiveTickets(allTickets);

  // Extend tickets with position
  for(var i = 0; i < activeTickets.length; i++) {
    activeTickets[i]["position"] = i + 1;
  }

  return activeTickets;
}

_filterActiveTickets = function(allTickets) {
  return _.filter(allTickets, function(t) {
    return !(_.contains(["done", "cancelled"], t.status));
  });
}

_getLocations = function () {
  return Locations.find({});
}

_timeInMinutes = function(milliseconds) {
  var d = moment.duration(milliseconds, "milliseconds");
  return Math.floor(d.asMinutes());
}

// UI Helpers

UI.registerHelper("activeQueues", _activeQueues);
UI.registerHelper("activeTickets", _activeTickets);
UI.registerHelper("locations", _getLocations);
