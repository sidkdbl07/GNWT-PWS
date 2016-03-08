if (Meteor.isClient) {
  Template.building_view.onRendered(function() {
    $.publish('page_changed',"buildings");
  });

  Template.page_view.helpers({

  });
}
