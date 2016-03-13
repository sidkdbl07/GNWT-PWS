if (Meteor.isClient) {
  Template.answer_draw_at_a_location.onRendered(function() {
    $.publish('page_changed',"buildings");

    // building = Buildings.findOne({_id: this.building_id}).fetch();
    if(this.data.building)
    {
      // building = Buildings.findOne({_id: this.building._id}).fetch();
      let building = this.data.building;

      map = L.map('map', {zoomControl: false}).setView([building.location.coordinates[1], building.location.coordinates[0]], 5);

      L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png').addTo(map);
      var imageUrl = 'http://localhost:3000/images/Hospital.jpg',
        imageBounds = [[62.4658007641611,-114.450533917207],[82.4670926867988,-84.44751361509]];
      L.imageOverlay(imageUrl, imageBounds).addTo(map);
    }
    
  });

  Template.answer_draw_at_a_location.helpers({
    'questions_in_group': function() {
      return Question_In_Group.find({group_id: this.group._id},{sort: {sort_order: 1}}).fetch();
    }
  });
}
