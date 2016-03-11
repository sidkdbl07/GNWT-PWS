if (Meteor.isClient) {
  Template.question_in_group_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
  });

  Template.question_in_group_view.helpers({
    'question': function() {
      return Questions.findOne({_id: this.question_id});
    },
    'group': function() {
      return Question_Groups.findOne({_id: this.group_id});
    },
    'page': function() {
      var group = Question_Groups.findOne({_id: this.group_id});
      return Pages.findOne({_id: group.page_id});
    },
    'book': function() {
      var group = Question_Groups.findOne({_id: this.group_id});
      var page = Pages.findOne({_id: group.page_id});
      return Books.findOne({_id: page.book_id});
    }
  });
}
