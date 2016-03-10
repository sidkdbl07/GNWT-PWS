if (Meteor.isClient) {
  Template.questions.onRendered(function() {
    $.publish('page_changed',"questions");
  });

  Template.questions.helpers({
    'all_questions': function() {
      return Questions.find({},{sort: {text: 1}}).fetch();
    },
    'number_of_choices': function(id) {
      return Questions.findOne({_id: id}).allowed_values.length;
    },
    'pictures_enabled': function(id) {
      var question = Questions.findOne({_id: id});
      if(question.pictures === "Permitted" || question.pictures === "Required") {
        return true;
      }
      return false;
    },
    'is_multiple_choice': function(id) {
      var question = Questions.findOne({_id: id});
      if(question.type === "Multiple Choice") {
        return true;
      }
      return false;
    },
    'is_numeric': function(id) {
      var question = Questions.findOne({_id: id});
      if(question.type === "Numeric") {
        return true;
      }
      return false;
    },
    'is_year': function(id) {
      var question = Questions.findOne({_id: id});
      if(question.type === "Year") {
        return true;
      }
      return false;
    },
    'is_geo_point': function(id) {
      var question = Questions.findOne({_id: id});
      if(question.type === "Geo-Point") {
        return true;
      }
      return false;
    }
  });

  Template.questions.events({

  });

}
