if (Meteor.isClient) {
  Template.buildings.onRendered(function() {

  });

  Template.buildings.onCreated(function() {
    var self = this;
    self.autorun(function() {
      if( Meteor.status().connected ) {
        Meteor.subscribe("buildings");
      };
    });
  });

  Template.buildings.helpers({
    'all_buildings': function() {
      return Buildings.find().fetch();
    },
    'formatted_year': function(datestamp) {
      return moment(datestamp).format("YYYY")+" ("+moment(datestamp).fromNow()+")";
    }
  });

  Template.buildings.events({

  });
}
