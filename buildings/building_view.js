if (Meteor.isClient) {
  Template.building_view.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  Template.building_view.helpers({

  });
}
