if (Meteor.isClient) {
  Template.inspection_view.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  Template.inspection_view.helpers({
  	'user': function(user_id) {
      return Meteor.users.findOne({_id: user_id});
  	},
  	'book': function() {
  		//console.log("Book Id: ", book_id);
  		return Books.findOne({_id: this.book_id});
  	},
    'building': function() {
      return Buildings.findOne({_id: this.building_id});
    },
    'pages': function() {
      var book = Books.findOne({_id: this.book_id});
      return Pages.find({book_id: book._id},{sort: {sort_order: 1}}).fetch();
    },
    'date_of_inspection': function() {
      //console.log(inspection.date);
      //return inspection.date;
      return moment(this.date).format("MMMM YYYY")+" ("+moment(this.date).fromNow()+")";
    }
  });
}
