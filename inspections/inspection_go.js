if (Meteor.isClient) {
  Template.inspection_go.onRendered(function() {
    $.publish('page_changed',"buildings");
    //$("ul.tabs").tabs();
    console.log("inspection_go onRendered");
  });

  // var group_or_first = function(group, inspection) {
  //   var result = "";
  //   if(group) {
  //     result = group;
  //   } else {
  //     var book = Books.findOne({_id: inspection.book_id});
  //     var page = Pages.findOne({book_id: book._id},{sort: {sort_order: 1}});
  //     result = Question_Groups.findOne({page_id: page._id}, {sort: {sort_order: 1}});
  //   }
  //   return result;
  // };

  Template.inspection_go.helpers({
    'current_group_instance': function() {
      return new Array({'group': this.group, 'instance': this.instance});
    },
    'date_of_inspection': function() {
      //console.log(inspection.date);
      //return inspection.date;
      return moment(this.inspection.date).format("MMMM YYYY")+" ("+moment(this.inspection.date).fromNow()+")";
    },
    'is_simple': function() {
      var group = this.group
      if(group.type === "Simple") {
        return true;
      }
      return false;
    },
    'has_multiple_instance': function() {
      var group = this.group;
      if(group.multiple)
      {
        console.log("multiple instance group");
        return true;
      }
      return false;
    },
    'instances_of_group': function(group, inspection) {
      let instances = new Set(["0"]);
      let curr_group = group;
      let answers = Answers.find({inspection_id: inspection._id, group_id: curr_group._id}).fetch();
      for(answer of answers) {
        // if(answer.instance)
        instances.add(answer.instance);
      }
      return Array.from(instances);
    },
    'new_instance_of_group': function(group, inspection) {
      let curr_group = group;
      let newestAnswer = Answers.findOne({inspection_id: inspection._id, group_id: curr_group._id}, {sort: {instance: -1}});
      if(newestAnswer)
      {
        return (parseInt(newestAnswer.instance) + 1).toString();
      }
      else
        return "1";
    },
    'next_group': function() {
      var current_group = this.group;
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
      var current_group = this.group;
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
      var current_group = this.group;
      var previous_group = Question_Groups.findOne({'page_id': current_group.page_id, sort_order: {$lt: current_group.sort_order}}, {sort: {sort_order: -1}});
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
