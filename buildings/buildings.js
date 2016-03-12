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
      return Buildings.find({},{sort: {name: 1}}).fetch();
    },
    'formatted_year': function(datestamp) {
      return moment(datestamp).format("YYYY")+" ("+moment(datestamp).fromNow()+")";
    }
  });

  Template.buildings.events({

  });
}
