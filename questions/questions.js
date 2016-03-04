if (Meteor.isClient) {
  Template.questions.onRendered(function() {
    $.publish('page_changed',"questions");
    $(".collapsible").collapsible();
  });

  Template.questions.helpers({
    'all_questions': function() {
      return Questions.find().fetch();
    }
  });

  Template.questions.events({

  });

}
