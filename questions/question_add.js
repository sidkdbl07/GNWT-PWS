if (Meteor.isClient) {
  Template.question_add.onRendered(function() {
    $.publish('page_changed',"questions");
    $(".collapsible").collapsible();
  });

  Template.question_add.helpers({
    'number_of_tags': function() {
      return $("input[name^='tags']").length;
    }
  });

  Template.question_add.events({

  });

  AutoForm.hooks({
    'insert_question': {
      before: {
        insert: function(doc) {
          return doc;
        }
      },
      onSubmit: function(insertDoc) {
        Meteor.call('addQuestion', insertDoc, function(error, result) {
          if(error) alert(error.reason);
        });
        $(".back-button").click();
        return false;
      },
      onSuccess: function(formType, result) {
        $.publish('toast',["Your addition was successful!","Question Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  });
}
