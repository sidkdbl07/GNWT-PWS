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
    'is_simple': function() {
      var group = group_or_first(this.group, this.inspection);
      if(group.type === "Simple") {
        console.log("Simple Group");
        return true;
      }
      return false;
    },
    'next_group': function() {
      var current_group = group_or_first(this.group, this.inspection);
      var next_group = Question_Groups.findOne({'page_id': current_group.page_id, sort_order: {$gt: current_group.sort_order}}, {sort: {sort_order: 1}});
      if(next_group) {
        return next_group;
      } else {
        var book = Books.findOne({_id: this.inspection.book_id});
        var current_page = Pages.findOne({_id: current_group.page_id});
        var next_page = Pages.findOne({book_id: book._id, sort_order: {$gt: current_page.sort_order}},{sort: {sort_order: 1}});
        if(next_page) {
          next_group =  Question_Groups.findOne({page_id: next_page._id}, {sort: {sort_order: 1}});
        } else {
          return false;
        }
      }
      if(next_group) {
        return next_group;
      } else {
        return false;
      }
    },
    'page': function() {
      var current_group = group_or_first(this.group, this.inspection);
      return Pages.findOne({_id: current_group.page_id}, {sort: {sort_order: 1}});
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
    },
    'previous_group': function() {
      var current_group = group_or_first(this.group, this.inspection);
      var previous_group = Question_Groups.findOne({'page_id': current_group.page_id, sort_order: {$lt: current_group.sort_order}}, {sort: {sort_order: 1}});
      if(previous_group) {
        return previous_group;
      } else {
        var book = Books.findOne({_id: this.inspection.book_id});
        var current_page = Pages.findOne({_id: current_group.page_id});
        var previous_page = Pages.findOne({book_id: book._id, sort_order: {$lt: current_page.sort_order}},{sort: {sort_order: -1}});
        if(previous_page) {
          previous_group =  Question_Groups.findOne({page_id: previous_page._id}, {sort: {sort_order: -1}});
        } else {
          return false;
        }
      }
      if(previous_group) {
        return previous_group;
      } else {
        return false;
      }
    }
  });
}
