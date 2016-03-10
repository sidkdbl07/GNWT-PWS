if (Meteor.isClient) {
  Template.questions.onRendered(function() {
    $.publish('page_changed',"questions");
  });

  Template.questions.helpers({
    'all_questions': function() {
      return Questions.find().fetch();
    },
    'number_of_choices': function(id) {
      return Questions.findOne({_id: id}).allowed_values.length;
    },
    'pictures_enabled': function() {
      return (pictures == "Permitted" || pictures == "Required");
    }
  });

  Template.questions.events({

  });

}
