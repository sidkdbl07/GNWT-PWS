if (Meteor.isClient) {
  Template.question_edit.onRendered(function() {
    $.publish('page_changed',"questions");
    $(".collapsible").collapsible();
  });

  Template.question_edit.helpers({
    'number_of_tags': function() {
      return $("input[name^='tags']").length;
    }
  });

  AutoForm.hooks({
    'update_question': {
      onSuccess: function(formType, result) {
        $.publish('toast',["Your update was successful!","Question Saved",'success']);
      },
      onError: function(formType, error) {
        $.publish('toast',[error,"Whoops! That didn't work!",'error']);
      }
    }
  })
}
