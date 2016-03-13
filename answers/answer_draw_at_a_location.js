if (Meteor.isClient) {
  var map;

  Meteor.subscribe("images");

  Template.answer_draw_at_a_location.onRendered(function() {
    $.publish('page_changed',"buildings");

    // building = Buildings.findOne({_id: this.building_id}).fetch();
    if(this.data.building) {
      // building = Buildings.findOne({_id: this.building._id}).fetch();
      let building = this.data.building;
      let imageUrl, imageBounds;

      map = L.map('answer-map', {zoomControl: false}).setView([building.location.coordinates[1], building.location.coordinates[0]], 15);

      //only display open streetmap for web users
      if(!Meteor.isCordova){
        L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png').addTo(map);
      }

      if (building.picture) {
        console.log("All Images: ", Images.find({}).fetch());
        console.log("Build Picture: ", building.picture);
        imageUrl = Images.findOne({_id: building.picture}).url();
        if(building.bounding_box){
          imageBounds = JSON.parse(building.bounding_box);
          L.imageOverlay(imageUrl, imageBounds).addTo(map);
        }
      }
    }
  });

  Template.answer_draw_at_a_location.helpers({
    'questions_in_group': function() {
      return Question_In_Group.find({group_id: this.group._id},{sort: {sort_order: 1}}).fetch();
    }
  });

  Template.answer_draw_at_a_location.events({
    'click #btn_zoomin': function() {
      map.zoomIn();
    },
    'click #btn_zoomout': function() {
      map.zoomOut();
    }
  });
}
