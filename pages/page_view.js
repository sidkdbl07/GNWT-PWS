if (Meteor.isClient) {
  Template.page_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
    $(".collapsible").collapsible({
      accordian: true
    })
  });

  Template.page_view.helpers({
    'book': function() {
      //console.log(this.book_id);
      return Books.findOne({_id: this.book_id});
    },
    'decision_points': function() {
      return Decision_Points.find({question_id},{sort: {sort_order: 1}}).fetch();
    },
    'groups': function() {
      return Question_Groups.find({page_id: this._id},{sort: {'sort_order': 1}}).fetch();
    },
    'questions_in_group': function(group_id) {
      return Question_In_Group.find({group_id: group_id}, {sort: {sort_order: 1}}).fetch();
    },
    'question': function(question_id) {
      return Questions.findOne({_id: question_id});
    }
  });
}
