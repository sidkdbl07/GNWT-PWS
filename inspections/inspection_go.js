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
    'next_group': function() {
      var current_group = group_or_first(this.group, this.inspection);
      var next_group = Question_Groups.find({'page_id': current_group.page_id, sort_order: {$gt: current_group.sort_order}}, {sort: {sort_order: 1}, limit: 1});
      if(next_group.count() > 0) {
        $.publish('toast',["next group found in same page","Found Group on same page",'info']);
        return next_group.fetch();
      } else {
        $.publish('toast',["","Group not found on same page",'info']);
        var book = Books.findOne({_id: this.inspection.book_id});
        var current_page = Pages.findOne({_id: current_group.page_id});
        var np = Pages.find({book_id: book._id, sort_order: {$gt: current_page.sort_order}},{sort: {sort_order: 1}, limit: 1});
        if(np.count() > 0) {
          $.publish('toast',["","Page found",'info']);
          next_page = np.fetch();
          $.publish('toast',[next_page.name,"Next Page",'info']);
          next_group =  Question_Groups.find({page_id: next_page._id}, {sort: {sort_order: 1}, limit: 1});
        } else {
          $.publish('toast',["no more pages","Next Page not found",'error']);
          return false;
        }
      }
      if(next_group.count() > 0) {
        var g = next_group.fetch();
        $.publish('toast',[g.name,"Next group",'info']);
        return g;
      } else {
        $.publish('toast',["no more groups","Group not found",'error']);
        return false;
      }
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
    },
    'previous_group': function() {
      var current_group = group_or_first(this.group, this.inspection);
      var previous_group = Question_Groups.findOne({'page_id': current_group.page_id, sort_order: {$lt: current_group.sort_order}}, {sort: {sort_order: 1}});
      if(previous_group) {
        return previous_group;
      } else {
        var book = Books.findOne({_id: inspection.book_id});
        var previous_page = Pages.findOne({book_id: book__id, sort_order: {$lt: page.sort_order}},{sort: {sort_order: 1}});
        previous_group =  Question_Groups.findOne({page_id: previous_page._id}, {sort: {sort_order: 1}});
      }
      if(previous_group) {
        return previous_group;
      } else {
        return false;
      }
    }
  });
}
