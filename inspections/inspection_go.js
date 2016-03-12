if (Meteor.isClient) {
  Template.inspection_go.onRendered(function() {
    $.publish('page_changed',"buildings");
    $("ul.tabs").tabs();
  });

  var group_or_first = function(group, inspection) {
    var result = "";
    if(group) {
      result = group;
    } else {
      var book = Books.findOne({_id: inspection.book_id});
      var page = Pages.findOne({book_id: book._id},{sort: {sort_order: 1}});
      result = Question_Groups.findOne({page_id: page._id}, {sort: {sort_order: 1}});
    }
    return result;
  };

  Template.inspection_go.helpers({
    'building': function() {
      return Buildings.findOne({_id: this.inspection.building_id});
    },
    'current_group': function() {
      var result = group_or_first(this.group, this.inspection);
      return result;
    },
    'date_of_inspection': function() {
      //console.log(inspection.date);
      //return inspection.date;
      return moment(this.inspection.date).format("MMMM YYYY")+" ("+moment(this.inspection.date).fromNow()+")";
    },
    'is_draw_at_a_location': function() {
      var group = group_or_first(this.group, this.inspection);
      if(group.type === "Draw at a Location") {
        return true;
      }
      // Change the following to false wen the helper call is working.
      return false;
    },
    'page': function() {
      var book = Books.findOne({_id: this.inspection.book_id});
      return Pages.findOne({book_id: book._id}, {sort: {sort_order: 1}});
    },
    'pages': function() {
      var book = Books.findOne({_id: this.inspection.book_id});
      var pages = Pages.find({book_id: book._id}, {sort: {sort_order: 1}}).fetch();
      var result = [];
      pages.forEach(function(row) {
        var first_group = Question_Groups.findOne({page_id: row._id},{sort: {sort_order: 1}});
        result.push({'group_id': first_group._id, 'page_name': row.name});
      });
      return result;
    }
  });
}
