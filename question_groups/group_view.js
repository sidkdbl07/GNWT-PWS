if (Meteor.isClient) {
  Template.group_view.onRendered(function() {
    $.publish('page_changed',"books");
    $('ul.tabs').tabs();
  });

  Template.group_view.helpers({
    'book': function() {
      var page = Pages.findOne({_id: this.page_id});
      return Books.findOne({_id: page.book_id});
    },
    'page': function() {
      return Pages.findOne({_id: this.page_id});
    },
    'all_questions': function(group_id) {
      let questions_in_group = Question_In_Group.find({'group_id': group_id},{sort: {sort_order: 1}}).fetch();
      for(question_in_group in questions_in_group) 
      {

      }
    }
  });
}
