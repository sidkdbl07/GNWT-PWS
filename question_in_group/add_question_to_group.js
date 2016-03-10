if (Meteor.isClient) {
  Template.add_question_to_group.onRendered(function() {
    $.publish('page_changed',"books");
  });

  Template.add_question_to_group.helpers({
    'book': function() {
      var group = Question_Groups.findOne({_id: this.group._id});
      var page = Pages.findOne({_id: group.page_id});
      return Books.findOne({_id: page.book_id});
    },
    'page': function() {
      var group = Question_Groups.findOne({_id: this.group._id});
      return Pages.findOne({_id: group.page_id});
    },
    'all_questions': function() {
      return Questions.find({}, {fields: {text: 1}, sort: {text: 1}}).map(function (q){
        return {label: q.text, value: q._id};
      });
    }
  });

  Template.add_question_to_group.events({

  });

  AutoForm.hooks({
    'insert_question_in_group': {
      before: {
        insert: function(doc) {
          // doc.group_id = this.group._id;
          // var newestQuestionInGroup = Question_In_Group.findOne({}, { sort: {sort_order: -1} });
          // doc.sort_order = newestQuestionInGroup ? newestQuestionInGroup.sort_order + 1 : 0 ;
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addQuestionToGroup', insertDoc, function(error, result) {
          if(error) $.publish('toast',[error.reason,"An Error Occurred",'error']);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Question Added",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
