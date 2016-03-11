if (Meteor.isClient) {
  Template.building_view.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  Template.building_view.helpers({
  	'all_inspects': function(building_id) {
  		console.log("Building ID: ", building_id);
  		return Inspections.find({ building_id: building_id });
  	},
  	'user': function(user_id) {
  		console.log("User Id: ", user_id);
  		return Meteor.users.findOne({
  			_id: user_id
  		});
  	},
  	'book': function(book_id) {
  		console.log("Book Id: ", book_id);
  		return Books.findOne({
  			_id: book_id
  		});
  	}
  });
}
