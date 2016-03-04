if (Meteor.isClient) {
  Template.buildings.onRendered(function() {
    $.publish('page_changed',"buildings");
  });

  Template.buildings.onCreated(function() {
    var self = this;
    self.autorun(function() {
      if( Meteor.status().connected ) {
        Meteor.subscribe("images");
        Meteor.subscribe("buildings");
      };
    });
  });

  Template.buildings.helpers({
    'all_buildings': function() {
      var buildings = Buildings.find().fetch();
      buildings.forEach(function(each) {
        each.picture = Images.findOne({_id: each.picture});
      });
      return buildings;
    },
    'formatted_year': function(datestamp) {
      return moment(datestamp).format("YYYY")+" ("+moment(datestamp).fromNow()+")";
    }
  });

  Template.buildings.events({

  });
}
