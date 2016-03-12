if (Meteor.isClient) {
  Template.inspection_go.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  Template.inspection_go.helpers({
    'building': function() {
      return Buildings.findOne({_id: this.building_id});
    },
    'date_of_inspection': function() {
      //console.log(inspection.date);
      //return inspection.date;
      return moment(this.date).format("MMMM YYYY")+" ("+moment(this.date).fromNow()+")";
    },
    'page': function() {
      var book = Books.findOne({_id: this.book_id});
      return Pages.findOne({book_id: book._id}, {sort: {sort_order: 1}});
    },
    'group': function() {
      var book = Books.findOne({_id: this.book_id});
      var page = Pages.findOne({book_id: book._id}, {sort: {sort_order: 1}});
      return Question_Groups.findOne({page_id: page._id},{sort: {sort_order: 1}});
    },
    'is_draw_at_a_location': function() {
      var book = Books.findOne({_id: this.book_id});
      var page = Pages.findOne({book_id: book._id}, {sort: {sort_order: 1}});
      var group = Question_Groups.findOne({page_id: page._id},{sort: {sort_order: 1}});
      if(group.type === "Draw at a Location") {
        return true;
      }
      return false;
    }
  });
}
