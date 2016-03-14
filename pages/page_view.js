if (Meteor.isClient) {
  Template.page_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
    $(".collapsible").collapsible({
      accordion: true
    });
    $("select").material_select();
  });

  Template.page_view.helpers({
    'book': function() {
      //console.log(this.book_id);
      return Books.findOne({_id: this.book_id});
    },
    'decision_points': function(qig_id) {
      return Decision_Points.find({qig_id: qig_id},{sort: {sort_order: 1}}).fetch();
    },
    'groups': function() {
      return Question_Groups.find({page_id: this._id},{sort: {'sort_order': 1}}).fetch();
    },
    'questions_in_group': function(group_id) {
      return Question_In_Group.find({group_id: group_id}, {sort: {sort_order: 1}}).fetch();
    },
    'question': function(qig_id) {
      qig = Question_In_Group.findOne({_id: qig_id});
      return Questions.findOne({_id: qig.question_id});
    },
    'qigs_after_this': function(qig_id) {
      var results = [];
      var q = Question_In_Group.findOne({_id: qig_id}); // current Question_In_Group
      var group = Question_Groups.findOne({_id: q.group_id})
      while(group) {
         var questions = Question_In_Group.find({group_id: q.group_id, sort_order: {$gt: q.sort_order}}, {sort: {sort_order: 1}});
         results.concat(questions);
         group = Question_Groups.findOne({page_id: group.page_id, sort_order: (group.sort_order+1)}, {sort: {sort_order: 1}});
      }
      return results;
    }
  });
}
