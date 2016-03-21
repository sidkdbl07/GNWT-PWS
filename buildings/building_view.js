if (Meteor.isClient) {
  Template.building_view.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  Template.building_view.helpers({
  	'all_inspects': function(building_id) {
  		//console.log("Building ID: ", building_id);
  		return Inspections.find({ building_id: building_id },{sort: {date: -1}});
  	},
  	'user': function(user_id) {
  		//console.log("User Id: ", user_id);
  		return Meteor.users.findOne({
  			_id: user_id
  		});
  	},
  	'book': function(book_id) {
  		//console.log("Book Id: ", book_id);
  		return Books.findOne({
  			_id: book_id
  		});
  	},
    'date_of_inspection': function(inspection_id) {
      var inspection = Inspections.findOne({_id: inspection_id})
      //console.log(inspection.date);
      //return inspection.date;
      return moment(inspection.date).format("MMMM YYYY")+" ("+moment(inspection.date).fromNow()+")";
    }
  });
}
