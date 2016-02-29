if (Meteor.isClient) {
  // Publication / Subscription
  (function($) {
    var o = $({});
    $.subscribe = function() {
      o.on.apply(o, arguments);
    };
    $.unsubscribe = function() {
      o.off.apply(o, arguments);
    };
    $.publish = function() {
      o.trigger.apply(o, arguments);
    };
  }(jQuery));

  $.subscribe("toast", function(e, message, title, type) {
    var color = "teal";
    if(type == "error")
      color = "red";
    if(type == "warning")
      color = "amber";
    if(type == "success")
      color = "green"
    Materialize.toast($("<p>"+title+"<br/>"+message+"</p>"), 3000, color);
  })
}
